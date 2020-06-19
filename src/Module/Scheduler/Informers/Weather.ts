import BaseInformer, { TSchedules } from './BaseInformer';

export default class Weather extends BaseInformer {

  protected executionSchedule = 'daily' as TSchedules;
  protected executionTime     = '08:00';

  constructor() {
    super();
  }

  async action() {
    console.log('Weather informer executed!');
  }

}
