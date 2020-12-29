// SPDX-License-Identifier: MIT
pragma solidity >=0.5;

contract DumpEth {
    // Balance 'state' of the contract
    // Mapping to store user balance
		mapping (address => uint) private balance;

		// Hold the owner of the contract in state
		address public owner;

		constructor(){
				// Set the owner to the creator of this contract
				owner = msg.sender;
		}

    // Events to emit for user deposit to contract and withdrawal
    event LogDepositMade(address accountAddress, uint256 amount);

    event LogWithdrawalMade(address accountAddress, uint256 amount);


		// Function to deposit to contract
		function deposit(uint _amount) public payable returns(uint)
		{
			emit LogDepositMade(address(msg.sender), _amount);
			return _amount;
		}

		// Function to withdraw from contract
		function withdraw(uint _amount) private returns(uint)
		{
			emit LogWithdrawalMade(address(msg.sender), _amount);
			return _amount;
		}

		// Function to check balance of contract
		function getContractBalance() private view returns(uint)
		{
			return address(this).balance;
		}
}
