import { useContext, useEffect } from "react";
import { useAccount } from "wagmi"

import { useMarketplace } from "../../hooks";
import { Card } from "../UI/Card";
import { ContractsContext } from "../../context/Contracts";
import { Loader } from "../UI/Loader/Loader";

export function Home() {
  const { isConnected } = useAccount();
  const { marketPlaceContract, nftContract, provider } = useContext(ContractsContext)
  const { items, loading, buyMarketItem, loadMarketplaceItem } = useMarketplace();
  const { homeItems } = items

  useEffect(() => {
    loadMarketplaceItem();
  }, [isConnected, provider, marketPlaceContract, nftContract]);

  return (
    <section className="w-full h-full flex flex-col gap-5 justify-start mt-32 items-start">
      {!isConnected ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-white text-2xl font-medium">
            Waiting for Metamask's connection...
          </p>
        </div>
      ) : loading ? (
        <Loader />
      ) : (
        <div className="mt-5 flex flex-col gap-5 justify-center items-center lg:flex-row">
          {homeItems.length !== 0 ? (
              homeItems.map((item) => (
                <Card item={item} buyMarketItem={buyMarketItem} key={item.itemId.toString()} /> 
              ))
          ) : (
            <div className="w-full h-full flex flex-col justify-start items-start">
              <h2 className="text-4xl text-white font-medium">No assets...</h2>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
