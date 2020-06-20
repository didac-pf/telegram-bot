import Utils from "../../../Utils";

export type TSchedules = 'daily';

export default abstract class BaseInformer {

  protected abstract executionSchedule : TSchedules;
  protected abstract informerName : string;

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
    if (this.isTimeToExecuteAction()) {
      console.log(`- [${this.informerName}] - Executing action`);
      await this.action();
    } else {
      console.log(`- [${this.informerName}] - ${this.getRemainingTime()}`);
    }
  }

  private isTimeToExecuteAction() : boolean {
    const now           = new Date();
    const scheduledDate = this.getScheduledDate();

    // console.log(this.lastExecutionAttemptAt ? this.lastExecutionAttemptAt.toISOString() : null);
    // console.log(scheduledTime.toISOString(), new Date().toISOString());
    // console.log(this.lastExecutionAttemptAt < scheduledTime, scheduledTime < now);

    let isTime = false;
    if (this.lastExecutionAttemptAt && this.lastExecutionAttemptAt.getTime() < scheduledDate.getTime() && scheduledDate.getTime() < now.getTime()) {
      isTime = true;
    }

    this.lastExecutionAttemptAt = new Date();

    return isTime;
  }

  private getRemainingTime() : string {
    const now           = new Date();
    const scheduledDate = this.getScheduledDate();

    const secondsRemaining = (Math.floor((scheduledDate.getTime() - now.getTime()) / 1000));

    if (secondsRemaining < 0) {
      return `To be executed tomorrow`;
    }

    return `${secondsRemaining} remaining`;
  }

  private getScheduledDate() : Date {
    let scheduledDate : Date;

    switch (this.executionSchedule) {
      case 'daily':
        scheduledDate = Utils.getTodayDateAt(this.executionTime);
      break;
    }

    return scheduledDate;
  }

}
