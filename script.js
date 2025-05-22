// Replace with your actual WalletConnect Cloud Project ID (free at cloud.walletconnect.com)
const projectId = "YOUR_PROJECT_ID";

// Supported EVM chains (incl. L2s)
const chains = [
  { id: 1, name: "Ethereum" },
  { id: 10, name: "Optimism" },
  { id: 59144, name: "Soneium" },
  { id: 111, name: "Lisk" },
  { id: 8453, name: "Base" },
  { id: 999, name: "Ink" }
];

const metadata = {
  name: "ETH Support UI",
  description: "Send ETH to support",
  url: "https://rendrasc.github.io/daily_slay",
  icons: ["images/logo.svg"]
};

const { Web3Modal } = window.web3modal;
const { EthereumClient, w3mConnectors, w3mProvider } = window.web3modal;
const { configureChains, createConfig, WagmiConfig } = window.wagmi;

const ethers = window.ethers;

const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

const modal = new Web3Modal({
  projectId,
  themeMode: "light",
  walletConnectVersion: 2,
  metadata
});

document.getElementById("connectButton").onclick = async () => {
  try {
    const accounts = await modal.connect();
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").textContent = `Connected: ${address}`;
  } catch (e) {
    console.error("Wallet connect failed", e);
  }
};

async function sendETH() {
  const status = document.getElementById("status");
  const amount = document.getElementById("amount").value;
  const recipient = "0xYourRecipientAddressHere"; // Replace this

  if (!signer) {
    status.innerText = "Wallet not connected.";
    return;
  }

  try {
    const tx = await signer.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther(amount)
    });
    status.innerText = `Sent! Tx Hash: ${tx.hash}`;
  } catch (err) {
    status.innerText = "Error: " + err.message;
  }
}

