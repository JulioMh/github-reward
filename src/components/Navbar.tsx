import { getSession } from "@/session";
import { WalletButton } from "./WalletButton";

export const Navbar = async () => {
  const session = await getSession();

  return (
    <nav className="flex fixed w-screen">
      <div className="flex-1 flex justify-start m-8">
        {session?.user ? (
          <>
            <button className="ml-32">Repos</button>{" "}
            <button className="ml-32">Rewards</button>
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
