    import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
    import type { Command } from '../../types/Command.ts';
    import * as dotenv from 'dotenv';
    import { readFileSync } from 'fs';
    import { fileURLToPath } from 'url';
    import { dirname, join } from 'path';
    import { PrismaClient, Prisma } from '@prisma/client';
import { Index } from 'typeorm';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const embedInventoryPath = join(__dirname, '../../embeds/inventory.json');
    const embedInventory = JSON.parse(readFileSync(embedInventoryPath, 'utf-8'));

    dotenv.config();
    const prisma = new PrismaClient();

    async function getUserInventory(userId: string): Promise<{ coins: number | null; inventory: Prisma.JsonValue | null }> {
        const user = await prisma.usuarios.findUnique({
            where: {
                discord_id: userId
            },
            select: {
                coins: true,
                inventory: true,
            }
        });

        if (!user) {
            throw new Error('Usuário não encontrado no banco de dados.');
        }

        const coins = typeof user.coins === 'number' ? user.coins : 0;
        const inventory = Array.isArray(user.inventory) ? user.inventory : [];
        
        return { coins, inventory };
    }

    export const InventoryCommand: Command = {
        data: new SlashCommandBuilder()
            .setName('inventory')
            .setDescription('Mostra o inventário do usuário.'),
        async execute(interaction: CommandInteraction) {
            const userId = interaction.user.id;
            try {
                const userData = await getUserInventory(userId);
                const coins = userData.coins || 0;
                const rawJson: Prisma.JsonValue = userData.inventory;
                let inventoryItems: { item: string, quantity: number }[] = [];
                if (rawJson && Array.isArray(rawJson)) {
                    inventoryItems = rawJson.map((i: any) => ({
                        item: i.item,
                        quantity: i.quantity
                    }));
                }

                let description = embedInventory.embeds[0].description;
                description = description.replace('{user.username}', interaction.user.username);

                let userImage = embedInventory.embeds[0].thumbnail?.url || '';
                userImage = userImage.replace('{user.avatar_url}', interaction.user.displayAvatarURL());

                let authorImage = embedInventory.embeds[0].author?.icon_url || '';
                authorImage = authorImage.replace('{user.avatar_url}', interaction.user.displayAvatarURL());

                let authorName = embedInventory.embeds[0].author?.name || '';
                authorName = authorName.replace('{user.username}', interaction.user.username);

                const coinsField = { ...embedInventory.embeds[0].fields[0] };
                coinsField.value = coinsField.value.replace('{coins}', coins.toString());

                const itemsField = { ...embedInventory.embeds[0].fields[1] };

                if (inventoryItems.length > 0) {
                    const inventoryList = inventoryItems
                        .map(i => {
                            return `+ ${i.quantity} ${i.item}`
                        }) 
                        .join('\n');
                        
                    itemsField.value = inventoryList;
                } else {
                    itemsField.value = "Seu inventário de comidas está vazio! 😔";
                }   

                let cap = 0;
                const inventoryCap = inventoryItems
                .map(cap => cap.quantity);

                inventoryCap.forEach(num => {
                    cap += num;
                });

                let title = embedInventory.embeds[0].title;
                title = title.replace('{cap}', cap);

                const staticField2 = embedInventory.embeds[0].fields[2];
                const staticField3 = embedInventory.embeds[0].fields[3];

                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .addFields(coinsField)
                    .addFields(itemsField)
                    .addFields(staticField2)
                    .addFields(staticField3)
                    .setFooter({ text: embedInventory.embeds[0].footer.text, iconURL: embedInventory.embeds[0].footer.icon_url })
                    .setColor(embedInventory.embeds[0].color)
                    .setThumbnail(userImage)
                    .setAuthor({ name: authorName, iconURL: authorImage })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            }
            catch (error) {
                console.error('Erro ao buscar inventário do usuário:', error);
                if (error instanceof Error && error.message === 'Usuário não encontrado no banco de dados.') {
                    await interaction.reply({ content: 'Você ainda não está registrado em nosso sistema. Tente usar um comando que exige registro primeiro!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Houve um erro ao buscar seu inventário. Por favor, tente novamente mais tarde.', ephemeral: true });
                }
            }
        }
    };