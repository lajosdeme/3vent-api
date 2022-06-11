/*  
    - get Soul for address - OK
    - get sbt for soul - OK
    - get total supply of sbt - OK
    - get owner of sbt - OK
    - get all owners of sbts - OK

    - get name, symbol of sbt - OK

    - check if identity has sbt - OK

    - get identity for address - OK
    - get profile data for identity - OK
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Ethers = require("./services/ethersService");
const ethers = new Ethers();

//use url encoded
app.use(express.urlencoded({extended: true}));

//use json
app.use(express.json());

/* SOUL */
app.get("/soul/:address", async (req, res) => {
    const addr = req.params.address;
    const soulAddr = await ethers.getSoulForAddress(addr);

    res.send({"address": soulAddr})
})

app.get("/soul/:address/sbt", async (req, res) => {
    const addr = req.params.address;
    const soulAddr = await ethers.getSoulForAddress(addr);
    const sbtAddr = await ethers.getSbtForSoul(soulAddr);
    console.log("SBT : ", sbtAddr);
    await ethers.getSbtInfo(sbtAddr);
    
    res.send({"address": sbtAddr});
})

/* SBT */
app.get("/sbt/:address/totalSupply", async (req, res) => {
    const addr = req.params.address;
    const supply = await ethers.getSbtTotalSupply(addr);

    res.send({"totalSupply": supply.toNumber()});
})

app.get("/sbt/:address/:tokenId/owner", async (req, res) => {
    const addr = req.params.address;
    const tokenId = req.params.tokenId;
    const owner = await ethers.getOwnerOfToken(addr, tokenId);
    res.send({"owner": owner});
})

app.get("/sbt/:address/owners", async (req, res) => {
    const addr = req.params.address;
    const addresses = await ethers.getAllOwnersOfSbt(addr);
    res.send({"owners": addresses});
})

app.get("/sbt/:address/info", async (req, res) => {
    const addr = req.params.address;
    const info = await ethers.getSbtInfo(addr);
    res.send({"name": info[0], "symbol": info[1]})
})

/* IDENTITY */
app.get("/identity/:address", async (req, res) => {
    const addr = req.params.address;
    const identity = await ethers.getIdentityForAddress(addr);
    res.send({"identity": identity});
})

app.get("/identity/:address/sbt/:sbtAddress", async (req, res) => {
    const addr = req.params.address;
    const sbtAddr = req.params.sbtAddress;

    const hasSbt = await ethers.didOwnsSbt(addr, sbtAddr);
    res.send({"hasSbt": hasSbt});
})

app.get("/identity/:address/profile", async (req, res) => {
    const addr = req.params.address;

    const profileData = await ethers.getProfileDataForIdentity(addr);
    res.send({"data": profileData});
})

app.listen(port, async (req,res) => {
    console.log("App is listening on ", port);
})