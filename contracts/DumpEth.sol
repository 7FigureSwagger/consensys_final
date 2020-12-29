// SPDX-License-Identifier: MIT
pragma solidity >=0.5;

contract DumpEth {
    // Balance 'state' of the contract
    // Mapping to store user balance
    mapping(address => uint256) private balance;

    // Hold the owner of the contract in state
    address private owner;

		// State for circuit breaker
		bool private stopped;

		// Ensure caller is admin of contract
		modifier isAdmin(){
			require(msg.sender == owner);
			_;
		}

		// Ensure contract is not stopped before proceding
		modifier emergencyStop(){
			require(!stopped);
			_;
		}
		modifier onlyAfterStopped(){
			require(stopped);
			_;
		}

    constructor() {
        // Set the owner to the creator of this contract
        owner = msg.sender;
    }

    // Events to emit for user deposit to contract and withdrawal
    event LogDepositMade(address accountAddress, uint256 amount);
    event LogWithdrawalMade(address accountAddress, uint256 amount);

		// Event to emit when ETH received without calldata
		event Received(address sender, uint value);


    // Fallback function in case tx is sent without ether or calls function that does not exist
    fallback() external payable {
        revert();
    }

		// Fallback 'receive' funciton to collect ETH sent with empty calldata
		receive()
				external
				payable 
		{
				emit Received(msg.sender, msg.value);
		}

		// Function for stopping contract 
		function toggleActive() isAdmin public{
			stopped = !stopped;
		}

    // Function to deposit to contract
    function deposit() emergencyStop public payable returns (uint256) {
        // Only allow the 'deployer' of the contract to deposit
        require(address(msg.sender) == owner);
        {
            balance[msg.sender] = balance[msg.sender] += msg.value;
            emit LogDepositMade(address(msg.sender), msg.value);
            return balance[msg.sender];
        }
    }

    // Function to withdraw from contract
    function withdraw(uint _amount) emergencyStop private returns (uint256) 
		{
				// Only allow the 'deployer' of the contract to withdraw
				require(address(msg.sender) == owner && balance[msg.sender] >= _amount);
        {
						balance[msg.sender] = balance[msg.sender] -= _amount;
            emit LogWithdrawalMade(address(msg.sender), _amount);
            return balance[msg.sender];
        }
    }

		// Emergency withdrawal, after circuit breaker flipped
		function emergencyWithdrawal() onlyAfterStopped private
		{
			require(address(msg.sender) == owner && balance[msg.sender] > 0);
			{
					uint256 amt = balance[msg.sender];
					balance[msg.sender] = balance[msg.sender] -= balance[msg.sender];
					emit LogWithdrawalMade(address(msg.sender), amt);
			}
		}
    // Function to check balance of contract
    function getContractBalance() private view returns (uint256) {
        return address(this).balance;
    }
}
