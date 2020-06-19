import Utils from "../../../Utils";

export type TSchedules = 'daily';

export default abstract class BaseInformer {

  protected abstract executionSchedule : TSchedules;

  /**
   * Time the informer will be executed at
   * After an execution, the informer will reset its values and wait for next execution time.
   * 
   */
  protected abstract executionTime : string = '00:00';

  protected lastExecutionAttemptAt : Date;

  /**
   * The async action that this informer will perform.
   * E.g.:
   *  - Retrieving data from an API to send a chat message
   *  - Updating something in a database
   *  - Whatever you want
   */
  abstract async action() : Promise<void>;

  public async attempt() {
    let time : Date;

    switch (this.executionSchedule) {
      case 'daily':
        time = Utils.getTodayDateAt(this.executionTime);
      break;
    }

    if (this.lastExecutionAttemptAt < time && time < new Date()) {
      await this.action();
    }

    this.lastExecutionAttemptAt = new Date();
  }

}
