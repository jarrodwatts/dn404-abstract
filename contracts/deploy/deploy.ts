import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { vars } from "hardhat/config";
import { formatEther, parseEther, parseUnits, zeroPadBytes } from "ethers";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script`);

  const wallet = new Wallet(vars.get("DEPLOYER_PRIVATE_KEY"));
  const deployer = new Deployer(hre, wallet);

  // 1. Deploy the token contract
  const tokenArtifact = await deployer.loadArtifact("MyToken");

  const tokenArgs = {
    name_: "MyToken",
    symbol_: "MT",
    initialTokenSupply: 1000000,
    initialSupplyOwner: wallet.address,
  };

  const tokenContract = await deployer.deploy(tokenArtifact, [
    ...Object.values(tokenArgs),
  ]);

  await verifyContract(hre, {
    address: await tokenContract.getAddress(),
    contract: `${tokenArtifact.sourceName}:${tokenArtifact.contractName}`,
    constructorArguments: tokenContract.interface.encodeDeploy(
      Object.values(tokenArgs)
    ),
    bytecode: tokenArtifact.bytecode,
  });

  console.log(
    `Token contract deployed & verified: ${explorerUrl}/address/${await tokenContract.getAddress()}`
  );

  // 2. Deploy the NFT contract (mirror of the ERC20 contract)
  const nftArtifact = await deployer.loadArtifact("MyNFT");

  const nftArgs = {
    name_: "MyNFT",
    symbol_: "MN",
    allowlistRoot_: zeroPadBytes("0x", 32).toString(),
    publicPrice_: parseEther("0.001").toString(),
    allowlistPrice_: parseEther("0.001").toString(),
    initialTokenSupply: parseUnits("1000000", 18).toString(),
    initialSupplyOwner: wallet.address,
  };

  const nftContract = await deployer.deploy(nftArtifact, [
    ...Object.values(nftArgs),
  ]);

  await verifyContract(hre, {
    address: await nftContract.getAddress(),
    contract: `${nftArtifact.sourceName}:${nftArtifact.contractName}`,
    constructorArguments: nftContract.interface.encodeDeploy(
      Object.values(nftArgs)
    ),
    bytecode: nftArtifact.bytecode,
  });

  console.log(
    `NFT contract deployed & verified: ${explorerUrl}/address/${await nftContract.getAddress()}`
  );
}

const verifyContract = async (
  hre: HardhatRuntimeEnvironment,
  data: {
    address: string;
    contract: string;
    constructorArguments: string;
    bytecode: string;
  }
) => {
  const verificationRequestId: number = await hre.run("verify:verify", {
    ...data,
    noCompile: true,
  });
  return verificationRequestId;
};

const explorerUrl = `https://explorer.testnet.abs.xyz`;
