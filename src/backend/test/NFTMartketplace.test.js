import pkg from 'hardhat';
const { ethers } = pkg;

const { expect } = await import("chai");
const chai = await import("chai");
const { solidity } = await import("ethereum-waffle");

chai.use(solidity);

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("NFTMarketplace", function () {
    let NFT;
    let nft;
    let Marketplace;
    let marketplace;
    let deployer;
    let addr1;
    let addr2;
    let addrs;
    let feePercent = 1;
    let URI = "sample URI";

    beforeEach(async function () {
        NFT = await ethers.getContractFactory("NFT");
        Marketplace = await ethers.getContractFactory("Marketplace");
        [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();

        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deployment", function () {
        it("Should track name and symbol of the nft collection", async function () {
            const nftName = "DApp NFT";
            const nftSymbol = "DAPP";
            expect(await nft.name()).to.equal(nftName);
            expect(await nft.symbol()).to.equal(nftSymbol);
        });

        it("Should track feeAccount and feePercent of the marketplace", async function() {
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            const scFeePercent = await marketplace.feePercent();
            expect(scFeePercent.toString()).to.equal(feePercent.toString());
        });
    });

    describe("Minting NFTs", function () {
        it("Should track each minted NFT", async function () {
            await nft.connect(addr1).mint(URI);
            const tokenCountAddr1 = await nft.tokenCount();
            const balanceOfAddr1 = await nft.balanceOf(addr1.address);
            expect(+tokenCountAddr1.toString()).to.equal(1);
            expect(+balanceOfAddr1.toString()).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(addr2).mint(URI);
            const tokenCountAddr2 = await nft.tokenCount();
            const balanceOfAddr2 = await nft.balanceOf(addr2.address);
            expect(+tokenCountAddr2.toString()).to.equal(2);
            expect(+balanceOfAddr2.toString()).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
        });
    });

    describe("Making marketplace items", function () {
        let price = 1;
        let result;

        beforeEach(async function() {
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
        });

        it("Should track newly created item", async function() {
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price)))
            .to.emit(marketplace, "Offered")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                addr1.address
            );

            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            const tokenCount = await nft.tokenCount();
            const item = await marketplace.items(1);
            expect(Number(tokenCount.toString())).to.equal(1);
            expect(item.itemId).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(price));
            expect(item.sold).to.equal(false);
        });

        it("Should fail if price is set to zero", async function (){
            await expect(marketplace.connect(addr1).makeItem(
                nft.address, 1, 0)).to.be.revertedWith("Price must be greater than zero");
        });
    });

    describe("Purchasing marketplace items", function () {

        let price = 2;
        let fee = (feePercent/100)*price;
        let totalPriceInWei;

        beforeEach(async function() {
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
            await marketplace.connect(addr1).makeItem(
                nft.address,
                1,
                toWei(price),
            )
        });

        it("Should update item as sold, pay sellet, transfer to buyer...", async function() {
            const sellerInitialEthBal = await addr1.getBalance();
            const feeAccountInitialEthBal = await deployer.getBalance();
            totalPriceInWei = await marketplace.getTotalPrice(1);
            await expect(marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei }))
            .to.emit(marketplace, "Bought")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                addr1.address,
                addr2.address
            );

            const selletFinalEthBal = await addr1.getBalance();
            const feeAccountFinalEthBal = await deployer.getBalance();

            expect((await marketplace.items(1)).sold).to.equal(true);
            expect(+fromWei(selletFinalEthBal)).to.equal(+price + +fromWei(sellerInitialEthBal));
            expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal));
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
        })

    });
});
