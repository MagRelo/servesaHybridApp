const Web3 = require('web3');

var web3;
let web3Connected = false;

exports.loadWeb3 = async function() {
  const connectionString = process.env.RPC_CONNECTION_STRING;
  console.log('RPC connection string: ', connectionString);

  // get rpc ENV
  const provider = new Web3.providers.WebsocketProvider(connectionString);
  web3 = new Web3(provider);

  // web3 connection and retry
  web3Connected = await web3Connect();

  // See if we got web3...
  if (!web3Connected) {
    return console.log('no web3 connection!');
  }

  // set network
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
    case '654321':
      network = 'pragma-testnet';
      break;
    default:
      network = 'unknown (local?)';
  }

  // get accounts
  let accounts = await web3.eth.getAccounts();
  let balance = 0;
  if (accounts[0]) {
    balance = await web3.eth.getBalance(accounts[0]);
  }

  return {
    instance: web3,
    network: network,
    accounts: accounts,
    balance: balance
  };
};

async function web3Connect() {
  let conn = false;
  const numRetries = 10;
  for (let i = 1; i < numRetries; ++i) {
    try {
      conn = await web3.eth.net.isListening();

      break;
    } catch (error) {
      console.log(
        'web3 connection error (',
        i,
        ') waiting: ',
        1000 * i * 2,
        ' ms'
      );
      await new Promise(resolve => setTimeout(resolve, 1000 * i * 2));
    }
  }

  if (!conn) {
    process.exit(-1);
  } else {
    console.log('web3 connected.');
  }

  return conn;
}
