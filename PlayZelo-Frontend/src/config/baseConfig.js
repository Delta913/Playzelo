const isLocal = true;
const pro = 'https://www.playzelo.com';
const dev = 'http://localhost:5000';
const url = isLocal ? dev : pro;

const Config = {
    Root: {
        baseUrl: isLocal ? 'http://localhost:8800' : 'https://playzelo.com',
        apiUrl: `${url}/api`,
        socketServerUrl: isLocal ? `http://localhost:4000` : 'https://manage-services.playzelo.com',
        socket: null,
        chatSocket: null,
        chatSocketUrl: isLocal ? 'http://localhost:4900' : 'https://chat-services.playzelo.com',
        turtleraceSocketUrl: isLocal ? 'http://localhost:5100' : 'https://turtlerace-services.playzelo.com',
        scissorsSocketUrl: isLocal ? 'http://localhost:5200' : 'https://scissor-services.playzelo.com',
        minesSocketUrl: isLocal ? 'http://localhost:5300' : 'https://mines-services.playzelo.com',
        diceSocketUrl: isLocal ? 'http://localhost:5400' : 'https://dice-services.playzelo.com',
        slotSocketUrl: isLocal ? 'http://localhost:5500' : 'https://slot-services.playzelo.com',
        plinkoSocketUrl: isLocal ? 'http://localhost:5600' : 'https://plinko-services.playzelo.com',
        crashSocketUrl: isLocal ? 'http://localhost:5700' : 'https://crash-services.playzelo.com'
    },
    token: 'PlayZelo',
    request: {
        getAuthData: '/auth/getAuthData',
        userGoogleLogin: '/auth/google-login',
        metamaskLogin: '/auth/metamask-login',
        emailLogin: '/auth/email-login',
        verifyEmailCode: '/auth/verifyEmailCode',
        updateProfileSet: '/auth/updateProfileSet',
        getDepositAddress: '/v0/payment/deposit-address',
        getMyBalance: '/auth/getMyBalance',
        getMyBalances: '/auth/getMyBalances',
        withdraw: '/v0/payment/withdraw',
        getDailyReward: '/v0/payment/get-daily-reward',
        getProfileData: '/auth/getProfileData',
        getDepositBonus: '/auth/getDepositBonus',
        getBetHistoryData: '/auth/getBetHistoryData',
        updateCurrency: '/auth/updateCurrency',
        updateProfileHistory: '/auth/updateProfileHistory',
        updateUserGameSetting: '/auth/updateUserGameSetting',
        getSeedData: '/auth/getSeedData',
        updateClientSeed: '/auth/updateClientSeed',
        updateServerSeed: '/auth/updateServerSeed',
        getLevelData: '/auth/getLevelData',
        getCurrencies: '/v0/payment/getCurrencies',
        getExchangeRate: '/v0/payment/getExchangeRate',
        swapCoin: '/v0/payment/swapCoin',
        getAvailableGames: '/auth/getAvailableGames',
        getBannerText: '/auth/getBannerText',
        getPrivacyData: '/auth/getPrivacyData',
        updatePrivacyData: '/auth/updatePrivacyData',
        getCampaignCode: '/auth/getCampaignCode',
        getCampaignData: '/auth/getCampaignData',
        claimCampaignAmount: '/auth/claimCampaignAmount',
        getUnlockBalance: '/auth/getUnlockBalance',
        getWargerBalance: '/auth/getWargerBalance',
        claimLockedBalance: '/auth/claimLockedBalance',
        getSpinCount: '/auth/getSpinCount',
        updateSpinCount: '/auth/updateSpinCount',
        getTournamentList: '/auth/getTournamentList',
        participateTournament: '/auth/participateTournament',
        getAffiliateUsersData: '/auth/getAffiliateUsersData',
        getAffiliateEarningData: '/auth/getAffiliateEarningData',
        getTournamentWargerDetail: '/auth/getTournamentWargerDetail',
        getCampaignList: '/auth/getCampaignList',
        addCampaignList: '/auth/addCampaignList',
        getCampaignDetail: '/auth/getCampaignDetail',
        getTransactionHistory: '/auth/getTransactionHistory'
    }
};

export default Config;