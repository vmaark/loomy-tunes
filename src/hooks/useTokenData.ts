import { Address } from 'viem';
import { useToken } from 'wagmi';

export const useTokenData = (address: Address | undefined) => {
  const { data, isError, error, isSuccess, isFetching } = useToken({ address });

  return {
    data,
    error,
    isError,
    isSuccess,
    isFetching,
  };
};
