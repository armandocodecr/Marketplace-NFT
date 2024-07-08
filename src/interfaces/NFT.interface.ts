export interface NFTItems {
    totalPrice: {
        type: "BigNumber";
        hex: string;
    };
    itemId: {
        type: "BigNumber";
        hex: string;
    };
    seller: string;
    name: string;
    description: string;
    image: string;
}