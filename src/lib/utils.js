const toHex = (number) => `0x${Number(number).toString(16)}`;

const toDecimalsValue = (amount, decimals) =>
  (amount * 10 ** decimals).toLocaleString("fullwide", { useGrouping: false });
const utils = {
  toHex,
  toDecimalsValue,
};

export default utils;
