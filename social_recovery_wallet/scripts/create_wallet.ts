const ENTRYPOINT_ADDRESS_V06 = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

// https://github.com/safe-global/safe-modules-deployments/blob/main/src/assets/safe-4337-module/v0.2.0/add-modules-lib.json#L8
const ADD_MODULE_LIB_ADDRESS = '0x8EcD4ec46D4D2a6B64fE960B3D64e8B94B2234eb'

// https://github.com/safe-global/safe-modules-deployments/blob/main/src/assets/safe-4337-module/v0.2.0/safe-4337-module.json#L8
const SAFE_4337_MODULE_ADDRESS = '0xa581c4A4DB7175302464fF3C06380BC3270b4037'

// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/safe_proxy_factory.json#L13
const SAFE_PROXY_FACTORY_ADDRESS = '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67'

// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/safe.json#L13
const SAFE_SINGLETON_ADDRESS = '0x41675C099F32341bf84BFc5382aF534df5C7461a'

// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/multi_send.json#L13
const SAFE_MULTISEND_ADDRESS = '0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526'



const PIMLICO_API_KEY = "6746c11c-bb61-46fc-81e5-800da9d39f1b"


import { bundlerActions, getAccountNonce } from 'permissionless'
import {
  pimlicoBundlerActions,
  pimlicoPaymasterActions
} from 'permissionless/actions/pimlico'
import {
  Address,
  Client,
  Hash,
  Hex,
  PrivateKeyAccount,
  createClient,
  createPublicClient,
  encodeFunctionData,
  http
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { gnosis } from 'viem/chains'
// getting private key object 


const PRIVATE_KEY = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709'

const signer = privateKeyToAccount(PRIVATE_KEY as Hash)

const rpcURL = 'https://rpc.ankr.com/gnosis'

const publicClient = createPublicClient({
  transport: http(rpcURL),
  chain: gnosis
})

const PIMLICO_API_V1 = `https://api.pimlico.io/v1/gnosis/rpc?apikey=${PIMLICO_API_KEY}`

const bundlerClient = createClient({
  transport: http(PIMLICO_API_V1),
  chain: gnosis
})
  .extend(bundlerActions(ENTRYPOINT_ADDRESS_V06))
  .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V06))

const PIMLICO_API_V2 = `https://api.pimlico.io/v2/gnosis/rpc?apikey=${PIMLICO_API_KEY}`

const pimlicoPaymasterClient = createClient({
  transport: http(PIMLICO_API_V2),
  chain: gnosis
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V06))


type UserOperation = {
  sender: Address
  nonce: bigint
  initCode: Hex
  callData: Hex
  callGasLimit: bigint
  verificationGasLimit: bigint
  preVerificationGas: bigint
  maxFeePerGas: bigint
  maxPriorityFeePerGas: bigint
  paymasterAndData: Hex
  signature: Hex
}

const saltNonce = 0n

const initCode = await getAccountInitCode({
  owner: signer.address,
  addModuleLibAddress: ADD_MODULE_LIB_ADDRESS,
  safe4337ModuleAddress: SAFE_4337_MODULE_ADDRESS,
  safeProxyFactoryAddress: SAFE_PROXY_FACTORY_ADDRESS,
  safeSingletonAddress: SAFE_SINGLETON_ADDRESS,
  saltNonce,
  multiSendAddress: SAFE_MULTISEND_ADDRESS,
  erc20TokenAddress: USDC_TOKEN_ADDRESS,
  paymasterAddress: ERC20_PAYMASTER_ADDRESS
})

const sender = await getAccountAddress({
  client: publicClient,
  owner: signer.address,
  addModuleLibAddress: ADD_MODULE_LIB_ADDRESS,
  safe4337ModuleAddress: SAFE_4337_MODULE_ADDRESS,
  safeProxyFactoryAddress: SAFE_PROXY_FACTORY_ADDRESS,
  safeSingletonAddress: SAFE_SINGLETON_ADDRESS,
  saltNonce,
  multiSendAddress: SAFE_MULTISEND_ADDRESS,
  erc20TokenAddress: USDC_TOKEN_ADDRESS,
  paymasterAddress: ERC20_PAYMASTER_ADDRESS
})

const contractCode = await publicClient.getBytecode({ address: sender })

const nonce = await getAccountNonce(publicClient as Client, {
  entryPoint: ENTRYPOINT_ADDRESS_V06,
  sender
})


const callData: `0x${string}` = encodeCallData({
  to: sender,
  data: '0x',
  value: 0n
})

const sponsoredUserOperation: UserOperation = {
  sender,
  nonce,
  initCode: contractCode ? '0x' : initCode,
  callData,
  callGasLimit: 1n, // All gas values will be filled by Estimation Response Data.
  verificationGasLimit: 1n,
  preVerificationGas: 1n,
  maxFeePerGas: 1n,
  maxPriorityFeePerGas: 1n,
  paymasterAndData: ERC20_PAYMASTER_ADDRESS,
  signature: '0x'
}