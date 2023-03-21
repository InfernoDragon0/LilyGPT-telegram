import { Context } from "telegraf";
import ConversationSingle from "../gpt/converse-single";
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
    ConversationSingle(ctx, "a 15 word quote about starting fresh from a clean slate, by you")

}

export default {Clear, "command": "clear", "description": "Clear my brain"}