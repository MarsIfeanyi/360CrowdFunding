import { useEffect, useState } from "react";
import DisplayCampaigns from "../components/DisplayCampaigns";
import { useStateContext } from "../context";
DisplayCampaigns;

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  // Hint: you can't use async function directly inside useEffect and since getCampaigns is an async function we call it inside this function and then call this function in the useEffect
  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    // checks if contract exists and then getCampaigns
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <div className="">
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  );
};

export default Home;
