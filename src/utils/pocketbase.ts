import PocketBase from "pocketbase";

export const pbClient = new PocketBase(process.env.NEXT_PUBLIC_POCKET_BASE_URL);

export enum Collections {
  USERS = "users",
}
