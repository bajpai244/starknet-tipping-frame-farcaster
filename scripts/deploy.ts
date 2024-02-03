import { Account, ec, json,  Provider, hash, CallData, RpcProvider, Contract } from "starknet";
import { config } from "dotenv";
import fs from "fs";
import { ETH_ADDRESS } from "./constants";
import { getOwnerAccount, getCasm, getSierra } from "./utils";

const main = async () =>
{
    config();

    const provider = new RpcProvider({nodeUrl: process.env.RPC_URL});
    const account = getOwnerAccount(provider);

    const ethContractClass = await provider.getClassAt(ETH_ADDRESS);
    const ethContract = new Contract(ethContractClass.abi, ETH_ADDRESS, provider);

    console.log("balance is", await ethContract.call("balanceOf", [account.address]));

// Declare & deploy Test contract in devnet
const compiledTestSierra = getSierra();
const casm = getCasm();

const deployResponse = await account.declareAndDeploy({ contract: compiledTestSierra, casm, constructorCalldata: [account.address]});

// Connect the new contract instance:
const myTestContract = new Contract(compiledTestSierra.abi, deployResponse.deploy.contract_address, provider);
console.log("Test Contract Class Hash =", deployResponse.declare.class_hash);
console.log('✅ Test Contract connected at =', myTestContract.address);

}

main()
