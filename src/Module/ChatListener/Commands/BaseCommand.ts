import { AxiosInstance } from "axios";
import { Message } from "node-telegram-bot-api";

export default abstract class BaseCommand {

  /** The command string that will fire this Command. Must start with a leading "/" */
  static command : string;

  protected Axios : AxiosInstance;
  protected Message : Message;

  /**
   * @param Axios 
   * @param Message 
   */
  constructor(Axios: AxiosInstance, Message: Message) {
    this.Axios   = Axios;
    this.Message = Message;
  }

}
