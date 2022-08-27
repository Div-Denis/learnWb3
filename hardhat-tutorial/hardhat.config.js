require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path:".env"});

const ALCHEME_API_KEY_URI = process.env.ALCHEME_API_KEY_URI;
const PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks:{
    rinkeby:{
      url:ALCHEME_API_KEY_URI,
      accounts:[PRIVATE_KEY],
    }
  }
};
