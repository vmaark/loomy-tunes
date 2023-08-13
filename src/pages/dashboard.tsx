import { utils } from "ethers";
import {
  FC,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Address } from "viem";
import { useAccount, useNetwork } from "wagmi";

import { useTokenData } from "@/hooks/useTokenData";

import { AccountPanel } from "@/components/accountpanel/AccountPanel";
import ClientOnly from "@/components/ClientOnly";
import Layout from "@/components/layout/Layout";
import { Modal } from "@/components/Modal";
import {
  Button,
  Tabs,
  TabsHeader,
  Tab,
  TabPanel,
  TabsBody,
  Input,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

import { TokenId, UIContext, UIDispatchContext } from "@/state/UIContext";
import { SendPanel } from "@/components/SendPanel";

const isAddress = (address: string | undefined): address is Address => {
  return address != null && utils.isAddress(address);
};

export default function Dashboard() {
  const [mode, setMode] = useState<"transfer" | "browse">("browse");
  const { address } = useAccount();
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [addressInput, setAddressInput] = useState<string>("");
  const [labelInput, setLabelInput] = useState<string>("");
  const state = useContext(UIContext);
  const dispatch = useContext(UIDispatchContext);
  const { chain } = useNetwork();

  useEffect(() => {
    if (address != null) {
      dispatch({
        type: "add-address",
        address,
        label: "",
      });
    }
  }, [address, dispatch]);

  const addresses = Object.keys(state.addresses) as Address[];

  const onSubmit = () => {
    if (isAddress(addressInput)) {
      dispatch({
        type: "add-address",
        address: addressInput,
        label: labelInput,
      });
    }
    setLabelInput("");
    setAddressInput("");
  };

  const tokens = state.erc20s
    .filter((v) => v.chainId === chain?.id)
    .map((v) => v.address);

  return (
    <Layout>
      <main className="h-screen bg-[#F8F8F8] p-10">
        <section>
          <ClientOnly>
            <SendPanel />
            <Tabs value="send">
              <TabsHeader
                className="bg-transparent"
                indicatorProps={{
                  className: "bg-gray-900/10 shadow-none !text-gray-900",
                }}
              >
                <Tab key={"Send"} value={"send"}>
                  <Square3Stack3DIcon />
                  Send
                </Tab>
                <Tab key={"Stake"} value={"stake"}>
                  <Cog6ToothIcon />
                  Stake
                </Tab>
                <Tab key={"Swap"} value={"swap"}>
                  <UserCircleIcon />
                  Swap
                </Tab>
                <Tab key={"Lend"} value={"lend"}>
                  <UserCircleIcon />
                  Lend
                </Tab>
              </TabsHeader>
              <TabsBody>
                <TabPanel key={"Send"} value={"send"}>
                  <div className="flex flex-row overflow-hidden overflow-x-scroll divide-x-2">
                    {addresses.map((address) => (
                      <AccountPanel
                        key={address}
                        address={address}
                        label={state.addresses[address]}
                        tokens={tokens}
                      />
                    ))}
                  </div>
                </TabPanel>
                <TabPanel key={"Stake"} value={"stake"}>
                  <div className="flex flex-row overflow-hidden overflow-x-scroll divide-x-2">
                    {addresses.map((address) => (
                      <AccountPanel
                        key={address}
                        address={address}
                        label={state.addresses[address]}
                        tokens={tokens}
                      />
                    ))}
                  </div>
                </TabPanel>
                <TabPanel key={"Swap"} value={"swap"}>
                  <div className="flex flex-row overflow-hidden overflow-x-scroll divide-x-2">
                    {addresses.map((address) => (
                      <AccountPanel
                        key={address}
                        address={address}
                        label={state.addresses[address]}
                        tokens={tokens}
                      />
                    ))}
                  </div>
                </TabPanel>
                <TabPanel key={"Lend"} value={"lend"}>
                  <div className="flex flex-row overflow-hidden overflow-x-scroll divide-x-2">
                    {addresses.map((address) => (
                      <AccountPanel
                        key={address}
                        address={address}
                        label={state.addresses[address]}
                        tokens={tokens}
                      />
                    ))}
                  </div>
                </TabPanel>
              </TabsBody>
            </Tabs>
            <div className="flex flex-row gap-2">
              {/* <Button
                onClick={() => {
                  setShowWalletModal(true);
                }}
              >
                Add Wallet
              </Button> */}
              <Button
                onClick={() => {
                  setShowTokenModal(true);
                }}
              >
                Add Token
              </Button>
            </div>
          </ClientOnly>
          {showWalletModal && (
            <Modal
              onClose={() => {
                setShowWalletModal(false);
              }}
              onSubmit={() => {
                onSubmit();
                setShowWalletModal(false);
              }}
              title="Add Wallet"
              bodyText="Please an Ethereum address and a label to display it."
            >
              <input
                type="text"
                placeholder="0x..."
                onChange={(e) => setAddressInput(e.target.value)}
                value={addressInput}
              />
              <input
                type="text"
                placeholder="hot wallet"
                onChange={(e) => setLabelInput(e.target.value)}
                value={labelInput}
              />
            </Modal>
          )}
          <TokenModal show={showTokenModal} setShow={setShowTokenModal} />
        </section>
      </main>
    </Layout>
  );
}

const TokenModal: FC<{ show: boolean; setShow: (v: boolean) => void }> = ({
  show,
  setShow,
}) => {
  const { chain } = useNetwork();
  const dispatch = useContext(UIDispatchContext);
  const [contractAddress, setContractAddress] = useState<string>("");
  const { data, isError, error, isSuccess, isFetching } = useTokenData(
    contractAddress as Address,
  );
  if (chain == null) return null;

  return (
    <>
      {show && (
        <Modal
          onClose={() => {
            setShow(false);
          }}
          onSubmit={() => {
            if (isSuccess && isAddress(contractAddress) && data != null) {
              dispatch({
                type: "add-contract-erc20",
                contract: {
                  address: contractAddress,
                  chainId: chain.id,
                  symbol: data.symbol,
                },
              });
            }
            setShow(false);
          }}
          title="Add Token"
          bodyText="Provide an ERC20 contract address to add a token to your dashboard."
        >
          <input
            type="text"
            placeholder="0x..."
            onChange={(e) => setContractAddress(e.target.value)}
            value={contractAddress}
          />
          {isFetching && <h5>loading...</h5>}
          {isError && <h5>error: {error?.message}</h5>}
          {isSuccess && (
            <>
              <h5>name: {data?.name}</h5>
              <h5>symbol: {data?.symbol}</h5>
            </>
          )}
        </Modal>
      )}
    </>
  );
};
