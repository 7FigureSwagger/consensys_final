pragma solidity >=0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DumpEth.sol";

contract TestDumpEth {

		uint public initialBalance = 1 ether;

		DumpEth dump = new DumpEth();


		// Test deposit function
		// function testGetContractBalance() public {
		// 		// Deposit some ether
		// 		address(dump).transfer(1000 wei);

		// 		Assert.equal(dump.getContractBalance(), 1000 wei, "Balance is not what was expected (0.5 ether)");
		// }


		// Test withdraw function
		function testWithdraw() public {
				address(dump).transfer(1000 wei);
				// Withdraw deposited ether
				dump.withdraw(1000 wei);
		
				Assert.equal(dump.getContractBalance(), 0 wei, "Balance is not what was expected (0.25 ether)");
				// Assert.equal(initialBalance == 0.75 ether, "Balance is not what was expected (0.75 ether)");
		}


		// Test toggling state of circuit breaker
		function testToggleActive() public {
				// Toggle Active state
				dump.toggleActive();

				Assert.isTrue(dump.isActive(), "hmm...");
		}
}
