import ABI from "./ABI.json";
import Web3 from "web3";

const CONTRACT_ADDRESS = "0x6d496e244c199820288dFd750D10C6aD5385973d";

export async function doLogin() {
    if (!window.ethereum) throw new Error("MetaMask not found!");

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    if (!accounts || !accounts.length) throw new Error("Wallet not found/authorized");

    localStorage.setItem("wallet", accounts[0]);
    return accounts[0];
}

function getContract() {
    const web3 = new Web3(window.ethereum);
    const from = localStorage.getItem("wallet");
    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function addCampaign(campaign) {
    const contract = getContract();
    return contract.methods.addCampaign(campaign.title, campaign.description, campaign.videoUrl, campaign.imageUrl).send();
}

export async function getLastCampaignId() {
    const contract = getContract();
    return contract.methods.nextId().call();
}

export async function getCampaign(id) {
    const contract = getContract();
    return contract.methods.campaigns(id).call();
}

export async function donate(id, donation) {
    await doLogin();
    const contract = getContract();
    return contract.methods.donate(id).send({
        value: Web3.utils.toWei(donation, "ether")
    })
}