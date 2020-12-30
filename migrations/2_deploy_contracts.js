var DumpEth = artifacts.require("./DumpEth.sol");

module.exports = function(deployer) {
  deployer.deploy(DumpEth);
};
