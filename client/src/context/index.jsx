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
  ); // here we pass in the contract and the specify the name of our write function...This allows us to call the function and create campaign with all the details... createCampaign is a  function (write function) defined in the smart contract.

  // connecting to smart wallet
  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ]);

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  return (
    // value contains everything you want to share across your app
    <StateContext.Provider
      // hint: we reassign publishCampaign to be called "createCampaign". Thus in the frontend we will be calling "createCampaign" instead of publishCampaign.
      value={{ address, contract, connect, createCampaign: publishCampaign }}
    >
      {children}
    </StateContext.Provider>
  );
};

// creating a way to utilize the context
export const useStateContext = () => useContext(StateContext);
