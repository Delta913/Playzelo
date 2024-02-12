const io = require('socket.io-client');
const { DEV_MDOE, MANAGEMENT_OPTION } = require('../config');

module.exports = class ManageSocket {
    socket = null;

    constructor() {
        this.socket = io.connect(DEV_MDOE ? `http://127.0.0.1:${MANAGEMENT_OPTION.port}` : `https://www.manage-service.playzelo.com`);
        this.bind();
    }

    bind() {
        this.socket.on('connect', () => {
        });

        this.socket.on('disconnect', () => {
        });
    }

    userBalanceUpdated(data) {
        if (this.socket === null)
            return;

        this.socket.emit('balanceUpdated', data);
    }
}