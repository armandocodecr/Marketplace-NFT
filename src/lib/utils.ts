import { ethers } from "ethers";

export function truncateText(text: string, length: number) {
    if (text.length <= 2 * length) {
      return text;
    }
    
    const start = text.slice(0, length);
    const end = text.slice(-length);
    return `${start}...${end}`;
}

export function convertWeiToEther (value: string) {
  return ethers.utils.formatEther(value);
}