const {createClient} = require('redis')

const client = createClient({
    username: 'default',
    password: '2wO7Yf0x3IQT2mq39Kztit0K00ekmbcg',
    socket: {
        host: 'redis-13511.c326.us-east-1-3.ec2.cloud.redislabs.com',
        port: 13511
    }
});

client.on('error', err => console.log('Redis Client Error', err));

if(!client.isOpen){
    client.connect();
}

module.exports = {client}
