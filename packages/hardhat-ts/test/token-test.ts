import { Contract } from '@ethersproject/contracts';
import { expect } from 'chai';
import { Signer, Wallet } from 'ethers';
import { ethers } from 'hardhat';

describe('testing mystery box token ', function () {
  let contractAddress: string;
  let mysteryBoxToken: Contract;
  const discountRate = 10;
  let owner: Signer;
  let user: Signer;
  let addrs;
  before(async function () {
    const mysteryBoxTokenFactory = await ethers.getContractFactory('MysteryBoxToken');
    [owner, user, ...addrs] = await ethers.getSigners();
    mysteryBoxToken = await mysteryBoxTokenFactory.deploy('MysteryBox', 'MBOX', 432000);
    contractAddress = mysteryBoxToken.address;
  });

  it('Should verify signature on chain', async function () {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'address', 'uint256'], [contractAddress, await user.getAddress(), discountRate]);
    const messageHashBytes = ethers.utils.arrayify(messageHash);
    const signature = await owner.signMessage(messageHashBytes);
    const recover = await mysteryBoxToken.connect(user).verifySignature(discountRate, signature);
    expect(recover).to.equal(await owner.getAddress());
  });
});
