import { Account, ec, json, Provider, hash, CallData, RpcProvider, Contract, cairo } from "starknet";
import { getOwnerAccount, getContract, getSenderAccount } from "./utils";

const main = async () => {
    const provider = new RpcProvider({ nodeUrl: process.env.RPC_URL });
    const account = getOwnerAccount(provider);
    let contract = getContract(account);

    const from_fid = 5;
    const to_fid = 1;

    let call = contract.populate("tip", {
        from_fid,
        to_fid,
        amount: cairo.uint256(10)
    });

    const response = await contract.tip(call.calldata);
    console.log("deposit response", response);
}

main();
