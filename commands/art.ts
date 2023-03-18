import { Context, Input, Markup } from "telegraf";
import ConversationSingle from "../gpt/converse-single";
import GenerateArt from "../gpt/generateArt";

const Art = (ctx: Context) => {
    const commandData = (ctx.message as any).text.split(" ").slice(1).join(" ")
    if (commandData.length > 0) {
        console.log(commandData)
        // ctx.reply(`Please wait while i draw you a "${commandData}"`)
        ctx.telegram.sendChatAction(ctx.chat.id, "upload_photo")
        GenerateArt(commandData, ctx.from.username).then(async (response) => {
            if (response.startsWith("Sorry")) {
                ctx.reply(response)
                return
            }

            //test two diff url types
            await ctx.replyWithPhoto(Input.fromURLStream(response))
            await ConversationSingle(ctx, `I have drawn a ${commandData}, write a short quote about it.`)
            // await ctx.reply("Do you like it?", Markup.inlineKeyboard([
            //     Markup.button.callback("Yes", "like"),
            //     Markup.button.callback("No", "dislike")
            // ]))
        })

    }
    else {
        ctx.reply("Tell me what you would like to draw, with /art <search term>")
    }
}

export default {Art, "command": "art", "description": "Generate art using /art <search term>"}