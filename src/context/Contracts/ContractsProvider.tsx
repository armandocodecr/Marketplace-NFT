import { FC, useEffect, useState } from 'react'
import { ethers } from "ethers";
import { useAccount } from 'wagmi'
import { ContractsContext } from './ContractsContext'
import { useConnect } from '../../hooks';

import MarketplaceAbi from '../../contractsData/Marketplace.json'
import NFTAbi from '../../contractsData/NFT.json'
import MarketplaceAddress from '../../contractsData/Marketplace-address.json'
import NFTAddress from '../../contractsData/NFT-address.json'

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const ContractsProvider: FC<Props> = ({ children }) => {

    const [marketPlaceContract, setMarketPlaceContract] = useState<ethers.Contract | null>(null)
    const [nftContract, setNftContract] = useState<ethers.Contract | null>(null)

    const { isConnected } = useAccount()
    const { useEthersSigner } = useConnect()
    
    const provider = useEthersSigner();

    const loadContracts = async () => {
        const signer = provider;
        const marketplace = new ethers.Contract(
          MarketplaceAddress.address,
          MarketplaceAbi.abi,
          signer
        );
        const nft = new ethers.Contract(
            NFTAddress.address,
            NFTAbi.abi,
            signer
        );
        setNftContract(nft)
        setMarketPlaceContract(marketplace);
      };

    const loadWeb3 = async () => {
        if (window.ethereum) {
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
          } catch (error) {
            console.error("User denied account access");
          }
        } else {
          window.alert("¡Deberías considerar usar Metamask!");
        }
    };

    useEffect(() => {
      loadContracts()
    }, [provider]) 

    return (
       < ContractsContext.Provider value={{
           marketPlaceContract,
           nftContract,
           provider,
           loadWeb3
      }}>
          { children }
        </ ContractsContext.Provider>
    )
}