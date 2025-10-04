import {
    SlashCommandBuilder, 
    CommandInteraction, 
    EmbedBuilder, 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import type { Command } from '../../types/Command.ts';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const introductionBotPath = join(__dirname, '../../embeds/introduction.json');
const introductionBot = JSON.parse(readFileSync(introductionBotPath, 'utf-8'));

export const IntroductionCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('introduction')
        .setDescription("Aqui onde tudo começa, veja a introdução do Sekai Bot!"),
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle(introductionBot.embeds[0].title)
            .setDescription(introductionBot.embeds[0].description)
            .setColor(introductionBot.embeds[0].color)
            .setImage(introductionBot.embeds[0].image.url)
            .setFooter({ text: introductionBot.embeds[0].footer.text, iconURL: introductionBot.embeds[0].footer.icon_url })
        const embed2 = new EmbedBuilder()
            .setTitle(introductionBot.embeds[1].title)
            .setDescription(introductionBot.embeds[1].description)
            .setColor(introductionBot.embeds[1].color)
            .setImage(introductionBot.embeds[1].image.url)
            .setFooter({ text: introductionBot.embeds[1].footer.text, iconURL: introductionBot.embeds[1].footer.icon_url })
        const button1 = new ButtonBuilder()
            .setLabel(introductionBot.components[0].components[0].label)
            .setEmoji(introductionBot.components[0].components[0].emoji.name)
            .setStyle(ButtonStyle.Link)
            .setURL(introductionBot.components[0].components[0].url);
        const button2 = new ButtonBuilder()
            .setLabel(introductionBot.components[0].components[1].label)
            .setEmoji(introductionBot.components[0].components[1].emoji.name)
            .setStyle(ButtonStyle.Link)
            .setURL(introductionBot.components[0].components[1].url);
        const buttons = [button1, button2];
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(buttons);
        await interaction.reply({ embeds: [embed, embed2], components: [row] });
    },
}