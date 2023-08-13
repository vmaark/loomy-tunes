// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  Alchemy,
  Network,
  TokenBalance,
  TokenBalanceType,
  TokenMetadataResponse,
} from 'alchemy-sdk';
import { BigNumber, constants } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function tokens(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? '',
    network: req.body.network ?? Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  const query = req.query;
  const { address } = query;
  const result = await alchemy.core.getTokenBalances(address as string, {
    type: TokenBalanceType.DEFAULT_TOKENS,
  });
  const nonZeroBalances = result.tokenBalances.filter((token) => {
    return !BigNumber.from(token.tokenBalance).eq(constants.Zero);
  });

  const balances: (TokenMetadataResponse & TokenBalance)[] = [];
  for (const token of nonZeroBalances) {
    try {
      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress
      );
      balances.push({
        ...token,
        ...metadata,
      });
    } catch (e) {
      // console.error(`Error getting response for ${token.contractAddress}`);
      // console.log(e);
    }
  }
  res.status(200).json(balances);
}
