import Scheduler from './Scheduler';

(async () => {
  const SchedulerInstance = new Scheduler();

  SchedulerInstance.welcome();

  await SchedulerInstance.start();

  console.log();
  console.log('--- Scheduler stopped. Cya soon! ---');
  console.log('------------------------------------');
  console.log();

  process.exit(0);
})();
