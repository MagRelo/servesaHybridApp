# Servesa

## Development

1. Start ganache:

`$ ganache-cli --ws-apis=all --networkId=1234 --account="0x72eb4efe127c1443ce2f6126a8cb11690b45a6df02946efa4f7ca51c9a9e5a6d, 100000000000000000000" --account="0x88abebbf5f5d8c3b3488eb272a2fd69ac2ef06d258b16092e14e555e0ca90180, 100000000000000000000" --account="0xc2f963910907faec613f04aed9df507dec86b407b0f355d24b8a7efb6a65bae1, 100000000000000000000"`

2. Deploy contracts:

`$ truffle migrate --network=development --reset`
