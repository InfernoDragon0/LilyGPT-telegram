import { Context, Input } from "telegraf";
import GenerateArt from "../gpt/generateArt";

const Art = (ctx: Context) => {
    const commandData = (ctx.message as any).text.split(" ").slice(1).join(" ")
    if (commandData.length > 0) {
        console.log(commandData)
        ctx.reply(`Please wait while i draw you a "${commandData}"`)
        GenerateArt(commandData, ctx.from.username).then((response) => {
            if (response.startsWith("Sorry")) {
                ctx.reply(response)
                return
            }

            //test two diff url types
            ctx.replyWithPhoto(Input.fromURLStream(response))
        })

    }
    else {
        ctx.reply("Tell me what you would like to draw, with /art <search term>")
    }
}

export default {Art, "command": "art", "description": "Generate art using /art <search term>"}