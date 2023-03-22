const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { encode } = require("../helpers/encode")

const TEST_VALUES = [
  [0n, 1n, 56],
  [1n, 2n, 106],
  [3n, 7n, 410],
  [24n, 87n, 13176],
  [65n, 32n, 77098],
  [1282n, 7531243n, 270583232],
  [87854523n, 5452231n, 138931509982506938],
  [72191321n, 312n, 93808562899060746]
]

describe("Obfuscated", function() {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployObfuscatedContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Obfuscated = await ethers.getContractFactory("Obfuscated");
    const obfuscated = await Obfuscated.deploy();

    return { obfuscated, owner, otherAccount };
  }

  describe("Testing the contract", function() {
    it("Should return correct values", async function() {
      const { obfuscated, owner } = await loadFixture(deployObfuscatedContractFixture);

      for (let val of TEST_VALUES) {
        const txdata = encode(val[0], val[1]);
        const returnVal = await owner.call({
          to: obfuscated.address,
          data: txdata
        });
        expect(parseInt(returnVal, 16)).to.equal(val[2]);
      }
    });
  });

  describe("Testing the encode funtion", function() {
    it("Shouldn't be susceptible to the dark forest", async function() {
      // const bx = encode(TEST_VALUES[7][0], TEST_VALUES[7][1])
      // const by = encode(TEST_VALUES[6][0], TEST_VALUES[6][1])
      const txdatas = []
      for (let val of TEST_VALUES) {
        const x = val[0];
        const y = val[1];
        const txdata = encode(x, y);

        if (val[0] > 100 || val[1] > 100) {
          expect(txdata.includes(x.toString(16) || txdata.includes(y.toString(16)))).to.be.false;
          // expect(txdata).to.not.include(x.toString(16));
          // expect(txdata).to.not.include(y.toString(16));
        }
        txdatas.push([val[0], val[1], txdata]);
      }

    });
  });
});
