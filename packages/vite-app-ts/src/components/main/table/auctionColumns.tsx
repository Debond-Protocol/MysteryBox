import { Button } from 'antd';
import moment from 'moment';
import React from 'react';

export interface ITableColumnsProps {
  selectedColumnsName: string[];
  bid: any;
}

/**
 * Function to get auction columns for antd tables
 */
export const getColumns = (bid: any): Map<string, any> => {
  const columns = new Map<string, any>();
  columns.set('issuanceDate', {
    title: 'Issuance',
    dataIndex: 'issuanceDate',
    key: 'issuanceDate',
    render: (input: number) => {
      return moment.unix(input).format('HH:mm DD/MM/YYYY');
    },
  });
  columns.set('endDate', {
    title: 'End',
    dataIndex: 'endDate',
    key: 'endDate',
    render: (input: { issuanceDate: number; duration: number }) => {
      // console.log(input)
      const endDate = input.issuanceDate + input.duration;
      return moment.unix(endDate).format('HH:mm DD/MM/YYYY');
    },
  });

  columns.set('initialPrice', { title: 'Initial Price', dataIndex: 'initialPrice', key: 'initialPrice' });
  columns.set('minimumPrice', { title: 'Minimum Price', dataIndex: 'minimumPrice', key: 'minimumPrice' });
  columns.set('bid', {
    title: 'Bid',
    dataIndex: 'bid',
    key: 'bid',
    render: (input: any) => {
      return (
        <Button
          onClick={(): void => {
            bid(input.id);
          }}>
          Bid
        </Button>
      );
    },
  });

  columns.set('faceValue', {
    title: 'Face Value',
    dataIndex: 'faceValue',
    key: 'faceValue',
  });
  return columns;
};

/**
 * Function to filter the tokens in the table
 */
const onFilter = (value: any, record: any): boolean => {
  return record.token === value;
};

/**
 * Get auctions columns for antd tables
 * @param props: functions and parameters necessary for table columns
 */
export const getAuctionColumns = (props: ITableColumnsProps): any => {
  const { selectedColumnsName, bid } = props;
  const width = `${100 / selectedColumnsName.length}%`;

  const columns = getColumns(bid);
  /*  console.log(columns)
    console.log(selectedColumnsName);
    console.log(columns.get("faceValue"))
    console.log(columns.get("initialPrice"))*/
  const selectedColumns = selectedColumnsName.map((name): any => {
    /*    console.log(name)
        console.log(columns.get(name))*/
    const col = columns.get(name);
    col.width = width;
    return col;
  });
  // console.log(selectedColumns)

  return { tableColumns: selectedColumns };
};
