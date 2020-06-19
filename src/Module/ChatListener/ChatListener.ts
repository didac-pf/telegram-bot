
import AxiosLib, { AxiosInstance } from 'axios';
import { Message } from 'node-telegram-bot-api';
import Utils from './../../Utils';
import endpoints from './../../endpoints';
import * as Commands from './Commands';

const secondsForIgnoredMessages = 5;

export default class ChatListener {

  private Axios : AxiosInstance;
  private LastMessage : Message;
  private offset : number;

  private Commands = {};

  constructor() {
    this.Axios = AxiosLib.create({
      baseURL : endpoints.baseUrl,
      timeout : 0, // No timeout
    });

    this.buildCommands();
  }

  private buildCommands() {
    const CommandList = Object.values(Commands);
    for (const Command of CommandList) {
      this.Commands[Command.command] = Command;
    }
  }

  public welcome() {
    console.log('---------------------------------------');
    console.log('-------- Starting bot listener --------');
    console.log();
  }

  public async checkBot() {
    try {
      var { data } = await AxiosLib.post(endpoints.getMe);
    } catch (err) {
      console.log(err);

      throw new Error('Bot is sick 🤢');
    }
    
    console.log(`Bot ${data.result.username} is alive and ready!`);
  }

  public async listen() {
    console.log(`\nListening updates... (at ${new Date().toTimeString().split(' ')[0]})`);

    try {
      var { data } = await this.Axios.post(
        endpoints.getUpdates,
        {
          timeout         : 3600,
          offset          : this.offset ? this.offset + 1 : 0,
          allowed_updates : ['message'],
        },
      );
    } catch (err) {
      if (err.response.status === 409) {
        return;
      } else {
        console.log(err);
        throw new Error('Unknown error');
      }
    }

    const currentTime = Date.now();
    
    if (data.result.length) {
      const lastResult = data.result[data.result.length - 1];
      
      this.offset = lastResult.update_id;

      // Ignore non-messages
      if (!lastResult.message) {
        return;
      }

      // Ignore messages sent while listener was turned off
      if (currentTime - (lastResult.message.date * 1000) > secondsForIgnoredMessages * 1000) {
        console.log('- Old messages were received and ignored');
        return;
      }

      this.LastMessage = lastResult.message;

      console.log(`- Message received by ${this.LastMessage.from.username}`);

      const receivedCommand = Utils.getCommandFromText(this.LastMessage.text);

      if (this.Commands[receivedCommand]) {
        const CommandInstance = new this.Commands[receivedCommand](this.Axios, this.LastMessage);
        await CommandInstance.execute();
      } else {
        console.log(`- Unknown command ${receivedCommand}`);
      }
    } else {
      console.log('- No messages yet');
    }
  }

}
