import { Fetcher } from "swr";

export const fetcher: Fetcher<any, string> = (url) =>
  fetch(`http://localhost:3000${url}`).then((r) => r.json());
