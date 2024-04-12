import { Fetcher } from "swr";

export class Fetchers {
  static GET: Fetcher<any, string> = (url) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`).then((r) => r.json());
  static POST: Fetcher<any, string> = (url) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, { method: "POST" }).then(
      (r) => r.json()
    );
}
