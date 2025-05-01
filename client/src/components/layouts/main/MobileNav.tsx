import { FaPlus } from "react-icons/fa6";

import { sidebarLinks } from "@/lib/constants";

import { useAuthStore } from "@/stores/authStore";
import { usePostModalStore } from "@/stores/modals/posts/postModalStore";

import SidebarItem from "./sidebar/SidebarItem";
import MobileUserButton from "./MobileUserButton";

const MobileNav = () => {
  const { currentUser } = useAuthStore();
  const { openModal } = usePostModalStore();

  if (!currentUser) return null;

  const links = sidebarLinks(currentUser);

  const handlePostClick = () => {
    openModal();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        <MobileUserButton />

        {links.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            href={item.href}
            icon={item.icon}
            activeIcon={item.activeIcon}
          />
        ))}
        <button
          onClick={handlePostClick}
          className="rounded-full bg-black text-white dark:bg-white dark:text-black w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Create Post"
        >
          <FaPlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
