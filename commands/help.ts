import { Context } from "telegraf";

const Help = (ctx: Context) => {
    ctx.reply('You can ask me to draw you something, just use /art <search term>. Or, you can also converse with me, just send me a message with ? and i will reply. For example: ?Hello, how are you?');
}

export default Help;