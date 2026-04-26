import { type SubmitEvent, useState } from "react";
import { fetchPost } from "./Api.tsx";

const onFormSubmit = async (
  e: SubmitEvent<HTMLFormElement>,
  name: string,
  pass: string,
  setter: (x: boolean) => void,
) => {
  e.preventDefault();
  await fetchPost("login", {
    userName: name,
    password: pass,
  });

  setter(true);
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

export const Auth = ({ setter }) => {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  return (
    <>
      <h1>Login</h1>
      <form
        onSubmit={async (e) => {
          await onFormSubmit(e, name, pass, setter);
        }}
      >
        <UserName setName={setName} />
        <Password setPass={setPass} />
        <SubmitForm />
      </form>

      <a href="http://localhost:8000/auth-with-git">Login with Github</a>
    </>
  );
};
