import { MongoClient } from "mongodb";

export const makeSetUp = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017");

  await client.connect();

  return client.db("Readit");
};
