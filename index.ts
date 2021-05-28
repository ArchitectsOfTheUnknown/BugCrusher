require('dotenv').config();
import Discord from 'discord.js';
import fs from 'fs';
import path from 'path';
import { OnMessage } from './OnMessage';
const Client = new Discord.Client();

export const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json"), "utf-8"));

export var channel:Discord.GuildChannel;

Client.once('ready', (() => {
    console.log(`Logged in as ${Client.user.tag}`);
    Client.user.setActivity("send me a hi to submit a bug report!", {
        type: 'PLAYING'
    });
    channel = Client.guilds.cache.find(y => y.id == data.serverID)?.channels.cache.find(y => y.id == data.channelID);
}));

Client.on('message', OnMessage);


Client.login(process.env.ACCESS_TOKEN);
