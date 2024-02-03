use starknet::ContractAddress;

#[starknet::interface]
trait ITip<TContractState> {
    fn deposit(ref self: TContractState, fid: felt252, amount: u256);
    fn tip(ref self: TContractState, from_fid: felt252, to_fid: felt252, amount: u256);
    fn get_balance(self: @TContractState, fid: felt252) -> u256;
    fn get_owner(self: @TContractState) -> ContractAddress;
}

#[starknet::contract]
mod Tip {
    use core::box::BoxTrait;
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use starknet::{ContractAddress, get_tx_info, get_caller_address, get_contract_address};
    use tipping::interfaces::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[storage]
    struct Storage {
        // fid : amount
        balance: LegacyMap<felt252, u256>,
        owner: ContractAddress
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
    }

    #[abi(embed_v0)]
    impl TipImpl of super::ITip<ContractState> {
        fn deposit(ref self: ContractState, fid: felt252, amount: u256) {
        let contract_address = get_contract_address();

            let caller_address = get_caller_address();
            let eth_address: ContractAddress =
                0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
                .try_into()
                .unwrap();

            IERC20Dispatcher { contract_address: eth_address }
                .transfer_from(caller_address, contract_address, amount);

            self.balance.write(fid, amount);
        }

        fn tip(ref self: ContractState, from_fid: felt252, to_fid: felt252, amount: u256) {
            let caller_address = get_caller_address();
            assert(caller_address == self.owner.read(), 'Only owner can tip');

            let from_balance = self.balance.read(from_fid);
            assert(from_balance >= amount, 'Insufficient balance');

            let to_balance = self.balance.read(to_fid);
            self.balance.write(to_fid, to_balance + amount);
            self.balance.write(from_fid, from_balance - amount);
        }

        fn get_balance(self: @ContractState, fid: felt252) -> u256 {
            self.balance.read(fid)
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }
    }
}
