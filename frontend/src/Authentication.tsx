import { type SubmitEvent, useState } from "react";
import { fetchGet, fetchPost } from "./Api.tsx";
import type { Action } from "./Reducer.ts";

const onFormSubmit = async (
  e: SubmitEvent<HTMLFormElement>,
  name: string,
  pass: string,
  setter: (x: boolean) => void,
  dispatch: (x: Action) => void,
) => {
  e.preventDefault();
  await fetchPost("login", {
    userName: name,
    password: pass,
  });

  setter(true);
  fetchGet("load-post").then((res) => {
    dispatch({ act: "render-posts", posts: res.usersPost });
  });
};

const UserName = ({ setName }) => (
  <input
    type="text"
    name="userName"
    required
    onChange={(e) => {
      setName(e.target.value);
    }}
  />
);

const Password = ({ setPass }) => (
  <input
    type="password"
    required
    onChange={(e) => {
      setPass(e.target.value);
    }}
  />
);

const SubmitForm = () => <button type="submit">Login</button>;

export const Auth = ({ setter, dispatch }) => {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  return (
    <>
      <h1>Login</h1>
      <form
        onSubmit={async (e) => {
          await onFormSubmit(e, name, pass, setter, dispatch);
        }}
      >
        <UserName setName={setName} />
        <Password setPass={setPass} />
        <SubmitForm />
      </form>
    </>
  );
};
