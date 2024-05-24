import { getSession } from "@/session";
import { WalletButton } from "./WalletButton";
import Link from "next/link";
import { Query } from "@/lib/smart-contract/query";

export const Navbar = async () => {
  const session = await getSession();
  const balance = session ? await Query.getBalance(session?.user.publicKey) : 0;

  return (
    <nav className="flex fixed w-screen">
      <div className="flex-1 flex justify-between m-8">
        {session?.user ? (
          <>
            <Link href="/repos" className="ml-32">
              Repos
            </Link>{" "}
            <div className="ml-32">
              <span>Balance: {balance}</span>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="flex-2 flex justify-end m-8">
        <WalletButton />
      </div>
    </nav>
  );
};
