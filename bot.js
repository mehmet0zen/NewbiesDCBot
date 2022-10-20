import Config from 'dotenv'
Config.config();
import {Count} from './counting.js'

// Get Discord Controllers
import { Client, GatewayIntentBits, REST, Routes, Events, Partials } from 'discord.js';

//# On Startup, Handle Rest
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'hello',
        description: 'Replies with World.',
    }
];

(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    } catch (error) {
        console.error(error);
    }
})();

//# Create Client
const client = new Client({ 
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// When Client is ready
client.on(Events.ClientReady, () => {
    console.log("Ready to go!");
});

const counting = new Count('1032458977310674994');
// When a Message is created
client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return false; 

    counting.count(message);
    console.log(`Message from ${message.author.username}: ${message.content}`);

    if (message.content === 'Hello') {
        message.channel.send('World!');
    }
});

// When a command has been used
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (interaction.commandName === 'hello') {
        await interaction.reply('World!');
    }
});

// On message deleted
client.on(Events.MessageDelete, msg => {
    console.log("Oh I see you!");
});

// Login to server
client.login(process.env.BOT_TOKEN);