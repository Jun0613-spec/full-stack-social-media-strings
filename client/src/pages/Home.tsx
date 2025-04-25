import { useState } from "react";

import { Feed } from "@/components/home/Feed";

import PostForm from "@/components/forms/PostForm";
import Tabs from "@/components/home/Tabs";
import Header from "@/components/Header";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<string>("for_you");

  const tabs = [
    { label: "For You", value: "for_you" },
    { label: "Following", value: "following" }
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <Header label="Home" />
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      <PostForm />

      <Feed type={activeTab} />
    </div>
  );
};

export default HomePage;
