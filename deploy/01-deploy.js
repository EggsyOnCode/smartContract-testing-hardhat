const { network } = require("hardhat");

module.exports.default = async ({deployments, getNamedAccounts }) =>{
    const{deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();

    const tokenTransfer = await deploy("TokenTransfer", {
        from: deployer,
        log: true,
    })
}