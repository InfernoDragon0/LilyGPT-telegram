import { Context } from "telegraf";
import Memories from "../gpt/memories";

const Clear = (ctx: Context) => {
    let key = ""
    if (ctx.message.chat.type == "private") {
        //use userid as key
        key = ctx.message.from.id.toString()
    }
    else {
        //use groupid as key
        key = ctx.message.chat.id.toString()
    }
    Memories[key] = []
    ctx.reply("my brain gone")
}

export default {Clear, "command": "clear", "description": "Clear my brain"}