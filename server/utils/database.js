// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/code-repo', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('Database connection error:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

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

// // utils/database.js - Enhanced version
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/code-repo', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
    
//     // Handle connection events
//     mongoose.connection.on('error', err => {
//       console.error('MongoDB connection error:', err);
//     });

//     mongoose.connection.on('disconnected', () => {
//       console.log('MongoDB disconnected. Attempting to reconnect...');
//     });

//     mongoose.connection.on('reconnected', () => {
//       console.log('MongoDB reconnected successfully');
//     });

//     return conn;
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error.message);
//     // Don't exit process, let the server continue
//     return null;
//   }
// };

// module.exports = connectDB;