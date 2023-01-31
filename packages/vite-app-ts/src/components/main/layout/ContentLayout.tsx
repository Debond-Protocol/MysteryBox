import { Layout } from 'antd';
import React from 'react';

function ContentLayout({ title, description, children }: any): any {
  return (
    <>
      <Layout.Header>
        <div className={'pageInfos'}>
          <div className={'pageTitle'}>{title}</div>
          <div className={'pageDescription'}>{description}</div>
        </div>
      </Layout.Header>
      <main>{children}</main>
    </>
  );
}

export default ContentLayout;
