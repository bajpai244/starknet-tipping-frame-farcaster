import { Account, Contract, RpcProvider } from "starknet";
import fs from "fs";
import { TIP_ADDRESS } from "./constants";

export const getOwnerAccount = (provider: RpcProvider) => {
    const privateKey = process.env.PRIVATE_KEY;
    const accountAddress = process.env.ACCOUNT_ADDRESS;

    const account = new Account(provider, accountAddress, privateKey);
    return account;
}

export const getSenderAccount = (provider: RpcProvider) => {
    const privateKey = process.env.PRIVATE_KEY_SENDER;
    const accountAddress = process.env.ACCOUNT_ADDRESS_SENDER;

    const account = new Account(provider, accountAddress, privateKey);
    return account;
}

export const getContract = (account: Account) => {
    const sierra = getSierra();
    const contract = new Contract(sierra.abi, TIP_ADDRESS, account);
    return contract;
}

export const getSierra = () => {
    const compiledTestSierra = JSON.parse(fs.readFileSync("./build/tipping_Tip.contract_class.json").toString("ascii"));
    return compiledTestSierra
}

export const getCasm = () => {
    const casm = JSON.parse(fs.readFileSync("./build/tipping_Tip.compiled_contract_class.json").toString("ascii"));
    return casm
}
