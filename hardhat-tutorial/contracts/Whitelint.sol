//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract Whitelist{
    //允许最大的白名单地址的数量
    uint8 public maxWhitelistAddresses;

    //设置映射，如果地址是白名单，把他设为true,默认是false
    mapping(address => bool ) public whitelistAddresses;

    //用来跟踪有多少地址进去到白名单
    uint8 public numAddressesWhitelisted;


    //数值最大的白名单数量，用户在部署的时候设置它的数量
    constructor(uint8 _maxWhitelistAddress){
        maxWhitelistAddresses = _maxWhitelistAddress;
    }
    
    /**
       添加用户地址到白名单
     */
    function addAddressToWhitelist()public {
        //查看用户是否被 列入白名单
        require(!whitelistAddresses[msg.sender], "Sender has already been whitelisted");
        //查看进去的白名单是否小于限制白名单数，如果不是返回false
        require(numAddressesWhitelisted < maxWhitelistAddresses, "More addresses cant added, limit reached");
        //把函数结果添加到whitelistAddress
        whitelistAddresses[msg.sender] = true;
        //跟踪的白名单数量加1
        numAddressesWhitelisted += 1;
    }
}