import { NFTItems } from "../../../interfaces/NFT.interface";
import { convertWeiToEther } from "../../../lib/utils";

interface Props {
  item: NFTItems;
}

export function SoldNFTCard({ item }: Props) {
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
          <div className="w-full flex justify-between items-center">
            <div className="w-full mt-2 flex flex-col justify-between items-start">
              <p className="text-white font-normal">For:</p>
              <p className="text-white font-bold">
                {`${convertWeiToEther(item.totalPrice.toString())} ETH`}
              </p>
            </div>
            <div className="w-full mt-2 flex flex-col justify-between items-end">
              <p className="text-white font-normal">Received:</p>
              <p className="text-white font-bold">
                {`${convertWeiToEther(item.totalPrice.toString())} ETH`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
