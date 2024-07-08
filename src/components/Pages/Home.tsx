import { useAccount } from "wagmi"

import { useMarketplace } from "../../hooks";
import { Card } from "../UI/Card";

export function Home() {
  const { isConnected } = useAccount();
  const { items, loading } = useMarketplace();

  return (
    <section className="w-full h-full flex flex-col gap-5 justify-start mt-32 items-center">
      {!isConnected ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-white text-2xl font-medium">
            Waiting for Metamask's connection...
          </p>
        </div>
      ) : loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-white text-2xl font-medium">Loading items...</p>
        </div>
      ) : (
        <div className="card-container">
          {items.length !== 0 ? (
              items.map((item) => (
                <Card item={item} /> 
              ))
          ) : (
            <span className="text-3xl text-white font-medium">
              No assets...
            </span>
          )}
        </div>
      )}
    </section>
  );
}
