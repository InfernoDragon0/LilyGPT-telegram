import { Context } from "telegraf";
import Lily from "./lily";

const SuperLily = async (ctx: Context) => {
    const prompt: string = (ctx.message as any).text ?? (ctx.message as any).sticker.emoji
    const prompted = prompt.replace("?", "").trim()

    
    
}

export default SuperLily