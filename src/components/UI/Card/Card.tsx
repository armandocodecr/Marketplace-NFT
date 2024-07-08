import { NFTItems } from "../../../interfaces/NFT.interface";
import { convertWeiToEther } from "../../../lib/utils";

interface Props {
  item: NFTItems;
}

export function Card({ item }: Props) {
  return (
    <div className="card w-full h-auto" key={item.image.split("/")[4]}>
      <div className="card2 w-full h-auto gap-3 flex flex-col justify-start items-start">
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
          <button className="w-full flex mt-3 justify-center items-center bg-[#FCD535] text-black py-1 font-medium rounded-lg transition-all ease-in hover:bg-[#fcd435d3]">
            BUY NFT
          </button>
        </div>
      </div>
    </div>
  );
}
