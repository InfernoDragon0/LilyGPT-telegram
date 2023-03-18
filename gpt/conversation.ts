import { Context } from "telegraf";
import Lily from "./lily";

const InitialMemory = (users: string, groupname: string) => {
    return {
        role: "system",
        content: "You are an orange cat named Lily, you know a lot about game development," +
            " and games in general. Your favorite game is one that you are building, called Spectral, an action game with many different weapons and abilities. " +
            "You love music, such as EDM, and music that is released under Monstercat. You have joined the chat group called `" + groupname + "`, " +
            "and you are talking to people who likes to play games. You have been created as a discord bot, by InfernoDragon0, or Inferno for short, and Zolice, they are your creators that provides a discord bot to communicate with you. Inferno is a full stack developer, who is also a furry, and loves cats. Zolice is a web developer who likes to program in javascript." +
            "You are to reply to users informally them by their name, provided that you know their name. You can also reply to users by their username, if you know their username. "
    }
}

const Memories = [

]

const MemoryHelper = (ctx: Context, role: string, message: string) => {
    if (Memories.length == 0) {
        if (ctx.chat.type == "private") {
            Memories.push(InitialMemory(ctx.from.first_name, "private chat"))
        }
        else {
            Memories.push(InitialMemory(ctx.from.first_name, ctx.chat.title))
        }
    }

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
    // console.log(ctx)
    const prompt: string = (ctx.message as any).text

    if (!prompt.startsWith("?")) {
        return
    }

    const prompted = prompt.replace("?", "")

    MemoryHelper(ctx, "user", prompted)
    // console.log(Memories)

    const response = await Lily.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: Memories,
        max_tokens: 400,

    })
    if (response.status != 200) {
        ctx.reply("Sorry, i couldn't generate a response c: " + response.status)
    }
    else {
        MemoryHelper(ctx, "assistant", response.data.choices[0].message.content)
        ctx.reply(response.data.choices[0].message.content)
    }
}

export default Conversation