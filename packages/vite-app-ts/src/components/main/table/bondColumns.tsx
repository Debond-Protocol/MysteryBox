import { BigNumberish } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';
import { Button, Progress } from 'antd';
import moment from 'moment';
import React from 'react';

import { issuerMap } from '~~/components/main/table/utils';

export interface ITableColumnsProps {
  selectedColumnsName: string[];
  tokenFilters: any;
  redeem?: any;
  selectBondFunction?: any;
  faceValueFunction?: any;
}

const styles = {
  issuerImg: { width: 16 },
};

/**
 * Function to get bond columns for antd tables
 * @param redeem: redeem function
 */
export const getBondColumns = (redeem: any): any => {
  const columnsBond = new Map<string, any>();
  columnsBond.set('issuer', {
    title: 'Issuer',
    dataIndex: 'issuer',
    key: 'issuer',
    render: (_issuer: string) => {
      return (
        <span>
          <b>
            <img style={styles.issuerImg} src={`/issuer/${issuerMap.get(_issuer)}.png`} />
          </b>
        </span>
      );
    },
  });
  columnsBond.set('rating', { title: 'Rating', dataIndex: 'rating', key: 'rating' });
  columnsBond.set('token', { title: 'Token', dataIndex: 'symbol', key: 'token' });
  // columnsBond.set("amount", {title: 'Amount', dataIndex: 'balance', key: 'amount',})
  columnsBond.set('interest', { title: 'Interest Type', dataIndex: 'interestRateType', key: 'interest' });
  columnsBond.set('apy', { title: 'APY', dataIndex: 'apy', key: 'apy' });
  columnsBond.set('typePeriod', {
    title: 'Bond',
    dataIndex: 'typePeriod',
    key: 'typePeriod',
    render: (input: any) => {
      return `${input.interestRateType} (${moment.duration(input.period * 1000).humanize()})`;
    },
  });

  columnsBond.set('issuanceDate', {
    title: 'Issuance Date',
    dataIndex: 'issuanceDate',
    key: 'issuanceDate',
    render: (_date: any) => {
      const date = new Date(_date * 1000);
      return moment(date).format('DD-MM-YYYY hh:mm:ss');
    },
  });
  columnsBond.set('maturityCountdown', {
    title: 'Maturity in',
    dataIndex: 'maturityCountdown',
    key: 'maturityCountdown',

    render: (_maturity: any) => {
      const _maturityDate = moment(_maturity.toNumber() * 1000);
      return _maturityDate.fromNow();
    },
  });
  columnsBond.set('period', {
    title: 'Period',
    dataIndex: 'period',
    key: 'period',
    sorter: (a: any, b: any) => a.period - b.period,
  });
  columnsBond.set('progress', {
    title: 'Progress',
    dataIndex: 'progress',
    key: 'progress',
    render: (infos: any) => {
      return (
        <div>
          <Progress percent={infos.progress.toFixed(0)} showInfo={true} />
        </div>
      );
    },
  });
  columnsBond.set('redeem', {
    title: 'Redeem',
    dataIndex: 'redeem',
    key: 'redeem',
    render: (infos: any) => {
      // console.log(infos)
      return (
        <div>
          <Button
            disabled={!(parseFloat(infos.progress as string) >= 100)}
            onClick={(): void => {
              redeem(infos);
            }}>
            Redeem
          </Button>
        </div>
      );
    },
  });
  columnsBond.set('balance', {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    render: (_balance: BigNumberish) => {
      const exactBalance = formatEther(_balance);
      return (+exactBalance).toFixed(8);
    },
  });
  columnsBond.set('faceValue', {
    title: 'Face Value',
    dataIndex: 'value',
    key: 'facevalue',
  });
  columnsBond.set('selectBond', {
    title: 'Deposit',
    dataIndex: 'deposit',
    key: 'deposit',
  });
  return columnsBond;
};

/**
 * Get classes columns for antd tables
 * @param tokenFilters: filters for token
 * @param onFilter: on filter function
 * @param selectBondFunction: selecting bond function
 * @param faceValueFunction: function for the face value
 */
