"use client";

import { create } from "zustand";
import { Session } from "@/session";
import { useEffect } from "react";

type State = {
  session: Session | null;
};
type Action = {
  setSession: (session: Session | null) => void;
};

export const useSessionStore = create<State & Action>((set) => ({
  session: null,
  setSession: (session: Session | null) => set(() => ({ session })),
}));

export const SessionProvider = ({ session }: { session: Session | null }) => {
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    setSession(session);
  }, [session, setSession]);

  return <></>;
};
