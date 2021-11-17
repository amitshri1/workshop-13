const cron = require('node-cron');

cron.schedule('59 * * * * *', () => {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  console.log(`Time is ${hour}:${minute} "running"`);
  console.log('Welcome To World');
});