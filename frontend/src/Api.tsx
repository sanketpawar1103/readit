type Body =
  | { title: string; body: string }
  | { id: string }
  | { userName: string; password: string };

export const fetchPost = (endPoint: string, body: Body) =>
  fetch(`http://localhost:8000/${endPoint}`, {
    method: "post",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => res);

export const fetchGet = (endPoint: string) =>
  fetch(`http://localhost:8000/${endPoint}`)
    .then((res) => res.json())
    .then((res) => res);
