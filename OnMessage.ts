import Discord from 'discord.js';
import { data, channel } from './index'


const waitTime = 600 * 1000;
const cooldown = 120 * 1000;

let timerForUsers: { [user:string]: number } = {};
let alreadySaidHello: { [user:string]: boolean } = {};

export async function OnMessage(message:Discord.Message) : Promise<void> {
    if (message.author.bot) return;

    if (message.channel.type != 'dm') return;

    var title, mod, details, steps;

    var timer = timerForUsers[message.author.toString()];
    var timeLeft = timer - new Date().getTime();

    let filter = (m:Discord.Message) => m.author.id === message.author.id;

    if (timeLeft > 0) {
        await message.channel.send(`***there's still ${timeLeft / 1000} Seconds left until you're able to send your next bug report.***`);
        return;
    }

    try {
        if (!alreadySaidHello[message.author.toString()]) {
            alreadySaidHello[message.author.toString()] = true;
            await message.channel.send(data.helloText);
            let msg = await message.channel.awaitMessages(filter, {
                max: 1,
                time: waitTime,
                errors: ['time']
            });
            title = msg.first();
    
            await message.channel.send(data.modText);
            msg = await message.channel.awaitMessages(filter, {
                max: 1,
                time: waitTime,
                errors: ['time']
            });
            var modName = msg.first();
            if (modName.content.toUpperCase() == 'ROTA'){
                mod = 'Return of the Ancients';
            }
            else if (modName.content.toUpperCase() == 'AL'){
                mod = 'Architects Library';
            }
            else {
                var correct = false;
                while (!correct) {
                    await message.channel.send(`**You can only enter the following answers!**
- RotA
- AL`);
                    msg = await message.channel.awaitMessages(filter, {
                        max: 1,
                        time: waitTime,
                        errors: ['time']
                    });
                    modName = msg.first();
                    if (modName.content.toUpperCase() == 'ROTA'){
                        mod = 'Return of the Ancients';
                        correct = true;
                    }
                    else if (modName.content.toUpperCase() == 'AL'){
                        mod = 'Architects Library';
                        correct = true;
                    }
                }
            }
    
            await message.channel.send(data.detailsText);
            msg = await message.channel.awaitMessages(filter, {
                max: 1,
                time: waitTime,
                errors: ['time']
            });
            details = msg.first();
    
            await message.channel.send(data.stepsText);
            msg = await message.channel.awaitMessages(filter, {
                max: 1,
                time: waitTime,
                errors: ['time']
            });
            steps = msg.first();
            
            await (channel as Discord.TextChannel).send(`**Bug Title:** 
${title}
            
**Mod:**
${mod}
            
**Details:**
${details}
            
**Reproduction Steps:**
${steps}
            
***Submitted By ${message.author}***`);
            timerForUsers[message.author.toString()] = new Date().getTime() + cooldown;
            alreadySaidHello[message.author.toString()] = false;
            await message.channel.send(data.thanksText);
        }
    } catch {
        await message.channel.send(data.expiredText);
        alreadySaidHello[message.author.toString()] = false;
    }

}