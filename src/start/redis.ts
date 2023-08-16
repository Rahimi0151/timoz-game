import config from 'config';
import Redis from 'ioredis';
import { Pipeline } from 'ioredis';

class RedisSingleton {
    private static instance: RedisSingleton;
    private client: Redis;

    private constructor() {
        if (RedisSingleton.instance) {
            throw new Error('Use RedisSingleton.getInstance() instead');
        }

        this.client = new Redis({
            host: config.get('redis.host'),
            port: config.get('redis.port'),
            db: config.get('redis.db')
        });

        RedisSingleton.instance = this;
    }

    public static getInstance(): RedisSingleton {
        if (!RedisSingleton.instance) {
            RedisSingleton.instance = new RedisSingleton();
        }
        return RedisSingleton.instance;
    }

    getClient(): Redis {
        return this.client;
    }

    async sadd(key: string, ...members: string[]): Promise<number> {
        return this.client.sadd(key, ...members);
    }

    async set(key: string, value: string): Promise<string> {
        return this.client.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async scard(key: string): Promise<number> {
        return this.client.scard(key);
    }

    async srem(key: string, ...members: string[]): Promise<number> {
        return this.client.srem(key, ...members);
    }

    async multi(): Promise<Pipeline> {
        return this.client.multi() as Pipeline;
    }
    
    async flushall(): Promise<'OK'> {
        return this.client.flushall();
    }
}

export default RedisSingleton.getInstance();
