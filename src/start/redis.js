const config = require('config')
const redis = require('redis');

class RedisSingleton {
    constructor() {
        if (!RedisSingleton.instance) {
            this.client = redis.createClient({
                host: config.get('redis.host'),
                port: config.get('redis.port'),
                db: config.get('redis.db')
            });
            RedisSingleton.instance = this;
        }
        this.client.connect()
        return RedisSingleton.instance;
    }
    
    getClient() {
        return this.client;
    }
}

const redisSingleton = new RedisSingleton();

module.exports = redisSingleton;
