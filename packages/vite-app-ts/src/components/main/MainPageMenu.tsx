import { Menu } from 'antd';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export interface IMainPageMenuProps {
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}

export const MainPageMenu: FC<IMainPageMenuProps> = (props) => (
  <Menu
    style={{
      textAlign: 'center',
    }}
    selectedKeys={[props.route]}
    mode="vertical">
    <Menu.Item key="/" icon={<img src={'./menu/nft.png'} />}>
      <Link
        onClick={(): void => {
          props.setRoute('/');
        }}
        to="/">
        NFT
      </Link>
    </Menu.Item>
  </Menu>
);
