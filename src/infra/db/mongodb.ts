import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/localdev';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);  // Exit process with failure
  }

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db');
  });

  mongoose.connection.on('error', (error) => {
    console.error(error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

