const ethers = window.ethers;

let provider, signer;

document.getElementById("connectButton").onclick = async () => {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").textContent = `Connected: ${address}`;
  } catch (e) {
    console.error("Connection failed", e);
  }
};

document.getElementById("networkSelector").onchange = async (e) => {
  const chainId = e.target.value;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
    });
  } catch (switchError) {
    // Jika chain belum ditambahkan
    if (switchError.code === 4902) {
      const networkParams = getAddChainParams(chainId);
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkParams],
      });
    } else {
      console.error(switchError);
    }
  }
};

function getAddChainParams(chainId) {
  const networks = {
    "10": {
      chainId: "0xa",
      chainName: "Optimism",
      rpcUrls: ["https://mainnet.optimism.io"],
      nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
      blockExplorerUrls: ["https://optimistic.etherscan.io"],
    },
    "8453": {
      chainId: "0x2105",
      chainName: "Base",
      rpcUrls: ["https://mainnet.base.org"],
      nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
      blockExplorerUrls: ["https://basescan.org"],
    },
    "1135": {
      chainId: "0x46f",
      chainName: "Lisk",
      rpcUrls: ["https://rpc.lisk.com"],
      nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
      blockExplorerUrls: ["https://explorer.lisk.com"],
    },
    "111000": {
      chainId: "0x1b258",
      chainName: "Soneium",
      rpcUrls: ["https://rpc.soneium.io"],
      nativeCurrency: { name: "SON", symbol: "SON", decimals: 18 },
      blockExplorerUrls: ["https://explorer.soneium.io"],
    },
    "20242024": {
      chainId: "0x13413d8",
      chainName: "Ink",
      rpcUrls: ["https://rpc.inkchain.io"],
      nativeCurrency: { name: "INK", symbol: "INK", decimals: 18 },
      blockExplorerUrls: ["https://explorer.inkchain.io"],
    },
  };
  return networks[chainId];
}

async function sendETH() {
  const status = document.getElementById("status");
  const amount = document.getElementById("amount").value;
  const recipient = "0x1E78A36F4BfF568E9Bc79c31b81F2b4cb58dBa35";

  if (!signer) {
    status.innerText = "Wallet not connected.";
    return;
  }

  try {
    const tx = await signer.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther(amount)
    });
    status.innerText = `✅ ETH sent! Tx Hash: ${tx.hash}`;
  } catch (err) {
    status.innerText = "❌ Error: " + err.message;
  }
}
