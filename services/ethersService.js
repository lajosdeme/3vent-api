const ethers = require('ethers');
const factoryAbi = require("../abi/identityFactoryAbi");
const soulAbi = require("../abi/soulAbi");
const sbtAbi = require("../abi/sbtAbi");
const identityAbi = require("../abi/identityAbi");

/* 
    Rinkeby addresses:
        Master identity: 0xF90a1ae9aB6bD9dF5F5117d1f610A8DD2bd64936
        Master soul: 0x0FA2824F14dFdcf05541A029294fb71A356FD11C

        Factory: 0x8183EeA05de1a495bF70B7C5D8a6fdBdb4798f53
 */

class Ethers {
    constructor() {
        this.provider = new ethers.providers.InfuraProvider(4, "a1800fa1e11c43b1ad4d0cb4552d0e4b");
        this.factory =  new ethers.Contract("0x8183EeA05de1a495bF70B7C5D8a6fdBdb4798f53", factoryAbi, this.provider);
    }

    getSoulForAddress = async (address) => {
        const soulAddr = await this.factory.souls(address);
        return soulAddr;

    }

    getSbtForSoul = async (soulAddress) => {
        const soul = new ethers.Contract(soulAddress, soulAbi, this.provider);
        await soul.getData("0xeb7e1a2e34d8bb82b1ab1dcf9a7ca4e56a64a91cf335f7a418990ff151ebab71");
        const sbt = await soul.sbt();
        return sbt;
    }

    getSbtTotalSupply = async (sbtAddress) => {
        const sbt = new ethers.Contract(sbtAddress, sbtAbi, this.provider);
        const supply = await sbt.totalSupply();
        return supply;
    }

    getOwnerOfToken = async (sbtAddress, tokenId) => {
        const sbt = new ethers.Contract(sbtAddress, sbtAbi, this.provider);
        const owner = await sbt.ownerOf(tokenId);
        return owner; 
    }
    
    getAllOwnersOfSbt = async (sbtAddress) => {
        const sbt = new ethers.Contract(sbtAddress, sbtAbi, this.provider);
        const totalSupply = await sbt.totalSupply();
        let addresses = [];
        const supply = totalSupply.toNumber()

        if (supply < 1) {
            return  [];
        }

        for (let i = 0; i < supply; i++) {
            const addr = await sbt.ownerOf(i);
            addresses.push(addr);
        }
        return addresses;
    }

    getSbtInfo = async (sbtAddress) => {
        const sbt = new ethers.Contract(sbtAddress, sbtAbi, this.provider);
        const name = await sbt.name();
        const symbol = await sbt.symbol();
        return [name, symbol];
    }

    didOwnsSbt = async (identityAddress, sbtAddress) => {
        const sbt = new ethers.Contract(sbtAddress, sbtAbi, this.provider);
        const balance = sbt.balanceOf(identityAddress);
        return balance > 0;
    }

    getIdentityForAddress = async (address) => {
        const addr = await this.factory.identities(address);
        return addr;
    }

    getProfileDataForIdentity = async (identityAddress) => {
        const identity = new ethers.Contract(identityAddress, identityAbi, this.provider);
        const data = await identity.getData("0xeb7e1a2e34d8bb82b1ab1dcf9a7ca4e56a64a91cf335f7a418990ff151ebab71");
        return data;
    }
}

module.exports = Ethers
