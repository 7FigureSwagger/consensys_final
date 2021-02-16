pragma solidity >=0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DumpEth.sol";

contract TestDumpEth {

    DumpEth dump = new DumpEth();

    // Test toggling state of circuit breaker
    function testToggleActive() public {
        // Toggle Active state
        dump.toggleActive();

        Assert.isTrue(dump.isActive(), "hmm...");
    }

    // funstion test
}
