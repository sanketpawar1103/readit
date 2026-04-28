import { Collection, Db, ObjectId } from "mongodb";

type User = {
  _id?: ObjectId;
  user: string;
  password: string;
  subscribed: string[];
};

export type Credentials = {
  userName: string;
  password: string;
};

export class UserStore {
  #users: Collection<User>;

  constructor(db: Db) {
    this.#users = db.collection<User>("users");
  }

  async loginUser({ userName, password }: Credentials) {
    const [isExist] = await this.#users
      .find({ user: userName, password: password })
      .toArray();

    if (isExist !== undefined) return { userId: isExist._id.toString() };

    const result = await this.#users.insertOne({
      user: userName,
      password: password,
      subscribed: [],
    });

    return { userId: result.insertedId.toString() };
  }

  async getUserData(userId: string) {
    const [result] = await this.#users
      .find({ _id: new ObjectId(userId) })
      .toArray();

    return result;
  }

  async searchUsers(initials: string) {
    const matches = await this.#users
      .find({ user: { $regex: "^" + initials, $options: "i" } })
      .toArray();

    return {
      matches: matches.map(({ _id, user, subscribed }) => ({
        _id: _id.toString(),
        user,
        subscribed,
      })),
    };
  }

  async unSubscribe(userId: string, id: string) {
    await this.#users.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { subscribed: id } },
    );
  }

  async subscribe(subscribed: string[], id: string, userId: string) {
    subscribed.push(id);

    await this.#users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { subscribed: subscribed } },
    );
  }
}
