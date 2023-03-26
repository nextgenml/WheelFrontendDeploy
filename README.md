For migrations

1. npx sequelize-cli migration:create --name create_invalid_tokens
2. npx sequelize-cli db:migrate
3. npx sequelize-cli db:migrate:undo

Token Urls

1. https://etherscan.io/token/0xcf0c122c6b73ff809c693db761e7baebe62b6a2e#code
2. https://etherscan.io/token/0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3#code
3. https://etherscan.io/token/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce#code
4. https://etherscan.io/token/0x7db5af2b9624e1b3b4bb69d6debd9ad1016a58ac#code
5. https://etherscan.io/token/0x4d224452801aced8b2f0aebe155379bb5d594381
6. https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
   Sample transfer transaction:

{
address: '0x7db5af2B9624e1b3B4Bb69D6DeBd9aD1016A58Ac',
blockHash: '0x678bab53a8f7e8c94a5494e4e45e93897b61cb6ecd013f799bd5f429be43f862',
blockNumber: 14548736,
logIndex: 261,
removed: false,
transactionHash: '0x062a34e6b70241d3e64644fe5d4b973b31d4519900a7842267e1a33ad010c490',
transactionIndex: 201,
id: 'log_5bf20acf',
returnValues: Result {
'0': '0x429CA183C5f4B43F09D70580C5365a6D21ccCd47',
'1': '0x6292390E6acfFFE1e100C7771caA2C4a049ff38a',
'2': '5314514235464384428',
from: '0x429CA183C5f4B43F09D70580C5365a6D21ccCd47',
to: '0x6292390E6acfFFE1e100C7771caA2C4a049ff38a',
value: '5314514235464384428'
},
event: 'Transfer',
signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
raw: {
data: '0x00000000000000000000000000000000000000000000000049c0f28a269c7fac',
topics: [Array]
}
}
