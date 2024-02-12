module.exports = {
    SERVER_PORT: 5000,
    JWT: {
        expireIn: '1h',
        secret: 'PLAYZELOSECRET'
    },
    DB: 'mongodb://127.0.0.1:27017/PlayZelo',
    MANAGEMENT_OPTION: {
        port: 4000
    },
    TATUM_OPTION: {
        testnet: {
            apikey: '46c1c3b1-e40f-4c8a-8a76-308b31042f3c',
            virtualAccount: 'PlayZeloPaymentTestnet',
            withdrawFee: '0.00001'
        },
        mainnet: {
            apikey: 'c95bf783-7b85-458c-8fcf-19faf2caec08',
            virtualAccount: 'PlayZeloPaymentMainnet',
            withdrawFee: '0.00001'
        }
    },
    INFURA_OPTION: {
        testnet: {
            providerUrl: 'https://sepolia.infura.io/v3/69b01f7c51d044c0a7883220a2104df3'
        },
        mainnet: {
            providerUrl: 'https://mainnet.infura.io/v3/69b01f7c51d044c0a7883220a2104df3'
        }
    },
    TRONWEB_OPTION: {
        testnet: {
            providerUrl: 'https://api.shasta.trongrid.io'
        },
        mainnet: {
            providerUrl: 'https://api.trongrid.io'
        }
    },
    NETWORK: 'testnet',
    // SUBSCRIBE_URL: 'http://212.24.111.179:5000/api/v0/payment/webhook-handler',
    SUBSCRIBE_URL: 'https://www.playzelo.com/api/v0/payment/webhook-handler',
    DEV_MDOE: true
};