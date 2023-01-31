import { apys, ratings } from '~~/components/main/table/utils';

/**
 * Map the global classes map to table row values
 */
export const mapClassesToRow = (classes: any): any[] => {
  const _filters: any[] = [];
  const _values: any[] = [];
  const classesMap = new Map<string, any>();

  let idx = 0;
  for (const [_classId, _class] of classes) {
    const classInfos = {
      key: _classId,
      id: _classId,
      token: _class.token,
      interestType: _class.interestType,
      period: _class.period,
      deposit: { classId: _classId },
      typePeriod: {
        interestRateType: _class.interestType,
        period: _class.period,
      },
      // mocked
      issuer: 'debond',
      apy: apys[idx % apys.length],
      rating: ratings[idx % ratings.length],
      value: { apy: apys[idx % apys.length] },
      maturityCountdown: _class.maturityDate,
    };
    classesMap.set(_classId as string, classInfos);
    _values.push(classInfos);

    _filters.push({ text: _class.token, value: _class.token });
    idx += 1;
  }
  return [classesMap, _filters];
};

/**
 * Map the global auctions map to table row values
 */
export const mapAuctionToRow = (auctions: any): any[] => {
  const _filters: any[] = [];
  const _values: any[] = [];
  const auctionsMap = new Map<string, any>();
  // console.log(auctions);
  let idx = 0;
  for (const [_auctionId, auction] of auctions) {
    // console.log(auction);
    const infos = {
      key: _auctionId,
      id: _auctionId,
      initialPrice: auction.initialPrice.toString(),
      minimumPrice: auction.minimumPrice.toString(),
      period: auction.duration.toString(),
      faceValue: auction.faceValue.toString(),
      issuanceDate: auction.issuanceTimestamp.toNumber(),
      endDate: { issuanceDate: auction.issuanceTimestamp.toNumber(), duration: auction.duration.toNumber() },

      bid: { id: _auctionId },
    };
    auctionsMap.set(_auctionId as string, infos);
    _values.push(infos);
    idx += 1;
  }
  // console.log(auctionsMap)
  return [auctionsMap, _filters];
};
