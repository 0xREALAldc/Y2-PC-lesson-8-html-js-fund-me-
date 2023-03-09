import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')
const balanceLabel = document.getElementById('balanceValue')
const withdrawButton = document.getElementById('withdrawButton')

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    connectButton.innerHTML = "Connected"
  } else {
    fundButton.innerHTML = "Please install metamask"
  }
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    balanceLabel.innerHTML = ethers.utils.formatEther(balance)
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}`)

  // alert(`Funding with ${ethAmount}`)
  if (typeof window.ethereum !== 'undefined') {
    // find the http endpoint in the metamask and make the one that we use 
    // to send our transactions
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    // this line will return the wallet that's connected to the provider (metamask)
    const signer = provider.getSigner()

    // now we need our contract and ABI
    const contract = new ethers.Contract(contractAddress, abi, signer)
    
    try {
      // now we can run transactions just as we did before in our other projects
      const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })

      // we wait for the transaction to finish
      await listenForTransactionMine(transactionResponse, provider)

      // update the balance 
      getBalance()
      console.log('done!')
    } catch (error) {
      console.error(error)
    }
  } 
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)

  return new Promise((resolve, reject) => {
    // listen for this transaction to finish
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)

      resolve()
    })
  })  
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    console.log('Withdrawing...')

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try{
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)

    } catch (error) {
      console.error(error)
    }
    
  }
}