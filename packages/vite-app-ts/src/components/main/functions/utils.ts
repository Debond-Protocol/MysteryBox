import dayjs from 'dayjs';

/**
 * Get data series for specified coin
 * @param startDate: start date
 * @param endDate: end date
 * @param currency: name of the currency
 * @param APIURL: url of the api
 */
const getCoinData = async (startDate: any, endDate: any, currency: string, APIURL: string): Promise<any> => {
  let coinData: any[] = [];
  let error;

  const startDateUnix = startDate.unix();
  const endDateUnix = endDate.unix();
  const range = `range?vs_currency=usd&from=${startDateUnix}&to=${endDateUnix}`;
  const url = `${APIURL}/coins/${currency}/market_chart/${range}`;
  try {
    const coinResponse = await fetch(url);
    const data = await coinResponse.json();
    coinData = data;
    error = false;
  } catch (e: any) {
    error = e;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return [coinData, error];
};

/**
 * Fetch all
 * @param currencies: array of currencies
 */
export const fetchCoins = async (currencies: string[]): Promise<Map<string, any>> => {
  const coinsMap = new Map<string, any>();

  const APIURL = 'https://api.coingecko.com/api/v3/';
  const endDate = dayjs();
  const startDate = dayjs(endDate).subtract(6, 'month');

  for (const currency of currencies) {
    const infos = await getCoinData(startDate, endDate, currency, APIURL);
    coinsMap.set(currency, infos[0]);
  }
  // console.log(coinsMap.get(currencies[0]))
  return coinsMap;
};

/**
 * Getting formatted data series
 * @param currencies: array of desired currencies
 * @param freqInDays: frequency in days
 */
export const getCoinSeries = async (currencies: string[], freqInDays: any): Promise<any> => {
  const coinsMap = await fetchCoins(currencies);
  const prices = [];
  const marketCaps: any = [];
  const totalVolumes: any = [];

  const numOfDays = coinsMap.get(currencies[0]).prices.length;

  for (let i = 0; i < numOfDays; i += freqInDays) {
    const _date = coinsMap.get(currencies[0]).prices[i][0] as string;
    const date = dayjs(_date).format('MM/DD/YYYY');
    const _prices: any = { date: date };
    const _marketCaps: any = { date: date };
    const _totalVolumes: any = { date: date };
    for (const currency of currencies) {
      _prices[currency] = coinsMap.get(currency).prices[i][1];
      _marketCaps[currency] = coinsMap.get(currency).market_caps[i][1];
      _totalVolumes[currency] = coinsMap.get(currency).total_volumes[i][1];
    }
    prices.push(_prices);
    marketCaps.push(_marketCaps);
    totalVolumes.push(_totalVolumes);
  }
  return { prices: prices, marketCaps: marketCaps, totalVolumes: totalVolumes };
};
