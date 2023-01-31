export const interestRatesEnum: Map<string, string> = new Map([
  ['0', 'Fixed'],
  ['1', 'Variable'],
]);

export const issuerMap: Map<string, any> = new Map<string, any>([['debond', 'debond']]);

/**
 * Convert array of any to array of strings
 * @param arr: array to parse, each element should have tostring method
 */
export const toStringArray = (arr: any[]): string[] => {
  const array: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    array.push(arr[i].toString() as string);
  }
  return array;
};

export const numberFormatter = (item: number): string => item.toExponential(0);

// mocked
export const apys = [0.05, 0.03, 0.08, 0.03, 0.04, 0.02, 0.1];
export const ratings = ['AAA', 'AA', 'AAA', 'A', 'AAA', 'A'];
