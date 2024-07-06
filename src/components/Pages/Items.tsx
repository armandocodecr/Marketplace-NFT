import { useAccount } from "wagmi";

export function Items() {
    const { isConnected } = useAccount();
    return (
      <section className="w-full h-screen flex flex-col gap-5 justify-center items-center">
        {
          !isConnected && (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-white text-2xl font-medium">Waiting for Metamask's connection...</p>
            </div>
          )
        }
      </section>
    );
  }
  