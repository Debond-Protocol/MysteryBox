import { BigNumber } from 'ethers';

export interface IAuction {
  auctionId?: BigNumber;
  seller: string | undefined;
  faceValue: BigNumber;
  issuanceTimestamp?: BigNumber;
  duration: BigNumber;
  bondAddress?: string;
  maximumPrice?: BigNumber;
  minimumPrice: BigNumber;
  winner?: string;
  initialPrice: BigNumber;
}
