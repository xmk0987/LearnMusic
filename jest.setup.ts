import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  try {
    console.log("Dropping database...");
    await mongoose.connection.dropDatabase();
    console.log("Closing mongoose connection...");
    await mongoose.connection.close(); // Close mongoose connection
    console.log("Disconnecting mongoose...");
    await mongoose.disconnect(); // Disconnect from the memory server
    console.log("Stopping MongoMemoryServer...");
    await mongoServer.stop(); // Stop MongoMemoryServer
    console.log("Cleanup complete.");
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error; // Rethrow the error to fail the test
  }
});

afterEach(() => {
  jest.clearAllMocks(); // Clear mocks after each test
  jest.useRealTimers(); // Reset timers to avoid lingering fake timers
});
