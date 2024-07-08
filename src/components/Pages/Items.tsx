import { useContext, useEffect } from "react";
import { useAccount } from "wagmi";
import { useMarketplace } from "../../hooks";
import { ContractsContext } from "../../context/Contracts";
import { ListedNFTCard, SoldNFTCard } from "../UI/Card";
import { Loader } from "../UI/Loader/Loader";

export function Items() {
    const { isConnected } = useAccount();
    const { marketPlaceContract, nftContract, provider } = useContext(ContractsContext)
    const { loadListedItems, items, loading } = useMarketplace()
    const { listedItems, soldItems } = items;

    useEffect(() => {
      loadListedItems();
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
          :(
            <div className="w-full h-full flex flex-col justify-start items-start">
              <h1 className="text-4xl text-[#FCD535] font-medium">Your NFTs for sale</h1>
              <div className="mt-5 flex flex-col gap-5 justify-center items-center lg:flex-row">
                {
                  listedItems.length !== 0
                  ? (
                    listedItems.map(item => (
                      <ListedNFTCard item={item} key={item.itemId.toString()} /> 
                    ))
                  )
                  : (
                    <div className="w-full h-full flex flex-col pl-10 justify-start items-start">
                      <h2 className="text-2xl text-white font-medium">No NFT's for sale</h2>
                    </div>
                  )
                }
              </div>
              <h1 className="text-4xl mt-10 text-[#FCD535] font-medium">No NFT's sold</h1>
              <div className="card-container mt-5">
                {
                  soldItems.length !== 0
                  ? (
                    soldItems.map(item => (
                      <SoldNFTCard item={item} key={item.itemId.toString()} /> 
                    ))
                  )
                  : (
                    <div className="w-full h-full flex flex-col pl-10 justify-start items-start">
                      <h2 className="text-2xl text-white font-medium">No NFT's for sale</h2>
                    </div>
                  )
                }
              </div>
            </div>
          )
        }
      </section>
    );
  }
  