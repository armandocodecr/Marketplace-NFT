import { useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ContractsContext } from "../context/Contracts";

export function useMarketplace() {
  const { marketPlaceContract, nftContract, provider } = useContext(ContractsContext);
  const { isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const loadMarketplaceItem = async () => {
    if (isConnected && provider && marketPlaceContract && nftContract) {
      try {
        const itemAcount = await marketPlaceContract.itemCount();
        let items = [];
        for (let i = 1; i <= +itemAcount.toString(); i++) {
          const item = await marketPlaceContract.items(i);
          if (!item.sold) {
            const uri = await nftContract.tokenURI(item.tokenId);
            const response = await fetch(uri).then((res) => res.json());
            const totalPrice = await marketPlaceContract.getTotalPrice(
              item.itemId
            );
            items.push({
              totalPrice,
              itemId: item.itemId,
              seller: item.seller,
              name: response.name,
              description: response.description,
              image: response.image,
            });
          }
        }
        setLoading(false);
        setItems(items);
      } catch (error) {
        console.error("Error loading marketplace items:", error);
      }
    } else {
      console.warn("Conditions not met to load marketplace items");
    }
  };

  const buyMarketItem = async (item: any) => {
    try {
      await (
        await marketPlaceContract!.purchaseItem(item.itemId, {
          value: item.totalPrice,
        })
      ).wait();
      loadMarketplaceItem();
    } catch (error) {
      console.error("Error buying market item:", error);
    }
  };

  useEffect(() => {
    loadMarketplaceItem();
  }, [isConnected, provider, marketPlaceContract, nftContract]);

  return {
    // Variables
    items,
    loading,

    // Functions
    loadMarketplaceItem,
    buyMarketItem
  }
}
