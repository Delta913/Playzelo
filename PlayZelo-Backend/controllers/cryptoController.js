const mongoose = require('mongoose');
const models = require('../models');
const tatumController = require('./tatumController');
const Axios = require('axios');
const SocketManager = require('../socket/Manager');
const { v4: uuidv4 } = require('uuid');

const AssetList = [
    {
        coinType: 'USDT', type: 'trc-20', asset: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs'
    },
    {
        coinType: 'USDT', type: 'bep-20', asset: '0x635425486d564C9b48c853719b6eA0D2A7A670AD'
    },
    {
        coinType: 'USDT', type: 'erc-20', asset: '0x7c16fD73095428302b7eCcD84ABd1e96d242395A'
    }
];

exports.getDepositAddressFromAccount = async (req, res) => {
    try {
        let { coinType, type, userId } = req.body;
        if (type !== 'native') {
            coinType = await tatumController.getNativeData({ type });
        }

        if (coinType) {
            let walletData = await models.walletModel.findOne({ userId, currency: coinType });
            if (walletData) {
                return res.json({ status: true, data: walletData });
            }
            else {
                let response = await tatumController.getDepositAddressFromAccount({ coinType });
                if (response !== null) {
                    let data = await new models.walletModel({
                        address: response.address,
                        xpub: response.xpub,
                        derivationKey: response.derivationKey,
                        currency: coinType,
                        userId: userId,
                        privateKey: response.key
                    }).save();
                    return res.json({ status: true, data: data });
                }
                else {
                    return res.json({ status: false, data: response, message: 'API Error' });
                }
            }
        }
        else {
            return res.json({ status: false, data: null, message: 'Invalid Request' });
        }
    }
    catch (err) {
        console.error({ title: 'cryptoController - getDepositAddressFromAccount', message: err.message });
        return res.json({ status: false, data: null, message: 'Server Error' });
    }
}

exports.getBalanceFromAccount = async (req, res) => {
    try {
        const { coinType } = req.body;
        if (coinType) {
            let response = await tatumController.getBalanceFromAccount({ coinType });
            if (response !== null) {
                return res.json({ status: true, data: response });
            }
            else {
                return res.json({ status: false, data: response, message: 'API Error' });
            }
        }
        else {
            return res.json({ status: false, data: null, message: 'Invalid Request' });
        }
    }
    catch (err) {
        console.error({ title: 'cryptoController - getAccountBalance', message: err.message });
        return res.json({ status: false, data: null, message: 'Server Error' });
    }
}

exports.withdrawFromAccount = async (req, res) => {
    try {
        const { coinType } = req.body;

        if (coinType === 'BTC')
            this.withdrawBTCFromAccount(req, res);

        if (coinType === 'ETH')
            this.withdrawETHFromAccount(req, res);

        if (coinType === 'TRX')
            this.withdrawTRONFromAccount(req, res);
    }
    catch (err) {
        console.error({ title: 'cryptoController - withdrawFromAccount', message: err.message });
        return res.json({ status: false, data: null, message: 'Server Error' });
    }
}

exports.withdrawBTCFromAccount = async (req, res) => {
    try {
        const { address, amount, userId, coinType } = req.body;
        if (!address || !amount) {
            return res.json({ status: false, data: null, message: 'Invalid Request' });
        }

        let userData = await models.userModel.findOne({ _id: userId });
        if (!userData.balance || Number(userData.balance[coinType]) < Number(amount))
            return res.json({ status: false, data: null, message: 'Not enough Balance' });

        const walletData = await models.walletModel.findOne({ userId: userId, currency: coinType });
        if (!walletData)
            return res.json({ status: false, message: 'Not enough balance' });

        let response = await tatumController.withdrawBTCFromAccount({ address, amount, myAddress: walletData.address, currency: coinType });
        if (response !== null) {
            userData.balance[coinType] = Number(userData.balance[coinType]) - Number(amount);
            await models.userModel.findOneAndUpdate({ _id: userId }, { balance: userData.balance });
            return res.json({ status: true, data: response });
        }
        else {
            return res.json({ status: false, data: response, message: 'API Error' });
        }
    }
    catch (err) {
        console.error({ title: 'cryptoController - withdrawBTCFromAccount', message: err.message });
        return res.json({ status: false, data: null, message: 'Server Error' });
    }
}

