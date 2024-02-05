import { Account, ec, json, Provider, hash, CallData, RpcProvider, Contract, cairo } from "starknet";
import { getOwnerAccount, getContract, getSenderAccount } from "./utils";

const main = async () => {
    const provider = new RpcProvider({ nodeUrl: process.env.RPC_URL });
    const account = getOwnerAccount(provider);
    let contract = getContract(account);

    const fId = 15355;
    const balance = await contract.get_balance(fId);
    console.log("balance is", balance);

    let call = contract.populate("withdraw", {
        fid: fId,
        address: "0x06C6BD314BEE9948dFCC88785e5412c0cCB7AEB3722a2Ab057326531C695884e"
    });

    const response = await contract.withdraw(call.calldata);
    console.log("withdraw response", response);
}

main();
