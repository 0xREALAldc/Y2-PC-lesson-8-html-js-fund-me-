import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
connectButton.onclick = connect
fundButton.onclick = fund

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    connectButton.innerHTML = "Connected"
  } else {
    fundButton.innerHTML = "Please install metamask"
  }
}

async function fund() {
  const ethAmount = '77'

  // alert(`Funding with ${ethAmount}`)
  if (typeof window.ethereum !== 'undefined') {
    // find the http endpoint in the metamask and make the one that we use 
    // to send our transactions
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    // this line will return the wallet that's connected to the provider (metamask)
    const signer = provider.getSigner()

    // now we need our contract and ABI
    const contract = new ethers.Contract(contractAddress, abi, signer)

    // now we can run transactions just as we did before in our other projects
    const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })
  } 
}