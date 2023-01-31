import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { Button, Card, Carousel, InputNumber, List, Tabs } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useContractReader, useGasPrice, useSignerAddress } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { useTokenBalance } from 'eth-hooks/erc';
import { BigNumber, getDefaultProvider, Contract, providers, Wallet } from 'ethers';
import moment from 'moment';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { useMintingPrice } from '~~/components/common/hooks/MintingPrice';
import ContentLayout from '~~/components/main/layout/ContentLayout';
import { useAppContracts } from '~~/config/contractContext';
import { MysteryBoxToken } from '~~/generated/contract-types';

import {
  mysteriousAddress,
  mysteriousABI,
  NFTtier0Address,
  NFTtier0ABI,
  mystoryboxABI,
  mystoryboxAddress,
} from '~~/config/abi';

import '~~/styles/css/nft.css';

export interface NFTUIProps {
  mainnetProvider: StaticJsonRpcProvider | undefined;
  yourCurrentBalance: BigNumber | undefined;
  price: number;
}

export interface UserEntry {
  address: string;
  discountRate: number;
  signature: string;
}

// 2023/1/31
const provider = new providers.JsonRpcProvider('https://goerli.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad');

export const NFTUI: FC<NFTUIProps> = (props) => {
  const ethersContext = useEthersContext();
  const [errorMessage, setErrorMessage] = useState('');
  const [countDown, setCountDown] = useState('Loading');
  const [amount, setAmount] = useState(1);
  const [discountEntry, setDiscountEntry] = useState({} as UserEntry);
  const mysteryBoxToken = useAppContracts('MysteryBoxToken', ethersContext.chainId) as MysteryBoxToken;
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast');
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);
  const endingTime = useContractReader(mysteryBoxToken, mysteryBoxToken?.endingTime)[0];
  const saleOn = useContractReader(mysteryBoxToken, mysteryBoxToken?.saleOn)[0];
  const mintingPrice = useMintingPrice();
  const [address] = useSignerAddress(ethersContext.signer);
  const [balanceToken, ,] = useTokenBalance(mysteryBoxToken, address ?? '');

  const [mysteriousBalance, setMysteriousBalance] = useState(-1);
  const [mysteriousAllowance, setMysteriousAllowance] = useState(-1);
  const [mysterious, setMysterious] = useState<any>();
  const [NFTtier0, setNFTtier0] = useState<any>();

  useEffect(() => {
    async function _init(): Promise<void> {
      // TODO change this reading file, temporary fix, problem when building app
      const discountsResults = await fetch('../../discounts.json');
      const discounts: any = await discountsResults.json();
      if (discounts && address) {
        console.log('discounted user');
        const entry = discounts.filter((e: any) => e['address'] === address);
        setDiscountEntry(entry[0] as UserEntry);
      } else {
        console.log('not discounted user', address, discounts);
      }

      // 2023/1/31
      try {
        if (address && mysteriousBalance == -1 && mysteriousAllowance == -1) {
          // const mysterious = new Contract(mysteriousAddress, mysteriousABI, ethersContext.signer);
          const mysterious = new Contract(mystoryboxAddress, mystoryboxABI, ethersContext.signer);
          const NFTtier0 = new Contract(NFTtier0Address, NFTtier0ABI, ethersContext.signer);

          const balance = await mysterious.balanceOf(address);
          const allowance = await mysterious.allowance(address, NFTtier0Address);

          setMysterious(mysterious);
          setNFTtier0(NFTtier0);
          setMysteriousBalance(balance.toNumber());
          setMysteriousAllowance(allowance.toNumber());
        }
      } catch (e) {
        console.log('get balance error', e);
      }
    }

    if (address) {
      void _init();
    }
  }, [address]);
  useInterval(() => {
    // if (!saleOn) {
    //   setCountDown('Open mystery box');
    // } else if (endingTime!.toString() === '0') {
    //   setCountDown('Open mystery box');
    // } else if (endingTime) {
    //   const _countdown = moment.utc(moment.unix(endingTime.toNumber()).diff(moment())).format('HH:mm:ss') + ' s';
    //   setCountDown(_countdown);
    // }
    setCountDown('Open mystery box');
  }, 1000);

  const mint = (): void => {
    console.log(saleOn);
    setErrorMessage('');
    if (discountEntry && Object.keys(discountEntry).length > 0) {
      const userEntry = discountEntry;
      const result = tx?.(
        mysteryBoxToken?.mintDiscount(userEntry['discountRate'], userEntry['signature'], {
          value: mintingPrice,
        }),
        (update) => {
          if (update && (update.status === 'confirmed' || update.status === 1)) {
            console.log(` Minting discounted 🍾 Transaction ${update.hash} finished!`);
          }
          if (update && update.error) {
            console.log(update);
            const message: string = update.error.message;
            setErrorMessage(message);
          }
        }
      );
    } else {
      const finalPrice = mintingPrice!.mul(BigNumber.from(amount));
      const result = tx?.(
        mysteryBoxToken?.mint(amount, {
          value: finalPrice,
        }),
        (update) => {
          if (update && (update.status === 'confirmed' || update.status === 1)) {
            console.log(` Minting 🍾 Transaction ${update.hash} finished!`);
          }
          if (update && update.status !== 'confirmed') {
            console.log(update);
          }
        }
      );
    }
  };

  const reveal = async (): Promise<void> => {
    if (!address) {
      alert('Please login first');
      return;
    }

    try {
      if (mysteriousAllowance < mysteriousBalance) {
        await mysterious.approve(NFTtier0Address, BigNumber.from(mysteriousBalance));
        alert('Approve success!');
        top?.location.reload();
      } else {
        if (amount > mysteriousBalance) {
          alert(amount + '>' + mysteriousBalance);
          return;
        }

        await NFTtier0.claim(address, BigNumber.from(amount));
        console.log('Reveal success!');
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  };

  const isMintingPossible = (): boolean => {
    let possible = false;
    if (saleOn) {
      possible = true;
    }
    return possible;
  };

  const renderNFTs = (): any => {
    const numberOfTokens: number = balanceToken.toNumber();
    const nftsData: any[] = Array.from(new Array(8), (x, i) =>
      i < numberOfTokens ? { title: 'Your NFT', src: 'mystery.gif' } : { title: ' ', src: 'nonft.png' }
    );
    return (
      <List
        grid={{
          gutter: 50,
          xs: 2,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={nftsData}
        renderItem={(item: any): any => (
          <List.Item>
            <Card title={item.title} cover={<img alt="your nft" src={item.src} />}></Card>
          </List.Item>
        )}
      />
    );
  };

  const renderBackground = (): any[] => {
    const content = [];
    const numberOfSlides: number = 11;
    for (let i = 1; i <= numberOfSlides; i++) {
      content.push(
        <div>
          <img src={`nft/${i}.png`} />
        </div>
      );
    }
    return content;
  };

  return (
    <ContentLayout className={'nft-page'}>
      <Tabs defaultActiveKey="1" centered>
        <Tabs.TabPane tab="REVEAL D/NFT" key="1" style={{}}>
          <div style={{ position: 'relative' }}>
            <div className={'divrelative'}>
              <div className="inner">
                <p></p>
              </div>
              <div className={'nft-foot'}>
                <img src={'nft-front-foot.gif'} />
              </div>
            </div>
            {/* <Carousel className="nft-carousel" effect={'fade'} autoplay style={{ position: 'relative' }}>
              {renderBackground()}
            </Carousel> */}
            <div
              style={{
                minHeight: '1000px',
                position: 'relative',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(/nft/bg.jpg)',
                backgroundPosition: 'top',
                backgroundSize: 'cover',
              }}></div>
            <div className={'minting-divs'}>
              <div className={'minting-countdown'}>{countDown}</div>
              <div className={'minting-div'}>
                <div className={'minting-header'}>
                  {/* <div className={'ether-price'}>
                    {mintingPrice ? (+formatEther(mintingPrice.toString())).toFixed(2) : 'Loading'}
                    <span> ETH</span>
                  </div>
                  <div className={'dollar-price'}>
                    {mintingPrice
                      ? '$' + (parseFloat(formatEther(mintingPrice.toString())) * props.price).toFixed(2)
                      : 'Loading'}
                  </div> */}
                  {mysteriousAllowance !== 0 ? (
                    <div className={'ether-price'}>
                      {mysteriousAllowance > -1 ? mysteriousAllowance : 'Loading'}
                      <span> mystery box</span>
                    </div>
                  ) : (
                    <div className={'ether-price'}>available</div>
                  )}
                  <div className={'dollar-price'}>{mysteriousBalance > -1 ? mysteriousBalance : 'Loading'}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <InputNumber
                    style={{ textAlign: 'center', width: '200px' }}
                    min={1}
                    addonBefore={'Quantity'}
                    defaultValue={1}
                    onChange={(value): void => setAmount(value)}
                    controls
                    autoFocus
                  />
                </div>
                {/* <div className={'minting-footer'}>
                  <Button disabled={!isMintingPossible()} onClick={(): void => mint()} className={'debond-btn'}>
                    MINT NOW
                  </Button>
                </div> */}
                <div className={'minting-footer'}>
                  <Button
                    disabled={
                      !address ||
                      (mysteriousAllowance == 0 && mysteriousBalance == 0) ||
                      mysteriousAllowance == -1 ||
                      mysteriousBalance == -1
                    }
                    onClick={reveal}
                    className={'debond-btn'}>
                    {address && mysteriousAllowance < mysteriousBalance ? 'APPROVE NOW' : 'REVEAL NOW'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="MY D/NFTs" key="2" style={{ padding: '0 50px 0 50px' }}>
          {renderNFTs()}
        </Tabs.TabPane>
      </Tabs>
    </ContentLayout>
  );
};
