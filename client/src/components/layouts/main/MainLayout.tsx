import { Outlet } from "react-router-dom";

import RightBar from "./RightBar";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  return (
    <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl container mx-auto flex justify-between h-screen overflow-y-auto">
      <Sidebar />

      <main
        id="scrollableDiv"
        className="w-full h-screen min-w-[300px] lg:max-w-[600px] border-x border-neutral-200 dark:border-neutral-800 overflow-y-auto no-scrollbar "
      >
        <div className="min-h-screen pb-20">
          <Outlet />
        </div>
      </main>

      <RightBar />
    </div>
  );
};

export default MainLayout;