exports.withdrawETHFromAccount = async (req, res) => {
    try {
        const { address, amount, userId, coinType } = req.body;
        if (!address || !amount) {
            return res.json({ status: false, data: null, message: 'Invalid Request' });
        }

        let userData = await models.userModel.findOne({ _id: userId });
        if (!userData.balance || Number(userData.balance[coinType]) < Number(amount))
            return res.json({ status: false, data: null, message: 'Not enough Balance' });

        const walletData = await models.walletModel.findOne({ userId: userId, currency: coinType });
        if (!walletData)
            return res.json({ status: false, message: 'Not enough balance' });

        let response = await tatumController.withdrawETHFromAccount({ address, amount, derivationKey: walletData.derivationKey, myAddress: walletData.address, currency: coinType });
        if (response !== null) {
            userData.balance[coinType] = Number(userData.balance[coinType]) - Number(amount);
            await models.userModel.findOneAndUpdate({ _id: userId }, { balance: userData.balance });
            return res.json({ status: true, data: response });
        }
        else {
            return res.json({ status: false, data: response, message: 'API Error' });
        }
    }
    catch (err) {
        console.error({ title: 'cryptoController - withdrawETHFromAccount', message: err.message });
        return res.json({ status: false, data: null, message: 'Server Error' });
    }
}

exports.withdrawTRONFromAccount = async (req, res) => {
    try {
        const { address, amount, userId, coinType } = req.body;
        if (!address || !amount) {
            return res.json({ status: false, data: null, message: 'Invalid Request' });
        }

        let userData = await models.userModel.findOne({ _id: userId });
        if (!userData.balance || Number(userData.balance[coinType]) < Number(amount))
            return res.json({ status: false, data: null, message: 'Not enough Balance' });

        const walletData = await models.walletModel.findOne({ userId: mongoose.Types.ObjectId(userId), currency: coinType });
        if (!walletData)
            res.json({ status: false, message: 'Not enough balance' });

        let response = await tatumController.withdrawTRONFromAccount({ address, amount, derivationKey: walletData.derivationKey, myAddress: walletData.address, currency: coinType });
        if (response !== null) {
            userData.balance[coinType] = Number(userData.balance[coinType]) - Number(amount);
            await models.userModel.findOneAndUpdate({ _id: userId }, { balance: userData.balance });
            return res.json({ status: true, data: response });
        }
        else {
            return res.json({ status: false, data: response, message: 'API Error' });
        }
    }
    catch (err) {
        console.error({ title: 'cryptoController - withdrawTRONFromAccount', message: err.message });
        return res.json({ status: false, data: null, message: 'Server Error' });
    }
}

exports.tatumWebhook = async (req, res) => {
    try {
        let { address, amount, counterAddress, asset, blockNumber, txId, type, subscriptionType, tokenId } = req.body;
        let currency = { coinType: '', type: '' };
        if (type === 'native') {
            currency = { coinType: asset === 'TRON' ? 'TRX' : asset === 'BSC' ? 'BNB' : asset, type: type };
        }
        else {
            const matchedAsset = AssetList.find((item) => item.asset.toLowerCase() === asset.toLowerCase());
            currency = { coinType: matchedAsset.coinType, type: matchedAsset.type };
            if (tokenId === null) {
                let tempAddr = counterAddress;
                counterAddress = address;
                address = tempAddr;
            }
        }

        let txData = await models.transactionModel.findOne({ txId });
        if (!txData) {
            console.log('New Tatum Webhook ===>');
            console.log(req.body);
            await new models.transactionModel({ txId, amount, from: counterAddress, to: address, date: new Date(), blockNumber, subscriptionType, currency }).save();
            let walletData = await models.walletModel.findOne({ address: address });
            if (walletData) {
                let userData = await models.userModel.findOne({ _id: walletData.userId });
                let balanceData = userData.balance.data.find((data) => data.coinType === currency.coinType && data.type === currency.type);
                balanceData.balance += Number(amount);
                await models.userModel.findOneAndUpdate({ _id: walletData.userId }, { balance: userData.balance });
            }
        }
    }
    catch (err) {
        console.error({ title: 'cryptoController - tatumWebhook', message: err.message });
        return res.json({ status: false, data: null, message: 'Server Error' });
    }
}

