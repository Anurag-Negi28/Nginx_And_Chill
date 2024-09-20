import { createClient, RedisClientType } from 'redis';
import { promisify } from 'util';

const redisClient: RedisClientType = createClient({
  url: 'redis://' + process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    console.log('Connecting to redis...');
    await redisClient.connect();
  }
};

export async function setSessionData(sessionId: string, sessionData: string, ttl: number): Promise<void>{
  if (!process.env.REDIS_URL) {
    throw new Error('Redis was not found');
  }

  await connectRedis();
  await redisClient.set(sessionId, JSON.stringify(sessionData), {EX: ttl});
}

export async function getSessionData(sessionId: string): Promise<string|null> {
  if (!process.env.REDIS_URL) {
    throw new Error('Redis was not found');
  }

  await connectRedis();
  const data = await redisClient.get(sessionId);
  console.log('found user data for:', sessionId);
  return data;
}

export default redisClient;
