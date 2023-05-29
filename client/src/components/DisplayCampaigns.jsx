import React from "react";
import { useNavigate } from "react-router-dom";

import { loader } from "../assets";
import FundCard from "./FundCard";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign }); // Hint: the 2nd parameter "state"  is available in the new react router. it makes it easier for us to directly pass state to routing.
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left ">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px] ">
        {/* if it is loading then show the loader image */}

        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain  "
          />
        )}

        {/* shows is not loading and there is no campaign */}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]   ">
            You have not created any campaigns yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={campaign.id}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
