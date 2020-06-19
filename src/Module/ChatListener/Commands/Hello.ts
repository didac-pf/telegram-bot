import BaseCommand from "./BaseCommand";
import endpoints from "../../../endpoints";

export default class Hello extends BaseCommand {

  static command = '/hello';

  constructor(Axios, Message) {
    super(Axios, Message);
  }

  public async execute() {
    console.log('- Sending a greet');
    await this.Axios.post(endpoints.sendMessage, {
      chat_id : this.Message.chat.id,
      text    : `Hello ${this.Message.from.username}`,
    });
  }

}
