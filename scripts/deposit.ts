import { Account, ec, json, Provider, hash, CallData, RpcProvider, Contract, cairo } from "starknet";
import { getOwnerAccount, getContract, getSenderAccount } from "./utils";

const main = async () => {
    const provider = new RpcProvider({ nodeUrl: process.env.RPC_URL });
    const account = getSenderAccount(provider);
    let contract = getContract(account);

    const fId = 15355;
    const balance = await contract.get_balance(fId);
    console.log("balance is", balance);

    let call = contract.populate("deposit", {
        fid: fId,
        amount: cairo.uint256(10000)
    });

    const response = await contract.deposit(call.calldata);
    console.log("deposit response", response);
}

main();
