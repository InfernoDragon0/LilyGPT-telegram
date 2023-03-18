import { Context } from "telegraf";

const Start = (ctx: Context) => {
    ctx.reply('Hi there, what shall we talk about today?')
}

export default Start