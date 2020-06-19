import ChatListener from './ChatListener';

(async () => {
  const ChatListenerInstance = new ChatListener();

  ChatListenerInstance.welcome();
  
  await ChatListenerInstance.checkBot();

  while (true) {
    try {
      await ChatListenerInstance.listen();
    } catch (err) {
      console.log(err);
      break;
    }
  }

  console.log('Bot listener stopped. Cya soon!');

  process.exit(0);
})();
