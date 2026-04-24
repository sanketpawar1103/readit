type Body =
  | { title: string; body: string }
  | { id: string }
  | { userName: string; password: string }
  | { initials: string }
  | { id: string; isSubscribed: boolean }
  | { postId: string };

export const fetchPost = (endPoint: string, body: Body) =>
  fetch(`http://localhost:8000/${endPoint}`, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => res);

export const fetchGet = (endPoint: string) =>
  fetch(`http://localhost:8000/${endPoint}`, { credentials: "include" })
    .then((res) => res.json())
    .then((res) => res);
