import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/Command.ts';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PrismaClient, Prisma } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const embedInventoryPath = join(__dirname, '../../embeds/inventory.json');
const embedInventory = JSON.parse(readFileSync(embedInventoryPath, 'utf-8'));

dotenv.config();
const prisma = new PrismaClient();

async function getUserInventory(userId: string): Promise<{ coins: number; food: number; artifacts: number } | null> {
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
        return null;
    } 
    const foodItem = user.inventory?.find(item => item.item === 'item');
    const foodQnt = user.inventory?.find(item => item.item === 'quantity');
    return {
        coins: user.coins || 0,
        food: foodItem ? foodItem.quantity : 0,
        foodQuantity: foodQnt ? foodQnt.quantity : 0,
    };
}

const InventoryCommand: Command = {