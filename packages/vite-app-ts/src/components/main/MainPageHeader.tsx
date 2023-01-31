import { GlobalOutlined } from '@ant-design/icons/lib';
import { getNetwork } from '@ethersproject/networks';
import { Alert, Menu, Modal } from 'antd';
import { useGasPrice } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import React, { FC, ReactElement, useState } from 'react';

import { WalletConnector } from '~~/components/common/walletConnector/WalletConnector';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { getNetworkInfo } from '~~/functions';

// displays a page header
export interface IMainPageHeaderProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
}

/**
 * ✏ Header: Edit the header and change the title to your project name.  Your account is on the right *
 * @param props
 * @returns
 */
export const MainPageHeader: FC<IMainPageHeaderProps> = (props) => {
  const ethersContext = useEthersContext();
  const selectedChainId = ethersContext.chainId;

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast', getNetworkInfo(ethersContext.chainId));
  const [collapsed, setCollapsed]: any[] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (): void => {
    setIsModalVisible(true);
  };

  const handleOk = (): void => {
    setIsModalVisible(false);
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  /**
   * this shows the page header and other informaiton
   */
  const left = (
    <>
      <div className={'logoDiv'}>
        <a href={'/'}>
          <img src="./logo.png" />
        </a>
      </div>
      {props.children}
    </>
  );

  /**
   * display the current network on the top left
   */
  let networkDisplay: ReactElement | undefined;
  if (selectedChainId && selectedChainId !== props.scaffoldAppProviders.targetNetwork.chainId) {
    const description = (
      <div>
        You have <b>{getNetwork(selectedChainId)?.name}</b> selected and you need to be on{' '}
        <b>{getNetwork(props.scaffoldAppProviders.targetNetwork)?.name ?? 'UNKNOWN'}</b>.
      </div>
    );
    networkDisplay = (
      <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 90, padding: 16 }}>
        <Alert message="⚠️ Wrong Network" description={description} type="error" closable={false} />
      </div>
    );
  } else {
    networkDisplay = (
      <Menu id="networkConnection" mode="inline" style={{ zIndex: 10 }} inlineCollapsed={collapsed}>
        <Menu.SubMenu
          style={
            {
              // color: props.scaffoldAppProviders.targetNetwork.color,
            }
          }
          icon={<GlobalOutlined />}
          key="sub0"
          title={<span>{props.scaffoldAppProviders.targetNetwork.name}</span>}>
          <Menu.Item key="0">{props.scaffoldAppProviders.targetNetwork.name}</Menu.Item>
        </Menu.SubMenu>
      </Menu>
    );
  }

  /**
   * 👨‍💼 Your account is in the top right with a wallet at connect options
   */
  const right = (
    <>
      <Modal onCancel={handleCancel} footer={null} className="burger-modal" visible={isModalVisible}>
        <>
          <WalletConnector
            createLoginConnector={props.scaffoldAppProviders.createLoginConnector}
            ensProvider={props.scaffoldAppProviders.mainnetAdaptor?.provider}
            price={props.price}
            blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
            hasContextConnect={true}
          />
          <div id={'burger-network'}> {networkDisplay}</div>
        </>
      </Modal>
      <div id={'burger-menu'} onClick={showModal}>
        <img src={'burger.png'} />
      </div>
      <div
        className={'leftWallet'}
        style={{
          display: 'flex',
          position: 'fixed',
          textAlign: 'right',
          right: '20px',
          top: '40px',
          padding: 10,
          zIndex: 1,
        }}>
        <WalletConnector
          createLoginConnector={props.scaffoldAppProviders.createLoginConnector}
          ensProvider={props.scaffoldAppProviders.mainnetAdaptor?.provider}
          price={props.price}
          blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
          hasContextConnect={true}
        />

        {props.children}
      </div>
    </>
  );

  return (
    <div className={'dheader'}>
      <div id={'network'}> {networkDisplay}</div>
      {left}
      {right}
    </div>
  );
};
