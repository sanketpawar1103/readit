import { Db } from "mongodb";
import { makeSetUp } from "./setup_db.ts";
import { createApp } from "./src/app.ts";
import { PostStoreDB } from "./src/post_store_db.ts";

const main = async () => {
  const db: Db = await makeSetUp();
  const dbStore = new PostStoreDB(db);
  const app = createApp(dbStore);
  Deno.serve({ port: 8000 }, app.fetch);
};

main();
