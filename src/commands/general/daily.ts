import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/Command.ts';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PrismaClient, Prisma } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const embedDailyPath = join(__dirname, '../../embeds/daily.json');
const embedDaily = JSON.parse(readFileSync(embedDailyPath, 'utf-8'));
const embedhasDailyPath = join(__dirname, '../../embeds/hasdaily.json');
const embedhasDaily = JSON.parse(readFileSync(embedhasDailyPath, 'utf-8'));

dotenv.config();
const prisma = new PrismaClient();

async function hasDaily(userId: string): Promise<boolean | null> {
    const user = await prisma.usuarios.findUnique({
        where: {
            discord_id: userId
        },
        select: {
            hasdaily: Boolean,
        }
    });

    if (!user) {
        return null
    }

    return user.hasdaily;
}

async function lastDaily(userId: string): Promise<Date | null> {
    const user = await prisma.usuarios.findUnique({
        where: {
            discord_id: userId
        },
        select: {
            last_daily: Date,
        }
    });
    if (!user) {
        return null
    }
    return user.last_daily;
}

interface NewUser {
    discord_id: string;
    username?: string;
    hasdaily?: boolean;
    last_daily?: Date;
    dxp?: number;
    coins?: number;
    inventory?: { item: string; quantity: number }[];
}

async function createUser(dados: NewUser) {
    try {
        const newUser = await prisma.usuarios.create({
            data: {
                discord_id: dados.discord_id,
                username: dados.username,
                hasdaily: dados.hasdaily ?? false,
                last_daily: dados.last_daily ?? new Date(),
                dxp: dados.dxp ?? 0,
                coins: dados.coins ?? 0,
                inventory: dados.inventory ?? [],
            },
            select: {
                discord_id: true,
                username: true,
                hasdaily: true,
                last_daily: true,
                dxp: true,
                coins: true,
                inventory: true,
            }
        });
        console.log('Novo usuário criado:', newUser);
        return newUser;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
}

const dragonFoods = [
    'Sushi',
    'Tempura',
    'Ramen',
    'Onigiri',
    'Mochi',
    'Takoyaki',
    'Udon',
    'Sashimi',
    'Karaage',
    'Gyoza'
];

export const DailyCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Resgata sua recompensa diária!'),

    async execute(interaction: CommandInteraction) {
        const hasDailyReward = await hasDaily(interaction.user.id);
        const lastDailyReward = await lastDaily(interaction.user.id);

        if (hasDailyReward === null) {
            const dailyCoins = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
            const dailyDxp = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
            const dailyItem = dragonFoods[Math.floor(Math.random() * dragonFoods.length)];

            let description = embedDaily.embeds[0].description;
            description = description.replace('{daily.coins}', dailyCoins.toString());
            description = description.replace('{daily.dxp}', dailyDxp.toString());
            description = description.replace('{daily.item}', dailyItem);

            createUser({
                discord_id: interaction.user.id,
                username: interaction.user.username,
                hasdaily: true,
                last_daily: new Date(),
                dxp: dailyDxp,
                coins: dailyCoins,
                inventory: [{ item: dailyItem, quantity: 1 }]
            });

            const embed = new EmbedBuilder()
                .setTitle(embedDaily.embeds[0].title)
                .setDescription(description)
                .setColor(embedDaily.embeds[0].color)
                .setFooter({ text: embedDaily.embeds[0].footer.text, iconURL: embedDaily.embeds[0].footer.icon_url })
                .setImage(embedDaily.embeds[0].image.url)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
        else if (lastDailyReward) {
            const now = new Date();
            const nextDaily = new Date(lastDailyReward);
            nextDaily.setHours(nextDaily.getHours() + 24);

            const newObject = JSON.stringify({ item: dragonFoods[Math.floor(Math.random() * dragonFoods.length)], quantity: 1 });

            if (now >= nextDaily) {
                const dailyCoins = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
                const dailyDxp = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
                const dailyItem = dragonFoods[Math.floor(Math.random() * dragonFoods.length)];

                let description = embedDaily.embeds[0].description;
                description = description.replace('{daily.coins}', dailyCoins.toString());
                description = description.replace('{daily.dxp}', dailyDxp.toString());
                description = description.replace('{daily.item}', dailyItem);

                await prisma.usuarios.update({
                    where: { discord_id: interaction.user.id },
                    data: {
                        hasdaily: true,
                        last_daily: new Date(),
                        dxp: { increment: dailyDxp },
                        coins: { increment: dailyCoins }
                    },
                });

                await prisma.$executeRaw(
                    Prisma.sql`
                UPDATE users 
                SET inventory = inventory || ${newObject}::jsonb 
                WHERE discord_id = ${interaction.user.id}`
                );

                const embed = new EmbedBuilder()
                    .setTitle(embedDaily.embeds[0].title)
                    .setDescription(description)
                    .setColor(embedDaily.embeds[0].color)
                    .setFooter({ text: embedDaily.embeds[0].footer.text, iconURL: embedDaily.embeds[0].footer.icon_url })
                    .setImage(embedDaily.embeds[0].image.url)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
            } else {
                let description = embedhasDaily.embeds[0].description;
                const hours = nextDaily.getHours().toString().padStart(2, '0');
                const minutes = nextDaily.getMinutes().toString().padStart(2, '0');
                const seconds = nextDaily.getSeconds().toString().padStart(2, '0');
                description = description.replace('{lastDaily}', `${nextDaily.getDate()}/${(nextDaily.getMonth() + 1).toString().padStart(2, '0')}/${nextDaily.getFullYear()} às ${hours}:${minutes}:${seconds}`);
                const embed = new EmbedBuilder()
                    .setTitle(embedhasDaily.embeds[0].title)
                    .setDescription(description)
                    .setColor(embedhasDaily.embeds[0].color)
                    .setFooter({ text: embedhasDaily.embeds[0].footer.text, iconURL: embedhasDaily.embeds[0].footer.icon_url })
                    .setImage(embedhasDaily.embeds[0].image.url)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
            }
        }
    }
};