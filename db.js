require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds213338.mlab.com:13338/securing-apis-with-jwt`, { useMongoClient: true });
