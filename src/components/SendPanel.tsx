import {
  ChangeEventHandler,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button, Input, Chip } from "@material-tailwind/react";
import { UIContext } from "@/state/UIContext";
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { weiToEthWithDecimals } from "./accountpanel/helpers";
import { isZero, useBalanceValidation } from "@/hooks/useBalanceValidation";
import { AccountLabel } from "./accountpanel/AccountPanel";
import ClientOnly from "./ClientOnly";
import { formatEther, parseEther } from "viem";

export const SendPanel: FC = () => {
  const state = useContext(UIContext);
  const { address } = useAccount();
  const selectedSymbol =
    state.selectedToken == null
      ? "ETH"
      : state.erc20s.find((a) => a.address === state.selectedToken)?.symbol;

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
    token: state.selectedToken,
    address,
    chainId: chain?.id,
    watch: true,
  });
  const balance = balanceQuery.data?.value ?? 0n;
  const decimals = balanceQuery.data?.decimals ?? 18;
  const balanceFormatted =
    balanceQuery.data != null
      ? weiToEthWithDecimals(balance, decimals, 6)
      : "0";

  const { validationMessage } = useBalanceValidation(
    sendTokenAmount,
    balance,
    decimals,
    state.selectedToken ?? `${chain?.id ?? 1}-gas-token`,
  );

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
    abi: erc20ABI,
    functionName: "transfer",
    args: [state.selectedAddress!, parseEther(sendTokenAmount)],
  });

  return (
    <div className="flex flex-col gap-2 p-5 mb-5 rounded-md bg-gray-700 items-center text-white">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          <label>{address != null && <AccountLabel account={address} />}</label>
          <div className="flex w-72 flex-col gap-2">
            <Input
              color="white"
              size="md"
              label="Amount"
              icon={<label className="text-white">{selectedSymbol}</label>}
              onChange={handleSendTokenInput}
              value={sendTokenAmount}
            />
            <div>
              <label>{`Balance: ${balanceFormatted}`}</label>
              <Button
                variant="text"
                color="white"
                onClick={() => setSendTokenAmount(balanceFormatted)}
              >
                Max
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label>
            {state.selectedAddress != null ? (
              <AccountLabel account={state.selectedAddress} />
            ) : (
              "select and address"
            )}
          </label>
          <div className="flex w-72 flex-col gap-2">
            <Input
              readOnly
              color="white"
              size="md"
              value="0.023"
              label="Balance"
              icon={<label className="text-white">{selectedSymbol}</label>}
            />
          </div>
        </div>
      </div>
      <Button
        className="w-24 bg-[#00FF80] text-[#333333]"
        disabled={
          validationMessage != null ||
          isZero(sendTokenAmount, decimals) ||
          isLoading
        }
        onClick={() => write()}
      >
        Send
      </Button>
      {validationMessage && <Chip color="red" value={validationMessage} />}
    </div>
  );
};
