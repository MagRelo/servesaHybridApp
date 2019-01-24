const BouncerProxy = artifacts.require('./BouncerProxy.sol');
const SimpleStorage = artifacts.require('./SimpleStorage.sol');

const { soliditySha3 } = require('web3-utils');

contract('BouncerProxy', accounts => {
  let [deployer, newBouncer, signingAccount] = accounts;

  it('should add account as a bouncer', async () => {
    const BouncerProxyInstance = await BouncerProxy.deployed();

    // add newBouncer to whitelist
    await BouncerProxyInstance.updateWhitelist(newBouncer, { from: deployer });

    // Get stored value
    const isWhiteListed = await BouncerProxyInstance.whitelist(newBouncer);

    assert.equal(isWhiteListed, true, 'Bouncer not added to whitelist.');
  });

  it('should forward the transaction to update SimpleStorage ', async () => {
    const BouncerProxyInstance = await BouncerProxy.deployed();
    const SimpleStorageInstance = await SimpleStorage.deployed();

    // add signingAccount to whitelist
    await BouncerProxyInstance.updateWhitelist(signingAccount, {
      from: deployer
    });

    // build txn data
    const simpleStorageABI = SimpleStorageInstance.abi;
    const simpleStorageAddress = SimpleStorageInstance.address;
    var destContractInstance = new web3.eth.Contract(
      simpleStorageABI,
      simpleStorageAddress
    );
    var data = destContractInstance.methods.saveSender(100).encodeABI();
    // console.log('DATA:', data);

    // reward
    const rewardAddress = '0x0000000000000000000000000000000000000000';
    const rewardAmount = 0;

    // get signing account nonce
    const nonce = await BouncerProxyInstance.nonce(signingAccount);
    // console.log('signingAccount:', signingAccount);
    // console.log('NONCE:', nonce);

    // parts
    const parts = [
      BouncerProxyInstance.address,
      signingAccount,
      simpleStorageAddress,
      web3.utils.toTwosComplement(0),
      data,
      rewardAddress,
      web3.utils.toTwosComplement(rewardAmount),
      web3.utils.toTwosComplement(nonce)
    ];
    // console.log('PARTS', parts);

    // hash & sign message
    const message = soliditySha3(...parts);
    let signature = await web3.eth.sign(message, signingAccount);

    // send
    await BouncerProxyInstance.forward(
      signature,
      signingAccount,
      simpleStorageAddress,
      0,
      data,
      rewardAddress,
      rewardAmount,
      { from: signingAccount }
    );

    // Check results
    // 1) the value in simplestorage was updated
    // 2) it was updated by bouncerProxy address, not the signingAccount
    let currentValue = await SimpleStorageInstance.value.call({
      from: deployer
    });
    assert.equal(currentValue, 100, 'Value not updated');
    let lastUpdatedBy = await SimpleStorageInstance.lastUpdatedBy.call({
      from: deployer
    });
    assert.equal(
      lastUpdatedBy,
      BouncerProxyInstance.address,
      'Not updated by bouncerProxy'
    );
  });
});
