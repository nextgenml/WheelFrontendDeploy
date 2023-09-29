import { useSignMessage } from "wagmi";
import { useEthersSigner } from "../../Utils/signer";
import { useEffect } from "react";
import {
  arbitrum,
  goerli,
  localhost,
  mainnet,
  polygon,
  polygonMumbai,
} from "wagmi/chains";
import { ethers } from "ethers";

export default function HomePage1() {
  const { signer, provider } = useEthersSigner({ chainId: mainnet });

  const x = async () => {
    const data = ethers.utils.toUtf8Bytes("some txt message");

    const addr = await signer.getAddress();
    const sig = await provider.send("personal_sign", [
      ethers.utils.hexlify(data),
      addr.toLowerCase(),
    ]);
    alert("sig", sig);
  };
  return (
    <div>
      <button onClick={x}>Sign message</button>
      {/* {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>} */}
    </div>
  );
}
