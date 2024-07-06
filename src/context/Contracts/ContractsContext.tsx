import { createContext } from 'react'
import { ethers } from "ethers";

interface ContextProps {
  marketPlaceContract: ethers.Contract | null;
  nftContract: ethers.Contract | null,
  provider: ethers.providers.JsonRpcSigner | undefined
  loadWeb3: () => Promise<void>
}

export const ContractsContext = createContext({} as ContextProps)
