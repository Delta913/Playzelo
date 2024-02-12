const ManageSocket = require('../socket/ManageSocket');

var manageSocket = null;

exports.createServer = (app) => {
    const server = require('http').createServer(app);
    manageSocket = new ManageSocket(server);
    return server;
}

exports.sendBetHistory = (data) => {
    if (manageSocket !== null)
        manageSocket.broadCast('updateBetHistory', data);
}