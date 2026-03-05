const corsOptions = {
    origin: 'https://8081-aceeaaadefefcfccffeabf.premiumproject.examly.io',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

module.exports = corsOptions;
