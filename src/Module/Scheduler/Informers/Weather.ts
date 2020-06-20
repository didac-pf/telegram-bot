import BaseInformer, { TSchedules } from './BaseInformer';
// import AxiosLib from 'axios';

export default class Weather extends BaseInformer {

  protected informerName      = 'Weather';
  protected executionSchedule = 'daily' as TSchedules;
  protected executionTime     = '03:33';

  constructor() {
    super();
  }

  async action() {
    // AxiosLib.get()
    console.log('\nWeather informer executed!\n');
  }

}
