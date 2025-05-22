const ethers = window.ethers;

let provider, signer;

document.getElementById("connectButton").onclick = async () => {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(window.ethereum, "any"); // fix untuk dynamic network
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").textContent = `Connected: ${address}`;
  } catch (e) {
    console.error("Connection failed", e);
  }
};

async function sendETH() {
  const status = document.getElementById("status");
  const amount = document.getElementById("amount").value;
  const recipient = "0x1E78A36F4BfF568E9Bc79c31b81F2b4cb58dBa35"; // ✅ address tujuan

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



