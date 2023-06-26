// Hint: This folder contains all the smart contract logic

import React, { createContext, useContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

// create context
const StateContext = createContext();

// the StateContextProvider Component, this will be used as a wrapper around the App component in the main.jsx. This component helps for easier state management
export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x6B15Df78a124cc4363379ADbc6B218e026C78C3f"
  );

  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  ); // here we pass in the contract and the specify the name of our write function...This allows us to call the function and create campaign with all the details... createCampaign is a function (write function) defined in the smart contract.

  // connecting to smart wallet
  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, //owner
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
      console.log("contract call success ", data);
    } catch (error) {
      console.log("contract call failed ", error);
    }
  };

  // function that gets the campaign... Hint:This is a  "Read" function.
  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    // console.log(campaigns);

    // transforming the data from the createCampaign to human readable form
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    // console.log(parsedCampaigns);

    return parsedCampaigns;
  };

  // function that gets all campaigns for the currently logged in user or address ie the "Profile" Dashboard... This is a "Read" Function.
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    // checks if the owner is equal to the logged in address.
    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    ); // if campaign.owner === currently logged in account, only then keep it

    return filteredCampaigns;
  };

  // function that allows user to donate to campaign... This is a "Write" function(You can verify this using the thirdweb interface) ... pId = Project Id.
  // const donate = async (pId, amount) => {
  //   const data = await contract.call("donateToCampaign", pId, {
  //     value: ethers.utils.parseEther(amount),
  //   });

  //   return data;
  // };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });
    return data;
  };

  // function that get the donations to a campaign... This is a "Read" function
  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    // value contains everything you want to share across your app
    <StateContext.Provider
      // hint: createCampaign: publishCampaign = Renaming publishCampaign to "createCampaign". Thus in the frontend we will be calling "createCampaign" instead of publishCampaign.
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// creating a way to utilize the context
export const useStateContext = () => useContext(StateContext);
