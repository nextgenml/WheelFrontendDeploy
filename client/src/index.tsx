import React from "react";
import "./index.css";
import App from "./App";
import { WagmiConfig } from "wagmi";
import { Web3Modal } from "@web3modal/react";
import { chains, client, walletConnectProjectId } from "./wagmi";
import "@fontsource/audiowide";
import { EthereumClient } from "@web3modal/ethereum";
import { BrowserRouter } from "react-router-dom";
import { render } from "react-dom";

const ethereumClient = new EthereumClient(client, chains);

render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiConfig client={client}>
        <App />
        <Web3Modal
          projectId={walletConnectProjectId}
          ethereumClient={ethereumClient}
        />
      </WagmiConfig>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
