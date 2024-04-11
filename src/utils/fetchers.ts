import { Fetcher } from "swr";

export const fetcher: Fetcher<any, string> = (url) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`).then((r) => r.json());
