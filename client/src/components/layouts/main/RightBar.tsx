import { useLocation } from "react-router-dom";

import SearchBar from "@/components/SearchBar";

import AdCard from "./right-bar/AdCard";
import SuggestedUsersCard from "./right-bar/SuggestedUsersCard";
import RightBarFooter from "./right-bar/RightBarFooter";

const RightBar = () => {
  const location = useLocation();

  const isSearchPage = location.pathname === "/search";

  return (
    <div className="hidden lg:flex ml-4 md:ml-8 flex-1 sticky top-0 h-screen overflow-y-auto no-scrollbar">
      <div className="pt-4 flex flex-col gap-4 sticky">
        {!isSearchPage && <SearchBar />}

        <SuggestedUsersCard />
        <AdCard />
        <RightBarFooter />
      </div>
    </div>
  );
};

export default RightBar;
