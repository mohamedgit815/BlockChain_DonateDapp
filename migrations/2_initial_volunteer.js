
const Volunteer = artifacts.require("../contracts/Volunteer.sol");

module.exports = function (deployer) {
  deployer.deploy(Volunteer);
};
