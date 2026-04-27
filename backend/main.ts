import { Db } from "mongodb";
import { makeSetUp } from "./setup_db.ts";
import { createApp } from "./src/app.ts";
import { PostStoreDB } from "./src/post_store_db.ts";
import { UserStore } from "./src/user_store_db.ts";

const main = async () => {
  const db: Db = await makeSetUp();
  const userDb = new UserStore(db);
  const postDb = new PostStoreDB(db, userDb);
  const app = createApp(postDb);
  Deno.serve({ port: 8000 }, app.fetch);
};

main();
