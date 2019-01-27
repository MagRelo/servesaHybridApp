import store from 'state/store';
import Web3 from 'web3';

// load ABIs
import BouncerProxy from 'contracts/BouncerProxy';
import SimpleStorage from 'contracts/SimpleStorage';

export async function loadWeb3() {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', async function(dispatch) {
    var web3;

    // only wait a few seconds on "loading"
    startTipTimer();

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    // try the new way: https://medium.com/metamask/eip-1102-preparing-your-dapp-5027b2c9ed76
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        console.log('web3 instance injected');

        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.log('user rejected web3 access');
        console.log(error);
      }
    } else if (window.web3) {
      console.log('web3 instance injected (legacy)');

      // legacy method
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('No web3 instance injected, using Local web3.');

      var provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(provider);
    }

    // See if we got a web3...
    if (!web3._provider.isConnected) {
      return console.log('no web3 connection!');
    }

    // watch changes to current account
    web3.currentProvider.publicConfigStore.on('update', data => {
      if (data.selectedAddress) {
        store.dispatch({
          type: 'ACCOUNT_CHANGE',
          payload: {
            currentAccount: data.selectedAddress
          }
        });
      } else {
        store.dispatch({
          type: 'ACCOUNT_LOGOUT'
        });
      }
    });

    // load network
    let networkId = await web3.eth.net.getId();
    let network = 'unknown';
    switch (networkId.toString()) {
      case '1':
        network = 'mainnet';
        break;
      case '2':
        network = 'morden';
        break;
      case '3':
        network = 'ropsten';
        break;
      case '4':
        network = 'rinkeby';
        break;
      case '42':
        network = 'kovan';
        break;
      default:
        network = 'unknown (local?)';
    }

    // load accounts
    let accounts = await web3.eth.getAccounts();
    let balance = 0;
    if (accounts[0]) {
      balance = await web3.eth.getBalance(accounts[0]);
    }

    // load contracts
    loadContracts();

    store.dispatch({
      type: 'WEB3_INITIALIZED',
      payload: {
        instance: web3,
        network: network,
        networkID: networkId,
        accounts: accounts,
        balance: balance
      }
    });
  });
}

function startTipTimer() {
  let timer = setTimeout(function() {
    store.dispatch({
      type: 'SHOW_TIP',
      payload: {
        showTip: true
      }
    });

    clearTimeout(timer);
  }, 3000);
}

async function loadContracts() {
  const unsubscribe = store.subscribe(async () => {
    // wait for web3
    if (!store.getState().web3.web3Ready) {
      console.log('waiting for web3');
      return;
    }

    const web3 = store.getState().web3.instance;
    const networkID = store.getState().web3.networkID;

    // check that we're on a network that this contract has been deployed to
    const isDeployedOnNetwork =
      !!BouncerProxy.networks[networkID] && !!SimpleStorage.networks[networkID];

    if (isDeployedOnNetwork) {
      // BouncerProxy
      const BouncerProxyContract = await new web3.eth.Contract(
        BouncerProxy.abi,
        BouncerProxy.networks[networkID].address
      );

      // SimpleStorage
      const SimpleStorageContract = await new web3.eth.Contract(
        SimpleStorage.abi,
        SimpleStorage.networks[networkID].address
      );

      // Add more contracts here...

      store.dispatch({
        type: 'CONTRACTS_INITIALIZED',
        payload: {
          bouncerProxy: BouncerProxyContract,
          simpleStorage: SimpleStorageContract,
          contractList: [{ value: 'simpleStorage', label: 'simpleStorage' }],
          contractsReady: true
        }
      });
    }

    return unsubscribe();
  });
}
