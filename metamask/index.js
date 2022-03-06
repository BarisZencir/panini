const { MetamaskContractAdaptor, getInstance } = require("metamaskContractAdaptor")
/**
 * 
 * ./blockchain/metamaskContractAdaptor/index.js:metamaskContractAdaptor > ./blockchain/metamaskContractAdaptor/build/metamaskContractAdaptor.js
 * 
browserify -r ./contractAdaptors/index.js:contractAdaptor > ./contractAdaptor.js
browserify -r ./blockchain/metamaskContractAdaptor/index.js:metamaskContractAdaptor > ./blockchain/metamaskContractAdaptor/build/metamaskContractAdaptor.js
cd .\blockchain\metamaskContractAdaptor\test\
http-server  -p 8080 -d
http://localhost:8080/index.html
 * 
 */

var metamaskContractAdaptor = getInstance()

metamaskContractAdaptor.on(MetamaskContractAdaptor.FOUND_METAMASK, function () {
    console.log(MetamaskContractAdaptor.FOUND_METAMASK + ' event triggered.')
})
metamaskContractAdaptor.on(MetamaskContractAdaptor.NOT_FOUND_METAMASK, function () {
    console.log(MetamaskContractAdaptor.NOT_FOUND_METAMASK + ' event triggered.')
})

metamaskContractAdaptor.on(MetamaskContractAdaptor.ENABLED_PERMISSION_TO_ACCESS_ACCOUNTS, function () {
    console.log(MetamaskContractAdaptor.ENABLED_PERMISSION_TO_ACCESS_ACCOUNTS + ' event triggered.')
})
metamaskContractAdaptor.on(MetamaskContractAdaptor.HAS_NOT_PERMISSION_TO_ACCESS_ACCOUNTS, function () {
    console.log(MetamaskContractAdaptor.HAS_NOT_PERMISSION_TO_ACCESS_ACCOUNTS + ' event triggered.')
})

metamaskContractAdaptor.on(MetamaskContractAdaptor.WRONG_NETWORK, function () {
    console.log(MetamaskContractAdaptor.WRONG_NETWORK + ' event triggered.')
})

metamaskContractAdaptor.on(MetamaskContractAdaptor.ACCOUNTS_CHANGED, function (accounts) {
    console.log(MetamaskContractAdaptor.ACCOUNTS_CHANGED + ' event triggered. Accounts: ', accounts)
})

metamaskContractAdaptor.on(MetamaskContractAdaptor.CHAIN_CHANGED, function (chainId) {
    console.log(MetamaskContractAdaptor.CHAIN_CHANGED + ' event triggered. ChainId: ', chainId)
})


metamaskContractAdaptor.on(MetamaskContractAdaptor.CONNECTED, function (cnnectInfo) {
    console.log(MetamaskContractAdaptor.CONNECTED + ' event triggered. ConnectInfo: ', cnnectInfo)
})

metamaskContractAdaptor.on(MetamaskContractAdaptor.DISCONNECTED, function (error) {
    console.log(MetamaskContractAdaptor.DISCONNECTED + ' event triggered. Error: ', error)
})

metamaskContractAdaptor.on(MetamaskContractAdaptor.ALREADY_METHOD_TRIGGERED, function (method) {
    console.log(MetamaskContractAdaptor.ALREADY_METHOD_TRIGGERED + ' event triggered. Method: ' + method)
})

metamaskContractAdaptor.on(MetamaskContractAdaptor.METHOD_CANCELLED, function (method) {
    console.log(MetamaskContractAdaptor.METHOD_CANCELLED + ' event triggered. Method: ' + method)
})

window.checkMetamask = async function () {
    var result = await metamaskContractAdaptor.checkMetamask()
    console.log("checkMetamask : " + result)
}

window.checkNetwork = async function () {
    var result = await metamaskContractAdaptor.checkNetwork()
    console.log("checkNetwork : " + result)
}

window.checkPermissionToAccessAccounts = async function () {
    var result = await metamaskContractAdaptor.checkPermissionToAccessAccounts()
    console.log("checkPermissionToAccessAccounts : " + result)
}

window.checkConnection = async function () {
    var result = await metamaskContractAdaptor.checkConnection()
    console.log("checkConnection : " + result)
}

window.enablePermissionToAccessAccounts = async function () {
    var result = await metamaskContractAdaptor.enablePermissionToAccessAccounts()
    console.log("enablePermissionToAccessAccounts : " + result)
}



window.getSelectedChainId = async function () {
    var result = await metamaskContractAdaptor.getSelectedChainId()
    console.log("getSelectedChainId : " + result)
}

window.getSelectedAddress = async function () {
    var result = await metamaskContractAdaptor.getSelectedAddress()
    console.log("getSelectedAddress : " + result)
}



//Not: test kodu.
window.upgradeCard = async function (cardId, burnedCardId) {
    try {
        var result = await metamaskContractAdaptor.upgradeCard(cardId, burnedCardId)
        console.log("upgradeCard : " + result)    
    } catch(error) {
        console.log(error)
    }
} 

window.buyPackage = async function (packageType = 1, currency = 1) {
    try {
        var result = await metamaskContractAdaptor.buyPackage(packageType, currency)
        console.log("checkMetamask : " + result)
    } catch(error) {
        console.log(error)
    }
}

window.createAuction = async function (currency, cardId, startPrice, endPrice, duration) {
    try {
        var result = await metamaskContractAdaptor.createAuction(currency, cardId, startPrice, endPrice, duration)
        console.log("checkMetamask : " + result)
    } catch(error) {
        console.log(error)
    }
}

window.cancelAuction = async function (packageType, cardId) {
    try {
        var result = await metamaskContractAdaptor.cancelAuction(packageType, cardId)
        console.log("checkMetamask : " + result)
    } catch(error) {
        console.log(error)
    }
}

window.cancelAuction = async function (packageType, cardId) {
    try {
        var result = await metamaskContractAdaptor.cancelAuction(packageType, cardId)
        console.log("store : " + result)
    } catch(error) {
        console.log(error)
    }
}

var num = 1;
window.store = async function () {
    try {
        var result = await metamaskContractAdaptor.store(num++)
        console.log("store : " + result)
    } catch(error) {
        console.log(error)
    }
}


window.retrieve = async function () {
    try {
        num = await metamaskContractAdaptor.retrieve()
        console.log("stored count : " + num)
    } catch(error) {
        console.log(error)
    }
}
