import { formatUnits } from "viem";

export const weiToEthWithDecimals = (
  amount: string | bigint | null | undefined,
  tokenDecimals: number,
  numberOfDecimals: number,
): `${number}` => {
  if (amount == null) return "0";
  const str = weiToEth(amount, tokenDecimals);
  return withDecimals(str, numberOfDecimals);
};

export const withDecimals = (
  amount: `${number}`,
  numberOfDecimals: number,
): `${number}` => {
  if (amount.includes(".")) {
    const parts = amount.split(".");
    return (parts[0] +
      "." +
      parts[1].slice(0, numberOfDecimals)) as `${number}`;
  }
  return amount;
};

export const weiToEth = (
  amount: string | bigint,
  decimals: number,
): `${number}` => {
  return (formatUnits(BigInt(amount), decimals).toString() ??
    "0") as `${number}`;
};
