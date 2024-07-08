import { useContext } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { ContractsContext } from "../../context/Contracts";

type InputValues = {
  image: FileList | null;
  price: string;
  name: string;
  description: string;
};

export function Create() {
  const { isConnected } = useAccount();
  const { register, handleSubmit, formState: { errors } } = useForm<InputValues>();
  const { nftContract, marketPlaceContract } = useContext(ContractsContext);

  const onSubmit: SubmitHandler<InputValues> = async (data) => {
    const { image, name, price, description } = data;

    if (!image || !price || !name || !description) {
      toast.error("All fields are required");
      return;
    } else if (Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', image[0]);

      const pinataMetadata = JSON.stringify({
        name: name,
        keyvalues: {
          description: description
        }
      });
      formData.append('pinataMetadata', pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0
      });
      formData.append('pinataOptions', pinataOptions);

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
        }
      });

      const cid = res.data.IpfsHash;
      await mintThenList(cid, price);
    } catch (error) {
      console.log("IPFS URI upload error:", error);
      toast.error("Failed to upload to Pinata");
    }
  };

  const mintThenList = async (cid: string, price: string) => {
    try {
      await (await nftContract!.mint(cid)).wait();
      const id = await nftContract!.tokenCount();
      await (await nftContract!.setApprovalForAll(marketPlaceContract!.address, true)).wait();
      const listingPrice = ethers.utils.parseEther(price);
      await (await marketPlaceContract!.makeItem(nftContract!.address, id, listingPrice)).wait();
      toast.success("NFT minted and listed successfully");
    } catch (error) {
      console.log("Error minting and listing NFT:", error);
      toast.error("Failed to mint and list NFT");
    }
  };

  return (
    <section className="w-full h-screen flex flex-col gap-5 justify-start items-start py-32">
      {!isConnected ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-white text-2xl font-medium">
            Waiting for Metamask's connection...
          </p>
        </div>
      ) : (
        <section className="flex flex-col justify-center items-center">
          <h1 className="text-3xl text-white font-bold self-start">CREATE YOUR NFT</h1>
          <form
            className="w-full flex justify-start items-start flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor="picture" className="text-lg text-white font-medium mt-5">
              Image
            </label>
            <input
              className="flex min-w-[32rem] rounded-md border border-[#ffffff67] border-input bg-transparent text-md text-[#ffffffd7] file:border-0 file:py-3 file:bg-[#FCD535] file:text-bloack file:text-sm file:font-medium file:cursor-pointer file:hover:bg-[#fcd435d3]"
              type="file"
              id="picture"
              {...register("image", { required: true })}
            />
            {errors.image && <span className="text-red-600 font-normal text-sm mt-1">This field is required</span>}
            
            <label htmlFor="name" className="text-lg text-white font-medium mt-5">
              Name
            </label>
            <input
              {...register("name", { required: true, maxLength: 20 })}
              autoComplete="off"
              className="flex min-w-[32rem] outline-none px-2 py-2 rounded-md border border-[#ffffff67] border-input bg-transparent text-md text-[#ffffffd7] font-medium"
            />
            {errors.name && <span className="text-red-600 font-normal text-sm mt-1">This field is required</span>}
            
            <label htmlFor="description" className="text-lg text-white font-medium mt-5">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              className="flex min-w-[32rem] outline-none px-2 py-2 rounded-md border border-[#ffffff67] border-input bg-transparent text-md text-[#ffffffd7] font-medium"
            ></textarea>
            {errors.description && <span className="text-red-600 font-normal text-sm mt-1">This field is required</span>}
            
            <label htmlFor="price" className="text-lg text-white font-medium mt-5">
              Price
            </label>
            <input
              {...register("price", { required: true, min: 0 })}
              autoComplete="off"
              className="flex min-w-[32rem] outline-none px-2 py-2 rounded-md border border-[#ffffff67] border-input bg-transparent text-md text-[#ffffffd7] font-medium"
            />
            {errors.price && <span className="text-red-600 font-normal text-sm mt-1">This field is required</span>}
            
            <input
              type="submit"
              value="Create NFT"
              className="min-w-80 bg-[#FCD535] font-medium cursor-pointer rounded-md text-black mt-5 py-2 transition-all ease-in hover:bg-[#fcd435d3]"
            />
          </form>
        </section>
      )}
    </section>
  );
}
