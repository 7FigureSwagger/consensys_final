var DumpEth = artifacts.require("../contracts/DumpEth.sol");

module.exports = function(deployer) {
  deployer.deploy(DumpEth);
};