exports.getDailyReward = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.json({ status: false, message: 'Invalid Request' });

        const userData = await models.userModel.findOne({ _id: userId });
        if (!userData)
            return res.json({ status: false, message: 'User not found' });

        const rewardedData = await models.dailyRewardModel.findOne({ userId: userId, rewardToken: 'ZELO' }).sort({ rewardDate: '-1' });
        if (!rewardedData || (new Date(rewardedData.rewardDate).getDate() < new Date().getDate())) {
            const rewardData = await new models.dailyRewardModel({
                userId: userId,
                rewardDate: new Date(),
                rewardAmount: 50,
                rewardToken: 'ZELO'
            }).save();
            if (!userData.balance) {
                userData.balance = { ZELO: rewardData.rewardAmount };
            }
            else if (!userData.balance.hasOwnProperty('ZELO')) {
                userData.balance['ZELO'] = rewardData.rewardAmount;
            }
            else {
                userData.balance.ZELO = userData.balance.ZELO + rewardData.rewardAmount;
            }
            await models.userModel.findOneAndUpdate({ _id: userId }, { balance: userData.balance });
            return res.json({ status: true, data: rewardData });
        }
        else {
            return res.json({ status: false, message: 'You already got today reward.' });
        }
    }
    catch (err) {
        console.error({ title: 'cryptoController - getDailyReward', message: err.message });
        return res.json({ status: false, data: null, message: 'Server Error' });
    }
}

exports.getCurrencies = async (req, res) => {
    try {
        const response = await models.currencyListModel.find({ available: true });
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'cryptoController => getCurrencies', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getExchangeRate = async (req, res) => {
    let { from, to } = req.body;
    if (!from || !to) return res.json({ status: false, message: 'Invalid Request' });

    if (from === 'ZELO') from = 'USDT';
    if (to === 'ZELO') to = 'USDT';

    const response = await getExchangeRateFromBinanceApi(from, to);
    return res.json(response);
}

const getExchangeRateFromBinanceApi = async (from, to) => {
    if (from === to) return { status: true, data: 0.98 };

    const fromUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${from}TRY`;
    const toUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${to}TRY`;

    const fromResponse = await Axios.get(fromUrl);
    const toResponse = await Axios.get(toUrl);

    if (!fromResponse.data.hasOwnProperty('price') || !toResponse.data.hasOwnProperty('price')) return { status: false, message: 'API Error' };
    else {
        const rate = fromResponse.data.price / toResponse.data.price * 0.98;
        return { status: true, data: rate };
    }
}

exports.swapCoin = async (req, res) => {
    try {
        let { from, to, amount, userId, fromType, toType } = req.body;
        if (!from || !to || !amount) return res.json({ status: false, message: 'Invalid Request' });
        if (amount <= 0) return res.json({ status: false, message: 'Swap amount should be great than 0.' });

        let userData = await models.userModel.findOne({ _id: userId });
        let fromIndex = userData.balance.data.findIndex(item => item.coinType === from && item.type === fromType);
        let toIndex = userData.balance.data.findIndex(item => item.coinType === to && item.type === toType);
        if (userData.balance.data[fromIndex].balance < amount) {
            return res.json({ status: false, message: 'Not enough balance' });
        }

        let originFrom;
        if (from === 'ZELO') {
            originFrom = from;
            from = 'USDT';
        }
        let originTo;
        if (to === 'ZELO') {
            originTo = to;
            to = 'USDT';
        }

        const response = await getExchangeRateFromBinanceApi(from, to);
        if (response.status) {
            let swapRate = response.data;
            let swappedAmount = amount * swapRate;

            userData.balance.data[fromIndex].balance = Number(userData.balance.data[fromIndex].balance) - amount;
            userData.balance.data[toIndex].balance = Number(userData.balance.data[toIndex].balance) + swappedAmount;
            await models.userModel.findOneAndUpdate({ _id: userId }, userData);
            SocketManager.requestBalanceUpdate(userData);

            await new models.swapHistoryModel({ userId, swapId: uuidv4(), swapAmount: amount, swappedAmount: swappedAmount, rate: swapRate, from: originFrom, to }).save();
            return res.json({ status: true });
        }
        else {
            res.json({ status: false, message: 'API Error' });
        }
    }
    catch (err) {
        console.error({ title: 'cryptoController => swapCoin', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}