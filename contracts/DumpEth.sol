// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

contract DumpEth {
    // Balance 'state' of the contract
    // Mapping to store user balance, restricted to private calls, contract does not talk to other contracts
    mapping(address => uint256) private balance;

    // Hold the owner of the contract in state
    address private owner;

    // State for circuit breaker
    bool private stopped;


    // Set the owner to the creator of this contract
    constructor() {
        owner = msg.sender;
    }

    // Events to emit for user deposit to contract and withdrawal
    event LogDepositMade(address accountAddress, uint256 amount);
    event LogWithdrawalMade(address accountAddress, uint256 amount);

    // Event to emit when ETH received without calldata
    event Received(address sender, uint256 value);

    // Fallback function in case tx is sent without ether or calls function that does not exist
    fallback() external payable {revert();}

    // Fallback 'receive' funciton to collect ETH sent with empty calldata
    receive() external payable { emit Received(msg.sender, msg.value);}

    // Ensure caller is admin of contract
    modifier isAdmin() {
        require(msg.sender == owner, "Access denied! Admin only!");
        _;
    }

    // Ensure contract is not stopped before proceding
    modifier emergencyStop() {
        require(!stopped, "Circuit breaker flipped, access denied!");
        _;
    }
    modifier onlyAfterStopped() {
        require(stopped, "Only accessible in emergency shutdown!");
        _;
    }

    // Check balance before allowing withdrawal
    modifier goodBalance(address _sender, uint _request) {
        require(
            balance[_sender] >= _request,
            "Deposited balance insufficient!"
        );
        _;
    }

    // Function for stopping contract
    function toggleActive() public isAdmin {
        stopped = !stopped;
    }

    // Function to deposit to contract
    function deposit() public payable emergencyStop {
        // Only allow the 'deployer' of the contract to deposit
        {
            require(msg.value > 0, 'No Ether sent.');
            emit LogDepositMade(address(msg.sender), msg.value);
            balance[msg.sender] = balance[msg.sender] += msg.value;
        }
    }

    // Function to withdraw from contract
    function withdraw(uint256 _amount)
        public
        // Only allow the 'deployer' of the contract to withdraw, checks balance
        goodBalance(msg.sender, _amount)
        isAdmin
        emergencyStop
    {
        {
            // Withdraw Ether to senders address if balance is good and is admin
            emit LogWithdrawalMade(address(msg.sender), _amount);
            balance[msg.sender] = balance[msg.sender] -= _amount;
            address payable x = msg.sender;
            x.transfer(_amount);
        }
    }

    // Emergency withdrawal, after circuit breaker flipped
    function emergencyWithdrawal()
        private
        goodBalance(msg.sender, balance[msg.sender])
        isAdmin
        onlyAfterStopped
    {
        {
            uint256 amt = balance[msg.sender];
            emit LogWithdrawalMade(address(msg.sender), amt);
            address payable x = msg.sender;
            balance[msg.sender] = 0;
            x.transfer(amt); // Withdraw total balance stored in contract, last operation for re-entrancy protection
        }
    }

    // Function to check balance of contract
    function getContractBalance() public view returns (uint256) 
    {
        return address(this).balance;
    }
}
