import { ethers } from "ethers";
import { Buffer } from 'buffer';  // Import Buffer from buffer polyfill

function base64urlDecode(base64url) {
    // Replace URL-safe characters with base64 characters
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    // Pad with `=` to make the length a multiple of 4
    while (base64.length % 4) {
        base64 += '=';
    }
    return Buffer.from(base64, 'base64');
}

function GenerateContractData(idToken) {
    const idTokenSplit = idToken.split(".");
    if (idTokenSplit.length !== 3) {
        throw new Error("invalid id_token");
    }

    const header = base64urlDecode(idTokenSplit[0]);
    const payload = base64urlDecode(idTokenSplit[1]);
    const signature = base64urlDecode(idTokenSplit[2]);

    console.log("header:", header.toString('utf8'));
    console.log("payload:", payload.toString('utf8'));

    const fieldEndValue = Buffer.from('","');
    const objEndValue = Buffer.from('"}');

    const indexOfSubArray = (buffer, subArray, start = 0) => {
        const subArrayLength = subArray.length;
        for (let i = start; i <= buffer.length - subArrayLength; i++) {
            let match = true;
            for (let j = 0; j < subArrayLength; j++) {
                if (buffer[i + j] !== subArray[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return i;
            }
        }
        return -1;
    };

    const getLeftAndRightIndices = (buffer, key) => {
        const keyLeftIndex = indexOfSubArray(buffer, Buffer.from(`"${key}":"`)) + key.length + 4;
        const keyRightIndex = indexOfSubArray(buffer, fieldEndValue, keyLeftIndex) !== -1 
                              ? indexOfSubArray(buffer, fieldEndValue, keyLeftIndex) 
                              : indexOfSubArray(buffer, objEndValue, keyLeftIndex);
        return [keyLeftIndex, keyRightIndex];
    };
    // payload: {"iss":"https://accounts.google.com","azp":"892021943047-4uss7i965lcnhv9dvhjgd5btm3140b9o.apps.googleusercontent.com","aud":"892021943047-4uss7i965lcnhv9dvhjgd5btm3140b9o.apps.googleusercontent.com","sub":"109956066558145320273","at_hash":"Sjd2uIpYR8JEV8O6D7Q3gg","nonce":"0x63dfa87f4a1f2fff99c2f5a8a33e78fd5eecd473abe37935b932f49a913e5451","iat":1717443933,"exp":1717447533}
    const [issLeftIndex, issRightIndex] = getLeftAndRightIndices(payload, "iss");
    const [kidLeftIndex, kidRightIndex] = getLeftAndRightIndices(header, "kid");
    const iatLeftIndex = indexOfSubArray(payload, Buffer.from('"iat":')) + 6;
    const expLeftIndex = indexOfSubArray(payload, Buffer.from('"exp":')) + 6;
    const [subLeftIndex, subRightIndex] = getLeftAndRightIndices(payload, "sub");
    const [audLeftIndex, audRightIndex] = getLeftAndRightIndices(payload, "aud");
    const nonceLeftIndex = indexOfSubArray(payload, Buffer.from('"nonce":"')) + 9;

    const to0xHex = (buffer) => '0x' + buffer.slice(2).toString('hex');
    // 0x0000000800000023000000160000003e000000ce000000e30000007d000000c5000001110000015b0000016c0000004c7b22616c67223a225253323536222c226b6964223a2236373139363738333531613566616564633265373032373462626561363264613261386334613132222c22747970223a224a5754227d000001777b22697373223a2268747470733a2f2f6163636f756e74732e676f6f676c652e636f6d222c22617a70223a223839323032313934333034372d3475737337693936356c636e6876396476686a67643562746d3331343062396f2e617070732e676f6f676c6575736572636f6e74656e742e636f6d222c22617564223a223839323032313934333034372d3475737337693936356c636e6876396476686a67643562746d3331343062396f2e617070732e676f6f676c6575736572636f6e74656e742e636f6d222c22737562223a22313039393536303636353538313435333230323733222c2261745f68617368223a22536a64327549705952384a4556384f36443751336767222c226e6f6e6365223a22307836336466613837663461316632666666393963326635613861333365373866643565656364343733616265333739333562393332663439613931336535343531222c22696174223a313731373434333933332c22657870223a313731373434373533337d00000100556e4efa79cd8f3cfe39cc5886f0f7ec2751f186210934808ee59272912a3d331351991c318aee8d3fec71ebf106c0ea2274714d9b4f11ce9b5c46f5badb7888c61238288ed3776b43924554e267899ecd11a55e0737e74d205514ca88b371d039a6344ee70873c7e0c115c291842c80e9e5892eb549a0a0c985af9ef47394548165b02ca61c7c95ecb55ec5d9064d15de249ca44e508d28127caa941f153c5284fa03383b0b19ec75cab05526d4175af6d5cf756bf8aeada903857f201c63af0ae67bc1a58f6fa9374bff5456c0d6c6cb854e41fe0671b966f518be0cc65e3ef287ab3fa4b2dcff30b92eb50e49ff91bbd622e5b8c06ba21797f4ac9e425bcd
    // 0x0000000800000023000000160000003e000000ce000000e30000007d000000c5000001110000015b0000016c0000004c7b22616c67223a225253323536222c226b6964223a2236373139363738333531613566616564633265373032373462626561363264613261386334613132222c22747970223a224a5754227d000001777b22697373223a2268747470733a2f2f6163636f756e74732e676f6f676c652e636f6d222c22617a70223a223839323032313934333034372d3475737337693936356c636e6876396476686a67643562746d3331343062396f2e617070732e676f6f676c6575736572636f6e74656e742e636f6d222c22617564223a223839323032313934333034372d3475737337693936356c636e6876396476686a67643562746d3331343062396f2e617070732e676f6f676c6575736572636f6e74656e742e636f6d222c22737562223a22313039393536303636353538313435333230323733222c2261745f68617368223a22536a64327549705952384a4556384f36443751336767222c226e6f6e6365223a22307836336466613837663461316632666666393963326635613861333365373866643565656364343733616265333739333562393332663439613931336535343531222c22696174223a313731373434333933332c22657870223a313731373434373533337d00000100556e4efa79cd8f3cfe39cc5886f0f7ec2751f186210934808ee59272912a3d331351991c318aee8d3fec71ebf106c0ea2274714d9b4f11ce9b5c46f5badb7888c61238288ed3776b43924554e267899ecd11a55e0737e74d205514ca88b371d039a6344ee70873c7e0c115c291842c80e9e5892eb549a0a0c985af9ef47394548165b02ca61c7c95ecb55ec5d9064d15de249ca44e508d28127caa941f153c5284fa03383b0b19ec75cab05526d4175af6d5cf756bf8aeada903857f201c63af0ae67bc1a58f6fa9374bff5456c0d6c6cb854e41fe0671b966f518be0cc65e3ef287ab3fa4b2dcff30b92eb50e49ff91bbd622e5b8c06ba21797f4ac9e425bcd
    const data = ethers.utils.solidityPack(
        ["uint32", "uint32", "uint32", "uint32", "uint32", "uint32", "uint32", "uint32", "uint32", "uint32", "uint32", "uint32", "bytes", "uint32", "bytes", "uint32", "bytes"],
        [
            issLeftIndex, issRightIndex, 
            kidLeftIndex, kidRightIndex, 
            subLeftIndex, subRightIndex, 
            audLeftIndex, audRightIndex, 
            nonceLeftIndex, iatLeftIndex, expLeftIndex, 
            header.length, header, 
            payload.length, payload, 
            signature.length, signature
        ]
    );

    
    return to0xHex(data);
} 

export default GenerateContractData;