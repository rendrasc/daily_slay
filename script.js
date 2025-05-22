let signer;

async function connectWallet() {
  const connectButton = document.getElementById("connectButton");
  const walletInfo = document.getElementById("walletInfo");
  const selector = document.getElementById("walletSelector");

  if (!window.ethereum || selector.value !== "metamask") {
    alert("Please install MetaMask or select a supported wallet.");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    const chainThemes = {
      10: 'optimism',     // Optimism
      59144: 'soneium',   // Soneium
      111: 'lisk',        // Lisk
      8453: 'base',       // Base
      999: 'ink'          // Ink (example chain ID)
    };

    const themeClass = chainThemes[network.chainId];
    const container = document.getElementById("appContainer");
    container.className = "container " + (themeClass || "");

    walletInfo.innerText = `Connected: ${address} (Chain ID: ${network.chainId})`;
    connectButton.disabled = true;
  } catch (error) {
    console.error(error);
    walletInfo.innerText = "Failed to connect wallet.";
  }
}

async function sendETH() {
  const amount = document.getElementById("amount").value;
  const status = document.getElementById("status");
  const recipient = "0xYourRecipientAddressHere"; // Replace with your address

  if (!signer) {
    status.innerText = "Please connect wallet first.";
    return;
  }

  try {
    const tx = await signer.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther(amount)
    });

    status.innerText = "Transaction sent! Hash: " + tx.hash;
  } catch (err) {
    console.error(err);
    status.innerText = "Transaction failed: " + err.message;
  }
}
