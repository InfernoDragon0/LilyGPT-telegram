import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
// dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Commands
import Help from './commands/help';
import Art from './commands/art';
import Start from './commands/start';

// OpenAI
import Conversation from './gpt/conversation';
import clear from './commands/clear';
import SuperLily from './gpt/superLily';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.telegram.setMyCommands([
    { command: 'help', description: 'Help' },
    { command: Art.command, description: Art.description },
    { command: clear.command, description: clear.description },
])

bot.start(Start);
bot.help(Help);
// bot.on(message('sticker'), (ctx) => ctx.reply('👍'));

bot.hears('hi', (ctx) => ctx.reply('Hey there, talk to me using ?, for example, ?Hello, how are you?'));

bot.command("art", Art.Art)
bot.command("clear", clear.Clear)


bot.on('message', (ctx) => {
    try {
        if ((ctx.message as any).text?.startsWith("?")) {
            //replace all ? with nothing
            const prompt: any = (ctx.message as any).text ?? (ctx.message as any).sticker.emoji
            const prompted = prompt.replaceAll("?", "").trim()
            console.log("prompted is " + prompted)
            if (prompted.length == 0) {
                //do nothing
                return
            }
            Conversation(ctx)
        }
        //if starts with !, call superlily instead
        if ((ctx.message as any).text?.startsWith("!")) {
            //replace all ? with nothing
            const prompt: any = (ctx.message as any).text ?? (ctx.message as any).sticker.emoji
            const prompted = prompt.replaceAll("!", "").trim()
            console.log("prompted is " + prompted)
            if (prompted.length == 0) {
                //do nothing
                return
            }
            SuperLily(ctx)
            
        }
        
        
    }
    catch (e) {
        console.log("error too fast? ")
    }
})


bot.launch();
console.log("Bot started")

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));