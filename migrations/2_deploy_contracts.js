var BouncerProxy = artifacts.require('./BouncerProxy.sol');
var SimpleStorage = artifacts.require('./SimpleStorage.sol');

const serverAccount = '0xfd9C0d0Dc50C1d0a0304eBB65a9f23da9693Ce1d';

// change this to your Metamask address, or whatever
const adminAddress = '0x863afa452f38966b54cb1149d934e34670d0683a';

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);

  deployer.deploy(BouncerProxy, serverAccount, adminAddress);
};
