var config = {
    ourHandle: '@solarbadlands',
    mongohq_uri: process.env.MONGO_URI, // 'mongodb://user:password@mongoserver.com:10085/database'
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

module.exports = config;
