import { useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ContractsContext } from "../context/Contracts";
import axios from "axios";
import { NFTItems } from "../interfaces/NFT.interface";

export function useMarketplace() {
  const { marketPlaceContract, nftContract, provider } = useContext(ContractsContext);
  const { isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NFTItems[]>([]);
  const loadMarketplaceItem = async () => {
    if (isConnected && provider && marketPlaceContract && nftContract) {
      try {
        const itemAcount = await marketPlaceContract.itemCount();
        let items = [];
        for (let i = 1; i <= +itemAcount.toString(); i++) {
          const item = await marketPlaceContract.items(i);
          if (!item.sold) {
            const cid = await nftContract.tokenURI(item.tokenId);
            const response = await axios.get('https://api.pinata.cloud/data/pinList', {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
              },
              params: {
                cid
              }
            }).then(res => res.data.rows[0]);
            const { metadata } = response
            const totalPrice = await marketPlaceContract.getTotalPrice(
              item.itemId
            );
            items.push({
              totalPrice,
              itemId: item.itemId,
              seller: item.seller,
              name: metadata.name,
              description: metadata.keyvalues.description,
              image: `https://gateway.pinata.cloud/ipfs/${cid}`,
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
