import config from 'config';
import Redis from 'ioredis';

class RedisSingleton {
    constructor() {
        if (RedisSingleton.instance) return RedisSingleton.instance;

        this.client = new Redis({
            host: config.get('redis.host'),
            port: config.get('redis.port'),
            db: config.get('redis.db')
        });
        RedisSingleton.instance = this;

        return RedisSingleton.instance;
    }

    getClient() {
        return this.client;
    }
}

export default new RedisSingleton();

