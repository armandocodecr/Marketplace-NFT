import { useContext, useState } from "react";
import { useAccount } from "wagmi";
import { ContractsContext } from "../context/Contracts";
import axios from "axios";
import { NFTItems, NFTListItems } from "../interfaces/NFT.interface";

export function useMarketplace() {
  const { marketPlaceContract, nftContract, provider } = useContext(ContractsContext);
  const { isConnected, address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NFTListItems>({
    homeItems: [],
    listedItems: [],
    purchasesItems: [],
    soldItems: []
  })

  const loadMarketplaceItem = async () => {
    if (isConnected && provider && marketPlaceContract && nftContract) {
      try {
        setLoading(true);
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
        setItems(prev => ({...prev, homeItems: items}));
      } catch (error) {
        console.error("Error loading marketplace items:", error);
      }
    } else {
      console.warn("Conditions not met to load marketplace items");
    }
  };

  const loadListedItems = async () => {
    if (isConnected && provider && marketPlaceContract && nftContract) {
      try {
        setLoading(true);
        const itemAcount = await marketPlaceContract.itemCount();
        let listedItems = [];
        let soldItems = [];
        for (let i = 1; i <= +itemAcount.toString(); i++) {
          const item = await marketPlaceContract.items(i);
          if (item.seller === address) {
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

            let data = {
              totalPrice,
              itemId: item.itemId,
              ethReceived: item.price,
              seller: item.seller,
              name: metadata.name,
              description: metadata.keyvalues.description,
              image: `https://gateway.pinata.cloud/ipfs/${cid}`,
            }

            if(item.sold){
              soldItems.push(data)
            }else {
              listedItems.push(data);
            }
            
          }
        }
        setLoading(false);
        setItems(prev => ({...prev, listedItems: listedItems, soldItems: soldItems}));
    
      } catch (error) {
        console.error("Error loading marketplace items:", error);
      }
    } else {
      console.warn("Conditions not met to load marketplace items");
    }
  };

  const loadPurchasedItems = async () => {
    if (isConnected && provider && marketPlaceContract && nftContract) {
      try {
        setLoading(true);
        const filter = marketPlaceContract.filters.Bought(null, null, null, null, null, address);
        const results = await marketPlaceContract.queryFilter(filter);
        const purchases = await Promise.all(results.map(async (event) => {
          const args = event.args;
          if (!args) {
            return null;
          }
  
          const tokenId = args.tokenId;
          const itemId = args.itemId;
          const price = args.price;
          const seller = args.seller;
  
          const cid = await nftContract.tokenURI(tokenId);
          const response = await axios.get('https://api.pinata.cloud/data/pinList', {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
            },
            params: {
              cid
            }
          }).then(res => res.data.rows[0]);
  
          const { metadata } = response;
          const totalPrice = await marketPlaceContract.getTotalPrice(itemId);
  
          return {
            totalPrice,
            ethReceived: price,
            itemId,
            seller,
            name: metadata.name,
            description: metadata.keyvalues.description,
            image: `https://gateway.pinata.cloud/ipfs/${cid}`
          };
        }));

        setLoading(false);
        setItems((prev) => ({
          ...prev,
          purchasesItems: purchases as NFTItems[]
        }));
  
      } catch (error) {
        console.error("Error loading marketplace items:", error);
      }
    } else {
      console.warn("Conditions not met to load marketplace items");
    }
  };
  
  

  const buyMarketItem = async (item: NFTItems) => {
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

  return {
    // Variables
    items,
    loading,

    // Functions
    loadMarketplaceItem,
    buyMarketItem,
    loadListedItems,
    loadPurchasedItems
  }
}
