import store from 'state/store';

// load ABIs
import BouncerProxy from 'contracts/BouncerProxy';

export async function loadContracts() {
  const unsubscribe = store.subscribe(async () => {
    // wait for web3
    if (!store.getState().web3.web3Ready) {
      return;
    }

    const web3 = store.getState().web3.instance;
    const networkID = store.getState().web3.networkID;

    // check that we're on a network that this contract has been deployed to
    const isDeployedOnNetwork = !!BouncerProxy.networks[networkID];
    if (isDeployedOnNetwork) {
      // BouncerProxy
      const BouncerProxyContract = await new web3.eth.Contract(
        BouncerProxy.abi,
        BouncerProxy.networks[networkID].address
      );

      // Add more contracts here...

      store.dispatch({
        type: 'CONTRACTS_INITIALIZED',
        payload: {
          bouncerProxy: BouncerProxyContract,
          contractsReady: true
        }
      });
    }

    return unsubscribe();
  });
}
