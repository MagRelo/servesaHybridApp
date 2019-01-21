var BouncerProxy = artifacts.require('./BouncerProxy.sol');
var SimpleStorage = artifacts.require('./SimpleStorage.sol');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);

  deployer.deploy(BouncerProxy);
};
