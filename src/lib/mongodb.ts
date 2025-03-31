import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_DB_URL;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  throw new Error("❌ Missing configuration in .env");
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

const client = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> =
  globalForMongo._mongoClientPromise ?? client.connect();

// Store the promise in global scope only in development
if (process.env.NODE_ENV === "development") {
  globalForMongo._mongoClientPromise = clientPromise;
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export async function closeDb() {
  const client = await clientPromise;
  await client.close();
}

export default clientPromise;
