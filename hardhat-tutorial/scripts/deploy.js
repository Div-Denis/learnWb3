const{ ethers } = require("hardhat");

async function main(){

    const whitelistContract = await ethers.getContractFactory("Whitelist");
    
    //部署白名单合约，把白名单最大数量定为10
    const deployedWhitelistContract = await whitelistContract.deploy(10);
    
    //等待部署
    await deployedWhitelistContract.deployed();

    console.log("Whitelist Contract Address：", deployedWhitelistContract.address);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
    })