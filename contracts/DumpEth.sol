// SPDX-License-Identifier: MIT
pragma solidity >=0.5;

contract DumpEth {
    // Balance 'state' of the contract
    // Mapping to store user balance, restricted to private calls, contract does not talk to other contracts
    mapping(address => uint256) private balance;

    // Hold the owner of the contract in state
    address private owner;

    // State for circuit breaker
    bool private stopped;

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
    modifier goodBalance(address _sender) {
        require(
            balance[_sender] >= msg.value,
            "Deposited balance insufficient!"
        );
        _;
    }

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
    fallback() external payable {
        revert();
    }

    // Fallback 'receive' funciton to collect ETH sent with empty calldata
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    // Function for stopping contract
    function toggleActive() public isAdmin {
        stopped = !stopped;
    }

    // Function to deposit to contract
    function deposit() public payable isAdmin emergencyStop returns (uint256) {
        // Only allow the 'deployer' of the contract to deposit
        {
            balance[msg.sender] = balance[msg.sender] += msg.value;
            emit LogDepositMade(address(msg.sender), msg.value);
            require(address(this).send(msg.value));
            return balance[msg.sender];
        }
    }

    // Function to withdraw from contract
    function withdraw(uint256 _amount)
        private
        // Only allow the 'deployer' of the contract to withdraw, checks balance
        goodBalance(msg.sender)
        isAdmin
        emergencyStop
        returns (uint256)
    {
        {
            balance[msg.sender] = balance[msg.sender] -= _amount;
            emit LogWithdrawalMade(address(msg.sender), _amount);
            require(msg.sender.send(address(this).balance)); // Withdraw Ether to senders address if balance is good and is admin
            return balance[msg.sender];
        }
    }

    // Emergency withdrawal, after circuit breaker flipped
    function emergencyWithdrawal()
        private
        goodBalance(msg.sender)
        isAdmin
        onlyAfterStopped
    {
        {
            uint256 amt = balance[msg.sender];
            balance[msg.sender] = 0;
            emit LogWithdrawalMade(address(msg.sender), amt);
            require(msg.sender.send(address(this).balance)); // Withdraw total balance stored in contract, last operation for re-entrancy protection
        }
    }

    // Function to check balance of contract
    function getContractBalance() private view returns (uint256) {
        return address(this).balance;
    }
}
