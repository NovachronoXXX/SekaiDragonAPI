import type { 
    CommandInteraction,             
    Client,
    SlashCommandBuilder,                         
} from 'discord.js';

export interface Command {
    data: SlashCommandBuilder;

    execute: (interaction: CommandInteraction, client: Client) => Promise<void> | void;
}