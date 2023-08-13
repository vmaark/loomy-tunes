import { ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  ChangeEventHandler,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import truncateEthAddress from "truncate-eth-address";
import { Address, useAccount, useBalance, useEnsName, useNetwork } from "wagmi";

import { useAddTop100Tokens as useAddTop100Tokens } from "@/hooks/useAddTop100Tokens";
import { useBalanceValidation } from "@/hooks/useBalanceValidation";

import {
  weiToEth,
  weiToEthWithDecimals,
} from "@/components/accountpanel/helpers";
import Editable from "@/components/Editable";

import { TokenId, UIContext, UIDispatchContext } from "@/state/UIContext";

export const AccountLabel = ({ account }: { account: Address }) => {
  const { data } = useEnsName({
    address: account,
  });
  return <>{data ?? truncateEthAddress(account)}</>;
};

const Label: FC<{ label: string; address: Address }> = ({ label, address }) => {
  return (
    <Editable
      text={label}
      address={address}
      placeholder="Click to add a label"
    />
  );
};

export const AccountPanel: FC<{
  address: Address;
  label: string;
  tokens: Address[];
}> = ({ address, label, tokens }) => {
  const account = useAccount();
  useAddTop100Tokens(address);
  const isActive = address === account.address;
  const { chain } = useNetwork();
  const dispatch = useContext(UIDispatchContext);

  const gasTokenId: TokenId = `${chain?.id ?? 1}-gas-token`;

  return (
    <div className="flex w-56 min-w-fit max-w-md flex-col gap-2 bg-white p-4 first:rounded-l-md last:rounded-r-md">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <h3 className={isActive ? "text-green-500" : "text-gray-400"}>●</h3>
          <button
            onClick={() => {
              dispatch({ type: "select-address", address });
            }}
          >
            <AccountLabel account={address} />
          </button>
        </div>
        {/* <Label label={label} address={address} /> */}
      </div>
      <TokenComponent
        accountAddress={address}
        contractAddress={undefined}
        id={gasTokenId}
      />
      {tokens.map((token) => (
        <TokenComponent
          accountAddress={address}
          key={token}
          contractAddress={token}
          id={token}
        />
      ))}
    </div>
  );
};

const TokenComponent: FC<{
  accountAddress: Address;
  contractAddress: Address | undefined;
  id: TokenId;
}> = ({ accountAddress, contractAddress, id }) => {
  const dispatch = useContext(UIDispatchContext);
  const [sendTokenAmount, setSendTokenAmount] = useState<`${number}`>("0");
  const handleSendTokenInput: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setSendTokenAmount(e.target.value as `${number}`);
      },
      [setSendTokenAmount],
    );

  const { chain } = useNetwork();
  const balanceQuery = useBalance({
    token: contractAddress,
    address: accountAddress,
    chainId: chain?.id,
    watch: true,
  });
  const balance = balanceQuery.data?.value ?? 0n;
  const symbol = balanceQuery.data?.symbol ?? "ETH";
  const decimals = balanceQuery.data?.decimals ?? 18;
  const balanceFormatted =
    balanceQuery.data != null
      ? weiToEthWithDecimals(balance, decimals, 6)
      : "0";

  useEffect(() => {});
  const { validationMessage } = useBalanceValidation(
    sendTokenAmount,
    balance,
    decimals,
    contractAddress ?? `${chain?.id ?? 1}-gas-token`,
  );

  return (
    <div>
      <div className="flex w-full justify-between">
        <button
          onClick={() => {
            dispatch({ type: "select-token", address: contractAddress });
          }}
        >
          <span>{symbol}</span>
        </button>
        <span>{balanceFormatted}</span>
      </div>
    </div>
  );
};
