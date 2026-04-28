import { Db } from "mongodb";
import { makeSetUp } from "./setup_db.ts";
import { createApp } from "./src/app.ts";
import { PostStore } from "./src//modules/post_store_db.ts";
import { UserStore } from "./src/modules/user_store_db.ts";

const main = async () => {
  const db: Db = await makeSetUp();
  const userDb = new UserStore(db);
  const postDb = new PostStore(db, userDb);
  const app = createApp(postDb);
  Deno.serve({ port: 8000 }, app.fetch);
};

main();
