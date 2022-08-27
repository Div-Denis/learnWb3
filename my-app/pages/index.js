import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal';
import {Contract, providers} from 'ethers';
import { abi, WHITELIST_COUNTRACT_ADDRESS } from '../constants'

export default function Home() {
  //walletConnected是跟踪用户的钱包是否被连结
  const[walletConnected,setWalletConnected] = useState(false);
  //numberOfWhitelisted是跟踪白名单的地址数量
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  //创造一个指向Web3 Modal(用与链接到Metamask)的引用，只要页面打开，它就会一直存在
  const web3ModalRef = useRef();
  //在等待加载事务，加载设置为true
  const [loading,setLoading] = useState(false);
  //joinedWhitelist 是会跟踪当前metamask地址是否已加入白名单
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);

 /**
  * 返回一个Provider或Signer对象，表示以太坊RPC，带不带MetaMask的签名
  * 
  * 需要一个Provider来与区块链交互 ————读取事务。读取余额。读取状态等
  * 
  * signer(签名者) 是一种特殊类型的提供者，用于需要向区块链进行‘写’事务的情况下，
  * 这涉及到要发送事务，需要连接账户，需要进行数字签名来授权。
  * MetaMask公开了一个signer 的API，允许你的网址使用signer函数请求用户签名
  * 
  * 这里就是说检验你刚开始有没有连接钱包，没有就连上去，
  * 然后判断你用的是rikeby网络，不是就报错
  * 
  * @param {*} needSigner  如果需要signer 则为true 否则默认为false
  * @returns 
  */
  const getProviderOrSigner = async (needSigner = false) =>{
    //连接到MetaMask
    //因为我们存储‘web3Modal’作为一个引用，我们需要访问‘current’值来访问底层对象
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    //如果用户没有连接到Rinkeby网络，让他们知道并抛出一个错误
    const {chainId} = await web3Provider.getNetwork();
    if(chainId !== 4){
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if(needSigner){
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };
  
  /**
   * addAddressToWhitelist是添加当前连接地址到白名单
   */
  const addAddressToWhitelist = async() =>{
    try {
      //我们需要一个signer,因为这是一个‘写’的事务
      const signer = await getProviderOrSigner(true);
      //使用signer创建一个新实例，改实例允许更新方法
      const whitelistContract = new Contract(
        WHITELIST_COUNTRACT_ADDRESS,
        abi,
        signer
      );
      //从合约中调用addAddressToWhitrlist
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      //等待加载
      await tx.wait();
      setLoading(false);
      //获取白名单中更新的地址
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
      
    } catch (err) {
      console.error(err);
    }
  }


  /**
   * 
   * 检查地址是否在白名单中
   */
  const checkIfAddressInWhitelist = async() => {
    try {
      //等下我们将需要signer来获取用户地址
      //它是一个读事务，因为signer只是特殊类型的提供者
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_COUNTRACT_ADDRESS,
        abi,
        signer
      );
      //获取与连接到Metamask的signer关联的地址
      const address = await signer.getAddrss();
      //从合约中调用whiteliseedAddress
      const _joinedWhitelist = await whitelistContract.whitelistAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 获取白名单数量
   */
  const getNumberOfWhitelisted = async () =>{
    try {
      //从Web3modal获取供应商，这是是metamask
      //这里不需要signer ，因为我们只是从区块链读取状态
      const provider = await getProviderOrSigner();
      //我们使用Provider与合约联系,我们值都合约访问
      const whitelistContract = new Contract(
        WHITELIST_COUNTRACT_ADDRESS,
        abi,
        provider
      );
      //从合约调用numnerAddewssesWhitelist
      const _numberOfWhitelisted = await await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    连接MetaMask钱包
   */
  const connectWallet = async () => {
    try {
      //是web3Modal库里获取的，在这里例子是MetaMask
      //第一次使用使用时，它会提示用户连接他们的钱包
      await getProviderOrSigner();
      setWalletConnected(true);
      
      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    }catch(err){
      console.error(err);
    }
  };

  const renderButton = () => {
    //判断是否连接钱包
    if(walletConnected){
      //判断是否加入了白名单
      if(joinedWhitelist){
        return (
          <div className={styles.description}>
            thanks for joining the whitelist!
          </div>
        );
        // 是否在加载
      }else if(loading){
        return <button className={styles.button}>Loading....</button>
      //不是的话就把地址添加到白名单
      }else{
        return(
          <button onClick={addAddressToWhitelist} className ={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    }else {//没有就连接钱包
      return(
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  }

  //useEffect是用于对网站状态做出反应
  //函数的末尾调用的数组表示哪些状态会触发这个效果
  //在这里，是指只要”walletConnected"的值发生变化，这个效果就会被调用
  useEffect(() => {
    //如果钱包没有连接，就会创建一个Web3Modal的新实例，并连接到MetaMask钱包
     if(!walletConnected){
      //只要这个页面一直是打开状态
      //通过设置引用对象的当前值来分配Web3Modal类给引用对象
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions:{},
        disableInjectedProvider: false,
      });
      connectWallet();
     }
  }, [walletConnected]);



  return (
   <div>
    <Head>
      <title>Whitelist Dapp</title>
      <meta name='description' content='Whitelist-Dapp'/>
      <link rel= "icon" href='/favion.ico'/>
    </Head>

    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
        <div className={styles.description}>
          Its an NFT collection for developers in Crypto.
        </div>
        <div className={styles.description}>
          {numberOfWhitelisted} have already joined the Whitelist
        </div>
        {renderButton()}
      </div>
      <div>
        <img className={styles.Image} src ="./crypto-devs.svg"/>
      </div>
    </div>

    <footer className={styles.footer}>
      Made with by Crypto Devs
    </footer>
   </div>
  );
}
