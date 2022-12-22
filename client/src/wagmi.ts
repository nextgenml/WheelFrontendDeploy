import { modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'

export const walletConnectProjectId = 'ba7804e457fbb5f1375cbdc14e679617'

const { chains, provider, webSocketProvider } = configureChains(
  //[mainnet, ...(process.env.NODE_ENV === 'development' ? [goerli] : [])],
  [goerli, ...(process.env.NODE_ENV === 'development' ? [goerli] : [])],
  [walletConnectProvider({ projectId: walletConnectProjectId })],
)

export const client = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'My wagmi + Web3Modal App', chains }),
  provider,
  webSocketProvider,
})

export { chains }
// Uncaught (in promise) Error: invalid address or ENS name (argument="name", value=undefined, code=INVALID_ARGUMENT, version=contracts/5.7.0)
//     at e.value (index.ts:269:28)
//     at e.value (index.ts:281:20)
//     at e.value (index.ts:285:21)
//     at index.ts:123:16
//     at d (regeneratorRuntime.js:44:17)
//     at Generator.<anonymous> (regeneratorRuntime.js:125:22)
//     at Generator.next (regeneratorRuntime.js:69:21)
//     at a (Utilities.jsx:85:1)