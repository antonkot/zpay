const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);

function work() {
  redisClient.lpop('transaction', (err, value) => {
    // If queue is empty, wait for 3 seconds and try again
    if (value == null) {
      setTimeout(work, 3000);
    }
  });
}

work();
