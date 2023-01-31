const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
const airdrops = [
  {
    address: "0xd59276C2A56B19b678c4D22e3eeE148F5a816c37",
    discountRate: 10,
    signature: "",
  },
];
console.log(process.env.MAINNET_PRIVATE_KEY);
const wallet = new ethers.Wallet("0x" + process.env.MAINNET_PRIVATE_KEY);

Promise.all(
  airdrops.map(async (discount) => {
    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256"],
      [contractAddress, discount.address, discount.discountRate]
    );
    console.log(contractAddress, discount.address, discount.discountRate);
    const messageHashBytes = ethers.utils.arrayify(messageHash);
    // console.log(messageHash)
    // eslint-disable-next-line no-param-reassign
    discount.signature = await wallet.signMessage(messageHashBytes);
    return discount;
  })
).then((discounts) => {
  fs.writeFile(
    "discounts.json",
    JSON.stringify(discounts),
    (err) => {
      // eslint-disable-next-line no-unused-expressions
      err ? console.log(err) : "";
    }
  );
});
