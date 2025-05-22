let provider;
let signer;

const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const walletIcon = document.getElementById('walletIcon');
const walletAddressText = document.getElementById('walletAddress');
const status = document.getElementById('status');

connectButton.onclick = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();

    walletAddressText.innerText = `Wallet: ${address.slice(0, 6)}...${address.slice(-4)}`;
    walletIcon.style.display = "inline";
    disconnectButton.style.display = "inline";
    connectButton.style.display = "none";
  } else {
    alert("Please install MetaMask!");
  }
};

disconnectButton.onclick = () => {
  walletAddressText.innerText = "Not connected";
  walletIcon.style.display = "none";
  disconnectButton.style.display = "none";
  connectButton.style.display = "inline";
  provider = null;
  signer = null;
};

document.getElementById('sendButton').onclick = async () => {
  const amount = document.getElementById('amount').value.trim();
  const chainId = parseInt(document.getElementById('networkSelector').value);
  status.innerText = "";

  if (!signer || !provider) {
    status.innerText = "❌ Wallet not connected.";
    return;
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    status.innerText = "❌ Please enter a valid amount.";
    return;
  }

  try {
    // Switch network
    await provider.send("wallet_switchEthereumChain", [{
      chainId: "0x" + chainId.toString(16)
    }]);

    // Send transaction
    const tx = await signer.sendTransaction({
      to: "0x1E78A36F4BfF568E9Bc79c31b81F2b4cb58dBa35",
      value: ethers.utils.parseEther(amount)
    });

    status.innerText = "✅ Transaction sent: " + tx.hash;
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Error: " + err.message;
  }
};
