import 'dotenv/config'
import { ENTRYPOINT_ADDRESS_V06, createSmartAccountClient } from 'permissionless'
import { signerToSafeSmartAccount } from 'permissionless/accounts'
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from 'permissionless/clients/pimlico'
import { createPublicClient, http, Hex, encodeFunctionData, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { gnosis } from 'viem/chains'
import { Hash } from 'viem'


// Network
const chain = gnosis
const chainName = 'gnosis'
const SPONSORSHIP_POLICY_ID = '<insert_pimlico_sponsorship_policy_id>'

// Keys
// const PIMLICO_API_KEY = process.env.PIMLICO_API_KEY
// const PRIVATE_KEY = process.env.PRIVATE_KEY as Hex

const PRIVATE_KEY = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709'
const PIMLICO_API_KEY = "6746c11c-bb61-46fc-81e5-800da9d39f1b"


const signer = privateKeyToAccount(PRIVATE_KEY as Hash)

const publicClient = createPublicClient({
  transport: http(`https://rpc.ankr.com/${chainName}`)
})

const bundlerClient = createPimlicoBundlerClient({
  transport: http(`https://api.pimlico.io/v1/${chainName}/rpc?apikey=${PIMLICO_API_KEY}`),
  entryPoint: ENTRYPOINT_ADDRESS_V06
})


const paymasterClient = createPimlicoPaymasterClient({
  transport: http(`https://api.pimlico.io/v2/${chainName}/rpc?apikey=${PIMLICO_API_KEY}`),
  entryPoint: ENTRYPOINT_ADDRESS_V06
})

const gasPrices = await bundlerClient.getUserOperationGasPrice()

const safeAccount = await signerToSafeSmartAccount(publicClient, {
  entryPoint: ENTRYPOINT_ADDRESS_V06,
  signer: signer,
  // saltNonce: 0n, // Optional
  safeVersion: '1.4.1',
  // address: '0x...' // Optional. Only for existing Safe accounts.
})

const safeAccountClient = createSmartAccountClient({
  account: safeAccount,
  entryPoint: ENTRYPOINT_ADDRESS_V06,
  chain: chain,
  bundlerTransport: http(`https://api.pimlico.io/v1/${chainName}/rpc?apikey=${PIMLICO_API_KEY}`),
  middleware: {
    gasPrice: async () => (await bundlerClient.getUserOperationGasPrice()).fast,
    sponsorUserOperation: paymasterClient.sponsorUserOperation
  }
})

sponsorUserOperation: ({ userOperation }) => {
  return paymasterClient.sponsorUserOperation({
    userOperation,
    sponsorshipPolicyId: SPONSORSHIP_POLICY_ID
  })
}

// const txHash = await safeAccountClient.sendTransaction({
//   to: safeAccount.address,
//   value: parseEther('0'),
//   data: encodeFunctionData({
//     abi: '',
//     functionName: '',
//     args: []
//   }),
//   maxFeePerGas: gasPrices.fast.maxFeePerGas,
//   maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas
// })


