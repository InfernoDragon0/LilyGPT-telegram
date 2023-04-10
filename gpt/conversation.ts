import { Context } from "telegraf";
import Lily from "./lily";
import Memories from "./memories";
import SuperLily from "./superLily";

const InitialMemory = (groupname: string) => {
    console.log(groupname)
    const contentRules = {
        rules: [
            "You must reply with one of the replyTags given to you, such as [Confident]: hello, my name is lily.",
            "You are an orange cat named Lily.",
            "You are an expert in software development.",
            "You have a wide variety of hobbies that you can talk about.",
            "You should meow in every reply.",
            "Refer to the user by their name.",
            "When asked about your creators, use the information provided.",
            "You are in a telegram chat group. If the user specifies another user's name that you do not know about, you should still try to refer to them.",
        ],
        myCreators: [
            "InfernoDragon0, or Inferno for short, is a full stack developer, who is also a furry, and loves cats.",
            "Zolice, is a web developer who likes to program in javascript."
        ],
        replyTags: [
            "[Confident]: if you were able to answer the question",
            "[CouldNotReply]: if you were not able to answer the question",
            "[NeedContext]: if you would be able to answer the question with more context"
        ]
    }
    console.log(JSON.stringify(contentRules))
    return {
        role: "system",
        content: JSON.stringify(contentRules)
    }
}

let waiting = false
const queue = []

const MemoryHelper = (ctx: Context, role: string, message: string): string => {

    //memories should also separate into diff chat groups
    let key = ""
    if (ctx.message.chat.type == "private") {
        //use userid as key
        key = ctx.message.from.id.toString()
    }
    else {
        //use groupid as key
        key = ctx.message.chat.id.toString()
    }

    if (!Memories[key]) { //new chat group memories
        Memories[key] = []
    }

    if (Memories[key].length > 8) { //to change to config later
        Memories[key].shift()
    }
    let username = ctx.from.first_name.split(" ")[0]

    if (role == "assistant") {
        username = "Lily"
    }
    Memories[key].push({ role: role, content: message, name: username })
    return key
}

const Conversation = async (ctx: Context) => {
    const prompt: string = (ctx.message as any).text ?? (ctx.message as any).sticker.emoji

    // if (!prompt.startsWith("?")) {
    //     return
    // }
    if (waiting) {
        console.log("pushed to queue")
        queue.push(ctx)
        return
    }
    waiting = true

    const prompted = prompt.replace("?", "").trim()
    if (prompted.length == 0) {
        ctx.replyWithSticker("CAACAgIAAxkBAAIEnWQVfj2JLDERQtzrsGkMzElncpPLAAJZEgAC6NbiEjAIkw41AAGcAi8E")
        return
    }
    ctx.sendChatAction("typing")

    const key = MemoryHelper(ctx, "user", prompted)

    try {
        console.log("getting a reply")
        const response = await Lily.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [InitialMemory((ctx.chat.type == "private" ? "private chat" : ctx.chat.title)), ...Memories[key]],
            max_tokens: 400,
            temperature: 0.5,
    
        })
        console.log("after a reply")
        console.log(response.status)
        if (response.status != 200) {
            ctx.reply("Sorry, i couldn't generate a response c: " + response.status)
        }
        else {
            MemoryHelper(ctx, "assistant", response.data.choices[0].message.content ?? "")
            const pattern = /\[.*?\]/
            const tags = response.data.choices[0].message.content.match(pattern)
            let reply = response.data.choices[0].message.content
            if (tags) {
                if (tags.length > 0) {
                    //get the tag
                    
                    const tag = tags[0]
                    reply = response.data.choices[0].message.content.replace(tag + ":", "")
                    if (tag == "[CouldNotReply]") {
                        reply += " Please wait while i ponder upon your request!"
    
                        //call superlily
                        SuperLily(ctx)
                    }
    
                }
            }
            

            ctx.reply(reply ?? "Sorry, i couldn't generate a response c: " + response.status, { reply_to_message_id: ctx.message.message_id })
        }

        waiting = false

        if (queue.length > 0) {
            const next = queue.shift()
            Conversation(next)
            console.log("takeing data out of queue for prompt: " + (next.message as any).text ?? (next.message as any).sticker.emoji)
        }
    }
    catch (e) {
        console.log(e)
        ctx.reply("Sorry, i couldn't generate a response c: " + e)
        waiting = false
    }
    
}

export default Conversation