export const getClassColumns = (
  tokenFilters: any[],
  onFilter: any,
  selectBondFunction: any,
  faceValueFunction: any
): any => {
  const columns = new Map<string, any>();
  columns.set('token', {
    title: 'Asset',
    dataIndex: 'token',
    key: 'token',
    sorter: (a: any, b: any) => a.token.length - b.token.length,
    filters: tokenFilters,
    onFilter: onFilter,
  });
  columns.set('issuer', {
    title: 'Issuer',
    dataIndex: 'issuer',
    key: 'issuer',
    render: (_issuer: string) => {
      return (
        <span>
          <b>
            <img style={styles.issuerImg} src={`/issuer/${issuerMap.get(_issuer)}.png`} />
          </b>
        </span>
      );
    },
  });
  columns.set('progress', {
    title: 'Progress',
    dataIndex: 'progress',
    key: 'progress',
    render: (progress: any) => {
      // const progress= Math.min((Date.now() - infos.issuance)/infos.period*100,100)
      return (
        <div>
          <Progress percent={progress.toFixed(0)} showInfo={true} />
        </div>
      );
    },
  });
  columns.set('issuanceDate', { title: 'Issuance Date', dataIndex: 'issuanceDate', key: 'issuanceDate' });
  columns.set('interest', { title: 'Interest Type', dataIndex: 'interestType', key: 'interest' });
  columns.set('rating', { title: 'Rating', dataIndex: 'rating', key: 'rating' });
  columns.set('maturityCountdown', {
    title: 'Maturity in',
    dataIndex: 'maturityCountdown',
    key: 'maturityCountdown',
    render: (_maturity: any) => {
      const _maturityDate = moment(_maturity.toNumber() * 1000);
      return _maturityDate.fromNow();
    },
  });
  columns.set('period', {
    title: 'Period',
    dataIndex: 'period',
    key: 'period',
    sorter: (a: any, b: any) => a.period - b.period,
  });
  columns.set('redeem', { title: 'Redeem', dataIndex: 'redeem', key: 'redeem' });
  columns.set('balance', {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    render: (_balance: BigNumberish) => {
      const exactBalance = formatEther(_balance);
      return (+exactBalance).toFixed(8);
    },
  });
  columns.set('typePeriod', {
    title: 'Bond',
    dataIndex: 'typePeriod',
    key: 'typePeriod',
    render: (input: any) => {
      return `${input.interestRateType} (${moment.duration(input.period.toNumber() * 1000).humanize()})`;
    },
  });
  columns.set('apy', {
    title: 'APY',
    dataIndex: 'apy',
    key: 'apy',
    render: (apy: number) => {
      return `${apy * 100}%`;
    },
  });
  columns.set('selectBond', {
    title: 'Deposit',
    dataIndex: 'deposit',
    key: 'deposit',
    render: selectBondFunction,
  });
  columns.set('faceValue', {
    title: 'Face Value',
    dataIndex: 'value',
    key: 'facevalue',
    render: faceValueFunction,
  });
  return columns;
};

/**
 * Get classes and bonds columns for antd tables
 * @param props: functions and parameters necessary for table columns
 */
export const getTableColumns = (props: ITableColumnsProps): any => {
  const { selectedColumnsName, tokenFilters, redeem, selectBondFunction, faceValueFunction } = props;
  const width = `${100 / selectedColumnsName.length}%`;

  // width: string, tokenFilters: any, _functions:any
  /**
   * Function to filter the tokens in the table
   */
  const onFilter = (value: any, record: any): boolean => {
    return record.token === value;
  };

  const columns = getClassColumns(tokenFilters as any[], onFilter, selectBondFunction, faceValueFunction);
  const columnsBond = getBondColumns(redeem);

  const selectedClassColumns = selectedColumnsName.map((name): any => {
    const col = columns.get(name);
    col.width = width;
    return col;
  });
  const selectedNonceColumns = selectedColumnsName.map((name): any => {
    const col = columnsBond.get(name);
    col.width = width;
    return col;
  });

  return { classColumns: selectedClassColumns, bondColumns: selectedNonceColumns };
};
