const ethers = require('ethers');


async function main() {
// Set up a provider and a wallet
const provider = new ethers.providers.JsonRpcProvider('your-provider-url');
const wallet = new ethers.Wallet('0x-yourprivatekey', provider); 


const immutableCreate2FactoryAddress = '0x0000000000FFe8B47B3e2130213B802212439497'; // the address is the same on both mainnet and goerli

const factoryABI =  [
    {
      "constant": true,
      "inputs": [
        {
          "name": "deploymentAddress",
          "type": "address"
        }
      ],
      "name": "hasBeenDeployed",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "salt",
          "type": "bytes32"
        },
        {
          "name": "initializationCode",
          "type": "bytes"
        }
      ],
      "name": "safeCreate2",
      "outputs": [
        {
          "name": "deploymentAddress",
          "type": "address"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "salt",
          "type": "bytes32"
        },
        {
          "name": "initCode",
          "type": "bytes"
        }
      ],
      "name": "findCreate2Address",
      "outputs": [
        {
          "name": "deploymentAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "salt",
          "type": "bytes32"
        },
        {
          "name": "initCodeHash",
          "type": "bytes32"
        }
      ],
      "name": "findCreate2AddressViaHash",
      "outputs": [
        {
          "name": "deploymentAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]; 

// Connect to the ImmutableCreate2Factory contract
const factory = new ethers.Contract(immutableCreate2FactoryAddress, factoryABI, wallet);

// Get the contract's bytecode
const huffBytecode = 'your contracts bytecode'; // replace with the bytecode of your compiled contract
const bytecodeWithPrefix = '0x' + huffBytecode;

// Decide on a salt
const saltPrefix = ethers.utils.hexZeroPad(wallet.address, 20);
const randomSaltSuffix = ethers.utils.hexZeroPad(ethers.utils.randomBytes(12), 12);
const salt = ethers.utils.hexConcat([saltPrefix, randomSaltSuffix]);

// Prepare and encode constructor arguments if any
//const encodedArguments = ethers.utils.defaultAbiCoder.encode(
//  ['type1', 'type2'], // replace with the types of your constructor arguments
//  [arg1, arg2]        // replace with your constructor arguments
// );

// Deploy the Huff contract
await factory.safeCreate2(salt, bytecodeWithPrefix);

// Compute the address
const computedAddress = ethers.utils.getCreate2Address(
  immutableCreate2FactoryAddress,
  salt,
  ethers.utils.keccak256(bytecodeWithPrefix)
);

console.log(`Huff contract will be deployed at address: ${computedAddress}`);

}

main().catch(console.error);