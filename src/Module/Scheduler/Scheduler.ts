import * as Informers from './Informers';

export default class Scheduler {

  private Informers = [];

  constructor() {
    this.buildInformers();
  }

  private buildInformers() {
    const InformersList = Object.values(Informers);
    for (const Informer of InformersList) {
      this.Informers.push(new Informer());
    }
  }

  public async start() {
    while (true) {
      await this.executeInformers();
      await this.sleep(2);
    }
  }

  private async executeInformers() {
    for (const Informer of this.Informers) {
      await Informer.attempt();
    }
  }

  public welcome() {
    console.log('----------------------------------------');
    console.log('---------- Starting Scheduler ----------');
    console.log();
  }

  private sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  } 

}
