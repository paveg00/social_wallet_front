import { ethers } from "ethers";

// Define constants

// keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
// '0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f';
const DOMAIN_SEPARATOR_TYPEHASH = ethers.utils.id('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')
const START_RECOVERY_TYPEHASH = ethers.utils.id("startRecovery(address account,bytes newOwner,uint256 nonce)");

// Define the domainSeparator function
function domainSeparator(recoveryModuleAddress) {
    const chainId = getChainId(); // Get the chain ID
    console.log('Recovery Module', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Recovery Module')))

    // Compute domain separator
    const separator = 
    ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            [
                'bytes32', 'bytes32', 'bytes32', 'uint256', 'address'
            ],
            [
                DOMAIN_SEPARATOR_TYPEHASH,
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Recovery Module')),
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes('0.0.1')),
                chainId,
                recoveryModuleAddress
            ]
        )
    );

    console.log('separator', separator)

    return separator;
}

const defaultRequest = {
    wallet: '0xd93ff84Ee9dcAA98236736eAF32180ABb894C832',
    ownerAddr: '0xFc32402667182d11B29fab5c5e323e80483e7800',
    newOwner: '0x25A71a07cecf1753ee65b00E0a3AAEf7e0F51c0F',
    prevOwner: '0x0000000000000000000000000000000000000001',
    recoveryModule: { address: '0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f' },
  }
// example props: defaultRequest
function GetSocialRecoveryDigest(props) {
    console.log("GetSocialRecoveryDigest", props.prevOwner)
    let ABI = [
        "function swapOwner(address prevOwner, address oldOwner, address newOwner)"
    ];
    
    let iface = new ethers.utils.Interface(ABI);
    const data = iface.encodeFunctionData("swapOwner", [ props.prevOwner, props.ownerAddr, props.newOwner ])
    console.log("data", data)
    // 0xe318b52b0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fc32402667182d11b29fab5c5e323e80483e780000000000000000000000000025a71a07cecf1753ee65b00e0a3aaef7e0f51c0f
    // 0xe318b52b0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fc32402667182d11b29fab5c5e323e80483e780000000000000000000000000025a71a07cecf1753ee65b00e0a3aaef7e0f51c0f

    // Compute digest
    const walletRecoveryNonce = getWalletRecoveryNonce(props.wallet, props.recoveryModule); // Get the wallet recovery nonce

    const payload = ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'address', 'bytes', 'uint256'],
        [START_RECOVERY_TYPEHASH, props.wallet, data, walletRecoveryNonce + 1]
    );

    console.log("payload", payload)
    // 0xc8c90f0f3e107683360009b67ae75c1b8f7d7b2196e96fdfa5a3a50edaa945f7000000000000000000000000d93ff84ee9dcaa98236736eaf32180abb894c832000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064e318b52b0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fc32402667182d11b29fab5c5e323e80483e780000000000000000000000000025a71a07cecf1753ee65b00e0a3aaef7e0f51c0f00000000000000000000000000000000000000000000000000000000
    // 0xc8c90f0f3e107683360009b67ae75c1b8f7d7b2196e96fdfa5a3a50edaa945f7000000000000000000000000d93ff84ee9dcaa98236736eaf32180abb894c832000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064e318b52b0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fc32402667182d11b29fab5c5e323e80483e780000000000000000000000000025a71a07cecf1753ee65b00e0a3aaef7e0f51c0f00000000000000000000000000000000000000000000000000000000
    const domainSeparatorHash = domainSeparator(props.recoveryModule.address); // Get the domain separator hash

    const digest = 
    ethers.utils.keccak256(
        ethers.utils.solidityPack(
            ['bytes2', 'bytes32', 'bytes32'],
            [ethers.utils.toUtf8Bytes('\x19\x01'), domainSeparatorHash, ethers.utils.keccak256(payload)]
        )
    );
    console.log("digest", digest)
    // 0x63dfa87f4a1f2fff99c2f5a8a33e78fd5eecd473abe37935b932f49a913e5451
    // 0x63dfa87f4a1f2fff99c2f5a8a33e78fd5eecd473abe37935b932f49a913e5451
    // let digest
    return digest;
}


function getChainId() {
    return 31337
}

function getWalletRecoveryNonce(account, recoveryModule) {
    return 0
}

// Example usage
// const account = '0xd93ff84Ee9dcAA98236736eAF32180ABb894C832'; // Set the address of the account
// const ownerAddr = '0xFc32402667182d11B29fab5c5e323e80483e7800'; // Set the address of the owner
// const newOwner = '0x25A71a07cecf1753ee65b00E0a3AAEf7e0F51c0F'; // Set the address of the new owner
// const prevOwner = '0x0000000000000000000000000000000000000001'; // Set the address of the new owner
// const recoveryModule = { address: '0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f' }; // Set the recovery module address


function GetSocialRecoveryDigest1() {
    return GetSocialRecoveryDigest(defaultRequest)
}

export default GetSocialRecoveryDigest
