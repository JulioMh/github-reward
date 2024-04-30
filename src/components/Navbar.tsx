import { getSession } from "@/session";
import { WalletButton } from "./WalletButton";
import Link from "next/link";

export const Navbar = async () => {
  const session = await getSession();

  return (
    <nav className="flex fixed w-screen">
      <div className="flex-1 flex justify-start m-8">
        {session?.user ? (
          <>
            <Link href="/repos" className="ml-32">
              Repos
            </Link>{" "}
            <Link href={""} className="ml-32">
              Rewards
            </Link>
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
