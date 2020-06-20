import Scheduler from './Scheduler';

(async () => {
  const SchedulerInstance = new Scheduler();

  SchedulerInstance.welcome();

  await SchedulerInstance.start();

  console.log('Scheduler stopped. Cya soon!');

  process.exit(0);
})();
