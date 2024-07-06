import { useMemo } from "react";
import { providers } from "ethers";
import { Client, Transport, Chain, Account } from "viem";
import { useAccount, useConnectorClient, Config } from "wagmi";

export function useConnect() {
  const { chainId } = useAccount();

  function clientToSigner(client: Client<Transport, Chain, Account>) {
    const { account, chain, transport } = client;
    const network = {
      chainId: chainId!,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return signer;
  }

  function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: client } = useConnectorClient<Config>({ chainId });
    return useMemo(
      () => (client ? clientToSigner(client) : undefined),
      [client]
    );
  }

  return {
    useEthersSigner
  }
}
