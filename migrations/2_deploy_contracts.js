const hospital = artifacts.require("hospital");

module.exports = function(deployer) {
  deployer.deploy(hospital);
};
