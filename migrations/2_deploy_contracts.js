var SimpleStorage = artifacts.require('./BouncerProxy.sol');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
