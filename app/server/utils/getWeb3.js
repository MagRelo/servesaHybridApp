const Web3 = require('web3');

let web3,
  web3Connected,
  network,
  networkId,
  serverAccount,
  serverAccountBalance = null;

exports.getWeb3 = async function() {
  if (!web3) {
    await loadWeb3();
  }
  return {
    web3,
    web3Connected,
    network,
    networkId,
    serverAccount,
    serverAccountBalance
  };
};

async function loadWeb3() {
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
  networkId = await web3.eth.net.getId();
  network = 'unknown';
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

  // add account from ENV vars
  const privateKey = process.env.SERVER_PRIVATE_KEY;
  if (!privateKey) {
    return console.log('no private key');
  }
  serverAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
  serverAccountBalance = await web3.eth.getBalance(serverAccount.address);

  console.log('done');
  return true;
}

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

exports.getServerAccount = async function() {};
