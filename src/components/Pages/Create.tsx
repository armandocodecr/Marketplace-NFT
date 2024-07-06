import { ChangeEvent, useContext, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import axios from "axios";
import { ContractsContext } from "../../context/Contracts";

type InputValues = {
  image: File | null;
  price: number;
  name: string;
  description: string;
};

const pinataJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwNjBiNmM2Zi1lNWQ0LTQ0MWMtYmFkMS1jZmM0ZTYwMzJhMmIiLCJlbWFpbCI6ImFybWFuZG8uY3IubXVyaWxsb0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOThmMTg0MDQyMWYxY2NkODMxMGUiLCJzY29wZWRLZXlTZWNyZXQiOiI4ZWY2YzJlMTQxYjBmNDZhY2FkYzdkOTY5NTA4OWQxMDhjZDRjZDAzYTcyODA0MzEyZTI0MDhiZTMxYzFkZjRjIiwiaWF0IjoxNzIwMjE2MjI3fQ.UcP1EWKBhFgAF87muzEF_a6i7TWHIFIHqUu3A7_lL8A';

export function Create() {
  const { isConnected } = useAccount();
  const { nftContract, marketPlaceContract } = useContext(ContractsContext);
  const [inputValues, setInputValues] = useState<InputValues>({
    image: null,
    price: 0,
    name: "",
    description: "",
  });

  const uploadToPinata = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      setInputValues((prev) => ({ ...prev, image: file }));
    }
  };

  const createNFT = async () => {
    const { description, image, name, price } = inputValues;
    if (!image || !price || !description || !name) return;
    console.log({ description, image, name, price });
    try {
      const formData = new FormData();
      formData.append('file', image);
      
      const pinataMetadata = JSON.stringify({
        name: name,
        keyvalues: {
          description: description,
        }
      });
      formData.append('pinataMetadata', pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', pinataOptions);

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Bearer ${pinataJWT}`
        }
      });

      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      mintThenList(ipfsUrl);
    } catch (error) {
      console.log("ipfs uri upload error:", error);
    }
  };

  const mintThenList = async (uri: string) => {
    const { price } = inputValues;
    try {
      await (await nftContract!.mint(uri)).wait();
      const id = await nftContract!.tokenCount();
      await (await nftContract!.setApprovalForAll(marketPlaceContract!.address, true)).wait();
      const listingPrice = ethers.utils.parseEther(price.toString());
      await (await marketPlaceContract!.makeItem(nftContract!.address, id, listingPrice)).wait();
    } catch (error) {
      console.log("Error minting and listing NFT:", error);
    }
  };

  return (
    <section className="w-full px-64 h-screen flex flex-col gap-5 justify-start items-center py-32">
      {!isConnected ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-white text-2xl font-medium">
            Waiting for Metamask's connection...
          </p>
        </div>
      ) : (
        <section className="w-full flex gap-5 justify-start items-start flex-col">
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <label className="text-sm text-[#ffffffd7] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Picture
            </label>
            <input
              className="flex w-full rounded-md border border-blue-300 border-input bg-transparent text-md text-[#ffffffd7] file:border-0 file:py-3 file:bg-[rgb(35,34,59)] file:text-white file:text-sm file:font-medium"
              type="file"
              id="picture"
              onChange={uploadToPinata}
            />
          </div>
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <input
              type="text"
              className="flex w-full outline-none px-2 py-2 rounded-md border border-blue-300 border-input bg-transparent text-md text-[#ffffffd7] font-medium"
              onChange={(e) =>
                setInputValues((prev) => ({ ...prev, name: e.target.value }))
              }
              value={inputValues.name}
            />
          </div>
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <textarea
              className="flex w-full outline-none px-2 py-2 rounded-md border border-blue-300 border-input bg-transparent text-md text-[#ffffffd7] font-medium"
              onChange={(e) =>
                setInputValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              value={inputValues.description}
            />
          </div>
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <input
              type="text"
              className="flex w-full outline-none px-2 py-2 rounded-md border border-blue-300 border-input bg-transparent text-md text-[#ffffffd7] font-medium"
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[0-9\b]+$/;
                if (value === "" || regex.test(value)) {
                  setInputValues((prev) => ({
                    ...prev,
                    price: Number(value),
                  }));
                }
              }}
              value={inputValues.price}
            />
          </div>
          <button 
            type="button" 
            onClick={createNFT}
            className="min-w-80 bg-[rgb(35,34,59)] cursor-pointer rounded-md border text-[#ffffff] border-blue-300 py-2 transition-all ease-in hover:bg-[rgb(68,65,114)]"
          >
            CREATE AND LIST NFT
          </button>
        </section>
      )}
    </section>
  );
}


/*
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const JWT = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwNjBiNmM2Zi1lNWQ0LTQ0MWMtYmFkMS1jZmM0ZTYwMzJhMmIiLCJlbWFpbCI6ImFybWFuZG8uY3IubXVyaWxsb0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOThmMTg0MDQyMWYxY2NkODMxMGUiLCJzY29wZWRLZXlTZWNyZXQiOiI4ZWY2YzJlMTQxYjBmNDZhY2FkYzdkOTY5NTA4OWQxMDhjZDRjZDAzYTcyODA0MzEyZTI0MDhiZTMxYzFkZjRjIiwiaWF0IjoxNzIwMjE2MjI3fQ.UcP1EWKBhFgAF87muzEF_a6i7TWHIFIHqUu3A7_lL8A

const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = "path/to/file.png";

    const file = fs.createReadStream(src)
    formData.append('file', file)

    const pinataMetadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${JWT}`
        }
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}
pinFileToIPFS()

// Gateway URL: https://purple-mad-salmon-62.mypinata.cloud

*/
