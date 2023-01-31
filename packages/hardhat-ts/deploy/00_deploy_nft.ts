import * as fs from 'fs';

import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export interface IEntry {
  address: string;
  discountRate: number;
  signature: string;
}

const sign = async (deployer: Signer, contractAddress: string, userAddress: string, discountRate: number): Promise<string> => {
  const messageHash = ethers.utils.solidityKeccak256(['address', 'address', 'uint256'], [contractAddress, userAddress, discountRate]);
  const messageHashBytes = ethers.utils.arrayify(messageHash);
  return await deployer.signMessage(messageHashBytes);
};

const discountGenerator = async (deployer: Signer, contractAddress: string): Promise<IEntry[]> => {
  const entries: IEntry[] = [
    {
      address: '0xd59276C2A56B19b678c4D22e3eeE148F5a816c37',
      discountRate: 10,
      signature: '',
    },
  ];
  const completedEntries: IEntry[] = await Promise.all(
    entries.map(async (e) => {
      e.signature = await sign(deployer, contractAddress, e.address, e.discountRate);
      return e;
    })
  );
  return completedEntries;
};

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log('nft');
  console.log(deployer);

  await deploy('MysteryBoxToken', {
    from: deployer,
    args: ['MysteryBox', 'MBOX', 43002000],
    log: true,
  });
  const deployedContract = await ethers.getContract('MysteryBoxToken', deployer);

  await deployedContract.setSaleOn();

  const [signer] = await hre.ethers.getSigners();
  const entries = await discountGenerator(signer, deployedContract.address);
  console.log(entries);
  console.log(JSON.stringify(entries));
  fs.writeFileSync('../vite-app-ts/public/discounts.json', JSON.stringify(entries));
};
export default func;
func.tags = ['MysteryBox'];
