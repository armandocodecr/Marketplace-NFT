import { useContext, useEffect } from "react";
import { useAccount } from "wagmi";
import { useMarketplace } from "../../hooks";
import { ContractsContext } from "../../context/Contracts";
import { ListedNFTCard } from "../UI/Card";
import { Loader } from "../UI/Loader/Loader";

export function Purchases() {
    const { isConnected } = useAccount();
    const { marketPlaceContract, nftContract, provider } = useContext(ContractsContext)
    const { loadPurchasedItems, items, loading } = useMarketplace()
    const { purchasesItems } = items;

    useEffect(() => {
      loadPurchasedItems();
    }, [isConnected, provider, marketPlaceContract, nftContract]);

    return (
      <section className="w-full mt-32 h-screen flex flex-col gap-5 justify-center items-center">
        {
          !isConnected ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-white text-2xl font-medium">Waiting for Metamask's connection...</p>
            </div>
          )
          : loading ? (
            <Loader /> 
          )
          : purchasesItems.length !== 0 ?
          (
            <div className="w-full h-full flex flex-col justify-start items-start">
              <h1 className="text-4xl text-[#FCD535] font-medium">Your purchases</h1>
              <div className="mt-5 flex flex-col gap-5 justify-center items-center lg:flex-row">
                {
                  purchasesItems.map(item => (
                    <ListedNFTCard item={item} key={item.itemId.toString()} /> 
                  ))
                }
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-start items-start">
              <h2 className="text-4xl text-white font-medium">No purchases</h2>
            </div>
          )
        }
      </section>
    );
  }
  