import { Context } from "telegraf";
import Memories from "../gpt/memories";

const Clear = (ctx: Context) => {
    Memories.length = 0;
    ctx.reply("my brain gone")
}

export default {Clear, "command": "clear", "description": "Clear my brain"}