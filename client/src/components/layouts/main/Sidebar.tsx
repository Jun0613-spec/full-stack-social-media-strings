import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarItem from "./sidebar/SidebarItem";
import PostButton from "./sidebar/PostButton";
import UserButton from "./sidebar/UserButton";

import { sidebarLinks } from "@/lib/constants";

import { useAuthStore } from "@/stores/authStore";

const Sidebar = () => {
  const { currentUser } = useAuthStore();

  if (!currentUser) return;

  const links = sidebarLinks(currentUser);

  return (
    <div className="hidden md:flex flex-col justify-between sticky top-0 h-screen xs:px-2 2xl:px-8  pt-2 pb-4">
      <div className="flex flex-col gap-6 text-lg items-center 2xl:items-start">
        <SidebarLogo />

        <div className="flex flex-col gap-4">
          {links.map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              href={item.href}
              icon={item.icon}
              activeIcon={item.activeIcon}
            />
          ))}
        </div>

        <PostButton />
      </div>

      <UserButton />
    </div>
  );
};

export default Sidebar;
