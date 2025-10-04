import { 
    Client, 
    Collection, 
    IntentsBitField, 
    Events, 
    REST,
    Routes,
} from 'discord.js';

import { config } from 'dotenv';
import type { Command } from './types/Command.ts';
import { DailyCommand } from './commands/general/daily.ts';
import { IntroductionCommand } from './commands/general/introduction.ts';

config();

interface CustomClient extends Client {
    commands: Collection<string, Command>;
}

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMessages, 
        IntentsBitField.Flags.MessageContent
    ],
}) as CustomClient;

client.commands = new Collection<string, Command>();

client.commands.set(DailyCommand.data.name, DailyCommand);
client.commands.set(IntroductionCommand.data.name, IntroductionCommand);

async function deployCommands() {
    const TOKEN = process.env.TOKEN;
    const CLIENT_ID = client.user?.id;

    if (!TOKEN || !CLIENT_ID) {
        console.error("ERRO: TOKEN ou CLIENT_ID não estão definidos.");
        return;
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    const commandsData = client.commands.map(command => command.data.toJSON());

    try {
        console.log(`Iniciando o refresh de ${commandsData.length} comandos de aplicação.`);

        const endpoint = Routes.applicationCommands(CLIENT_ID);

        await rest.put(endpoint, { body: commandsData });

        console.log(`Sucesso! Foram recarregados ${commandsData.length} comandos de aplicação.`);
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
}

client.once(Events.ClientReady, async () => {
    console.log(`${client.user?.tag} acabou de acordar!`);
    
    await deployCommands(); 
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName); 
    
    if (!command) {
        console.error(`Nenhum comando encontrado para ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction, client); 
    } catch (error) {
        console.error(`Erro ao executar comando ${interaction.commandName}:`, error);
        
        const errorMessage = 'Houve um erro ao executar este comando!';

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);