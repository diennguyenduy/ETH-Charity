const Charity = artifacts.require("Charity");

module.exports = function(deployer) {
    deployer.deploy(Charity, 5, "0xbB7917A6B5c98f18c99d2b919f4898e4781C304E",10 );
};