pragma solidity >=0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DumpEth.sol";

contract TestDumpEth {

    function testIsActive() public {
        DumpEth dumpEth = DumpEth(DeployedAddresses.DumpEth());
        bool stopped;

        stopped = false;

        dumpEth.toggleActive();

        Assert.isTrue(stopped, "hmm...");
    }

    // funstion test
}
