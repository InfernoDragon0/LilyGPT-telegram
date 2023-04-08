import { Context } from "telegraf";
import Lily from "./lily";
import { ChatOpenAI } from "langchain/chat_models"
import { BingSerpAPI, Calculator } from "langchain/tools"
import { ChatAgent, AgentExecutor } from "langchain/agents"

const SuperLily = async (ctx: Context) => {
    const prompt: string = (ctx.message as any).text ?? (ctx.message as any).sticker.emoji
    const prompted = prompt.replace("!", "").replace("?", "").trim()

    // Define the list of tools the agent can use
    console.log("prompt received for superlily: " + prompted)
    try {
        const tools = [new Calculator(), new BingSerpAPI(process.env.BINGAPIKEY)];
    // Create the agent from the chat model and the tools
    const agent = ChatAgent.fromLLMAndTools(new ChatOpenAI({
        temperature: 0.3,
        maxTokens: 500,
    }), tools);
    // Create an executor, which calls to the agent until an answer is found
    const executor = AgentExecutor.fromAgentAndTools({ agent, tools });
    executor.verbose = true;
    executor.returnIntermediateSteps = true;
    executor.maxIterations = 5;
    
    ctx.reply("Please give me a moment to think about your request.", {reply_to_message_id: ctx.message.message_id})
    const responseG = await executor.call(
        {input: prompted}
    );

    console.log(responseG);
    ctx.reply(responseG.output)
    ctx.reply("My thoughts were as follows:")
    ctx.reply(JSON.stringify(
        responseG.intermediateSteps,
        null,
        2
      ));
    }
    catch (e) {
        console.log("error: " + e)
        ctx.reply("had an error with superlily, try again later ")
    }
    
}

export default SuperLily