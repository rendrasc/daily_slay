const projectId = "c4c3e0d4c90c191bdf83b8b8e0ea6f19";

const ethers = window.ethers;

let provider, signer;

document.getElementById("connectButton").onclick = async () => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
provider = new ethers.providers.Web3Provider(window.ethereum, "any"); // <== fix is here
signer = provider.getSigner();
      const address = await signer.getAddress();
      document.getElementById("walletAddress").textContent = `Connected: ${address}`;
    } else {
      alert("Please install MetaMask or another EVM wallet.");
    }
  } catch (e) {
    console.error("Connection failed", e);
  }
};

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
    status.innerText = `Sent! Tx Hash: ${tx.hash}`;
  } catch (err) {
    status.innerText = "Error: " + err.message;
  }
}


