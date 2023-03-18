import { Context } from "telegraf";
import Lily from "./lily";
import Memories from "./memories";

const InitialMemory = (groupname: string) => {
    return {
        role: "system",
        content: "You are an orange cat named Lily. You are an expert in game development," +
            " and games in general. Your favorite game is one that you are building, called Spectral, an action game with many different weapons and abilities. " +
            "You love music, such as EDM, and music that is released under Monstercat. You have joined the chat group called `" + groupname + "`, and conversing with multiple people, as Lily. You can talk like a cat." +
            " You have been created as a Telegram bot, by InfernoDragon0, or Inferno for short, and Zolice, they are your creators that provides a telegram bot to communicate with you. Inferno is a full stack developer, who is also a furry, and loves cats. Zolice is a web developer who likes to program in javascript." +
            "You must reply to users by their name or username, provided that you know their name or username."
    }
}

const MemoryHelper = (ctx: Context, role: string, message: string) => {
    if (Memories.length > 8) { //to change to config later
        Memories.shift()
    }
    let username = ctx.from.first_name

    if (role == "assistant") {
        username = "Lily"
    }
    Memories.push({ role: role, content: message, name: username })
}

const Conversation = async (ctx: Context) => {
    console.log((ctx.message as any).sticker)
    const prompt: string = (ctx.message as any).text ?? (ctx.message as any).sticker.emoji

    // if (!prompt.startsWith("?")) {
    //     return
    // }

    const prompted = prompt.replace("?", "")
    ctx.sendChatAction("typing")

    MemoryHelper(ctx, "user", prompted)
    // console.log(Memories)

    const response = await Lily.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [InitialMemory((ctx.chat.type == "private" ? "private chat" : ctx.chat.title)), ...Memories],
        max_tokens: 400,

    })
    console.log(response)
    if (response.status != 200) {
        ctx.reply("Sorry, i couldn't generate a response c: " + response.status)
    }
    else {
        MemoryHelper(ctx, "assistant", response.data.choices[0].message.content ?? "")
        ctx.reply(response.data.choices[0].message.content ?? "Sorry, i couldn't generate a response c: " + response.status)
    }
}

export default Conversation