import { BaseCallbackHandler } from "langchain/callbacks";
import { ChainValues, AgentAction, AgentFinish } from "langchain/schema";
import { Context } from "telegraf";

export class SuperLilyCallbackHandler extends BaseCallbackHandler {
    private ctx: Context

    constructor(ctx: Context) {
        super()
        this.ctx = ctx
    }

    async handleChainError(err: any, verbose?: boolean): Promise<void> {
        console.log("an tool errored:" +err)
        this.ctx.reply("error:" + err)
    }

    async handleChainStart(chain: { name: string }) {
      console.log(`Entering new ${chain.name} chain...`);
    }
  
    async handleChainEnd(_output: ChainValues) {
      console.log("Finished chain.");
    }
  
    async handleAgentAction(action: AgentAction) {
      console.log("an action taken: " + action.log);
      const thought = action.log.split("Action:")
      let thinking = ""
      if (thought) {
        if (thought.length > 0) {
          thinking = thought[0]
        }
      }
      this.ctx.reply(thinking 
      + "\nI will need to use " + action.tool + " to think about " + action.toolInput)
    }
  
    async handleToolEnd(output: string) {
      console.log("an tool ended:" + output);
    }
  
    async handleText(text: string) {
      console.log("an tool texted:" +text);
    }
  
    async handleAgentEnd(action: AgentFinish) {
      console.log("an agent ended:" +action.log);
    }
  }