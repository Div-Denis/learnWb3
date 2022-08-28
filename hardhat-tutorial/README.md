# Whitelist-Dapp

## Build

### Smart Contract
构建智能合约，我们要使用[Hradhat](https://hardhat.org/), Hardhat是一个以太坊的开发环境和框架，专为Solidityd中的全栈开发而设计。

打开终端并执行这些命令(如果执行失败，请试试用管理者打开终端) 。

- 创建Whitelist-Dapp，进入到Whitelist-Dapp里
 
```
mkdir Whitelist-Dapp
cd Whitelist-Dapp
```

- 在Whitelist-Dapp里，设置Hardhat项目

```
mkdir hardhat-tutorial
cd hardhat-tutorial
npm init --yes
npm install --save-dev hardhat
```
- 在安装Hardhat同一目录中运行
```
npx hearhat
```

* 选择Create a Javascript project

如果不再MAC上，请额外安装这些库
```
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

写solidityh合约

- 编译合约，打开hradhat-tutorial目录的终端执行这个命令
```
npx hardhat compile
```

修改好deploy.js

现在在hradhat-tutorial目录下创建一个.nev文件并添加下面的行

- 在[Alchemy](https://dashboard.alchemy.com/) 找到rinkeby私钥
```
// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard and select the network as Rinkeby, and replace "add-the-alchemy-key-url-here" with its key url
ALCHEMY_API_KEY_URL="add-the-alchemy-key-url-here"

// Replace this private key with your RINKEBY account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
RINKEBY_PRIVATE_KEY="add-the-rinkeby-private-key-here"
```

找到打开hardhat.config.js 文件，将rinkeby在此处添加网络
```
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
};
```

现在部署合约，在hardhat-tutorial目录的终端并执行此命令
```
npx hardhat run scripts/deploy.js --network rinkeby
```

得到白名单地址，要保存好


