import store from 'state/store';

// load ABIs
import BouncerProxy from 'contracts/BouncerProxy';

export async function loadContracts() {
  const unsubscribe = store.subscribe(async () => {
    // wait for web3
    if (store.getState().web3.web3Ready) {
      const web3 = store.getState().web3.instance;
      const networkID = store.getState().web3.networkID;

      //
      const isDeployedOnNetwork = !!BouncerProxy.networks[networkID];
      if (isDeployedOnNetwork) {
        const BouncerProxyContract = await new web3.eth.Contract(
          BouncerProxy.abi,
          BouncerProxy.networks[networkID].address
        );

        store.dispatch({
          type: 'CONTRACTS_INITIALIZED',
          payload: {
            bouncer: BouncerProxyContract
          }
        });
      }

      return unsubscribe();
    }
  });
}
