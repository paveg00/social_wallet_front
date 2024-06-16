import { Address, Hex, concatHex } from "viem"


export const getAccountInitCode = async ({
    owner,
    addModuleLibAddress,
    safe4337ModuleAddress,
    safeProxyFactoryAddress,
    safeSingletonAddress,
    saltNonce = 0n,
    multiSendAddress,
    erc20TokenAddress,
    paymasterAddress
  }: {
    owner: Address
    addModuleLibAddress: Address
    safe4337ModuleAddress: Address
    safeProxyFactoryAddress: Address
    safeSingletonAddress: Address
    saltNonce?: bigint
    multiSendAddress: Address
    erc20TokenAddress: Address
    paymasterAddress: Address
  }): Promise<Hex> => {
    if (!owner) throw new Error('Owner account not found')
  
    const initializer = await getInitializerCode({
      owner,
      addModuleLibAddress,
      safe4337ModuleAddress,
      multiSendAddress,
      erc20TokenAddress,
      paymasterAddress
    })
  
    const initCodeCallData = encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: '_singleton',
              type: 'address'
            },
            {
              internalType: 'bytes',
              name: 'initializer',
              type: 'bytes'
            },
            {
              internalType: 'uint256',
              name: 'saltNonce',
              type: 'uint256'
            },
          ],
          name: 'createProxyWithNonce',
          outputs: [
            {
              internalType: 'contract SafeProxy',
              name: 'proxy',
              type: 'address'
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createProxyWithNonce',
      args: [safeSingletonAddress, initializer, saltNonce]
    })
  
    return concatHex([safeProxyFactoryAddress, initCodeCallData])
  }
  