const mongoose = require('mongoose');


const connectDB = async () => {
mongoose.connect('mongodb+srv://mshari7185:Abhi%40430@gallary.xducnkc.mongodb.net/PNB_REPO')

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


};
module.exports = connectDB;
