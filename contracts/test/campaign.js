import { assert } from "chai";
import { readFileSync } from "fs";
import ganache from "ganache-cli";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Web3 } from "web3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const Campaign = JSON.parse(
  readFileSync(
    join(__dirname, "../artifacts/contracts/Campaign.sol/Campaign.json"),
    "utf8"
  )
);
const CampaignFactory = JSON.parse(
  readFileSync(
    join(__dirname, "../artifacts/contracts/Campaign.sol/Factory.json"),
    "utf8"
  )
);

const web3 = new Web3(ganache.provider());
let accounts;
let factory;
let campaign;
beforeEach(async () => {
  console.log("Bytecode length:", CampaignFactory.bytecode.length);
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({
      data: CampaignFactory.bytecode,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
      gasPrice: "20000000000",
    });
  try {
    await factory.methods.createCampaign("100").send({
      from: accounts[0],
      gas: "1000000",
      gasPrice: "20000000000",
    });
    console.log("Campaign created successfully");

    const deployedCampaigns = await factory.methods
      .getDeployedCampaings()
      .call();
    console.log("Deployed campaigns:", deployedCampaigns);
    const contractAddress = deployedCampaigns[0];
    console.log("Campaign address:", contractAddress);

    campaign = await new web3.eth.Contract(Campaign.abi, contractAddress);
    console.log("Campaign contract instance created");
  } catch (error) {
    console.error("Campaign creation failed:", error.message);
    throw error;
  }
});

describe("Campaigns", () => {
  // it("deploys a factory and Campaign", () => {
  //   assert.ok(true);
  //   assert.ok(true);
  // });
  // it("Make a creator campaign as a manager", async () => {
  //   const manager = await campaign.methods.manager().call();
  //   assert.equal(manager, accounts[0]);
  // });
  // it("Allows to contribute the money and marks them as approvers", async () => {
  //   await campaign.methods.contribute().send({
  //     from: accounts[1],
  //     value: "200",
  //     gasPrice: "20000000000",
  //   });
  //   const isApproves = await campaign.methods.approvers(accounts[1]).call();
  //   assert(isApproves);
  // });
  // it("requires a minimum contribution", async () => {
  //   let errThrown;
  //   try {
  //     await campaign.methods.contribute().send({
  //       value: "1",
  //       from: accounts[1],
  //     });
  //   } catch (err) {
  //     errThrown = err;
  //   }
  //   assert(errThrown);
  // });
  // it("try to create request by manager", async () => {
  //   await campaign.methods
  //     .createRequest("Buy batteries", "150", accounts[1])
  //     .send({
  //       from: accounts[0],
  //       gas: "1000000",
  //       gasPrice: "20000000000",
  //     });
  //   const request = await campaign.methods.requests(0).call();
  //   assert.equal(request.description, "Buy batteries");
  // });
  it("full cycle of smart contract", async () => {
    const methods = campaign.methods;
    await methods.contribute().send({
      from: accounts[0],
      gas: "1000000",
      value: web3.utils.toWei("5", "ether"),
      type: "0",
    });
    await methods
      .createRequest(
        "Change batteries",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({
        from: accounts[0],
        gas: "1000000",
        type: "0",
        // gasPrice: '20000000000'
      });
    await methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
      type: "0",
      // gasPrice: '20000000000'
    });
    let balance = await web3.eth.getBalance(accounts[1]);
    console.log(
      "Balance before a finalizeRequest:",
      web3.utils.fromWei(balance, "ether")
    );
    await methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
      type: "0",
      // gasPrice: '20000000000'
    });
    balance = await web3.eth.getBalance(accounts[1]);
    console.log(
      "Balance after a finalizeRequest:",
      web3.utils.fromWei(balance, "ether")
    );
    console.log("Recipient has: ", balance);
    assert(web3.utils.fromWei(balance, "ether") > 104);
  });
});
