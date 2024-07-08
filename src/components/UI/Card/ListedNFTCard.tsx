import { NFTItems } from "../../../interfaces/NFT.interface";
import { convertWeiToEther } from "../../../lib/utils";

interface Props {
  item: NFTItems;
}

export function ListedNFTCard({ item }: Props) {
  return (
    <article className="card w-64 h-auto" key={item.image.split("/")[4]}>
      <div className="card2 w-full h-auto flex flex-col justify-start items-start">
        <img
          src={item.image}
          alt="nft image"
          className="rounded-t-[15px]"
        />
        <div className="w-full p-4">
          <h3 className="text-white text-2xl font-medium line-clamp-1">
            {item.name}
          </h3>
          <div className="w-full mt-2 flex justify-between items-center">
            <p className="text-white font-normal">Price:</p>
            <p className="text-white font-bold">
              {`${convertWeiToEther(item.totalPrice.toString())} ETH`}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
