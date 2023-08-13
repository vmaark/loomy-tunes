import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';

export const hasValue = (val: bigint | string): boolean => !!val;

export const isPositive = (val: `${number}`, decimals: number): boolean => {
  try {
    return hasValue(val) && parseUnits(val, decimals) > 0;
  } catch (_) {
    return false;
  }
};

export const isZero = (val: `${number}`, decimals: number): boolean => {
  try {
    return hasValue(val) && parseUnits(val, decimals) === 0n;
  } catch (_) {
    return false;
  }
};

export const isLargerThanMax = (
  val: `${number}`,
  max: bigint,
  decimals: number
): boolean => parseUnits(val, decimals) > max;

export const useBalanceValidation = (
  input: `${number}` | '',
  balance: bigint,
  decimals: number,
  extraDep?: string
) => {
  const [validationMessage, setValidationMessage] = useState<string>();

  useEffect(() => {
    if (input !== '') {
      const isPos = isPositive(input, decimals);
      const isLTMax = isLargerThanMax(input, balance, decimals);

      if (isZero(input, decimals)) {
        setValidationMessage(undefined);
      } else if (!isPos) {
        setValidationMessage('Please provide a valid amount');
      } else if (isLTMax) {
        setValidationMessage('Amount exceeds available balance');
      } else {
        setValidationMessage(undefined);
      }
    } else {
      setValidationMessage(undefined);
    }
  }, [input, balance, extraDep, decimals]);

  return { validationMessage };
};
