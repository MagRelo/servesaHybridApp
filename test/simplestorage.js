const SimpleStorage = artifacts.require('./SimpleStorage.sol');

contract('SimpleStorage', accounts => {
  it('update value and store msg.sender', async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    // Set value of 100
    await simpleStorageInstance.saveSender(100, { from: accounts[0] });

    // test
    let currentValue = await simpleStorageInstance.value.call({
      from: accounts[0]
    });
    assert.equal(currentValue, 100, 'Value not updated');

    let lastUpdatedBy = await simpleStorageInstance.lastUpdatedBy.call({
      from: accounts[0]
    });
    assert.equal(lastUpdatedBy, accounts[0], 'Sender not updated');
  });
});
