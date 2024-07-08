export interface NFTItems {
    totalPrice: {
        type: "BigNumber";
        hex: string;
    };
    itemId: {
        type: "BigNumber";
        hex: string;
    };
    ethReceived?: {
        type: "BigNumber";
        hex: string;
    };
    seller: string;
    name: string;
    description: string;
    image: string;
}

export interface NFTListItems {
    homeItems: NFTItems[],
    listedItems: NFTItems[],
    soldItems: NFTItems[],
    purchasesItems: NFTItems[],
}