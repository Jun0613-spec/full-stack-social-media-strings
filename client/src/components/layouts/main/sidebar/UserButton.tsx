import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { LuSettings } from "react-icons/lu";

import UserAvatar from "@/components/UserAvatar";

import UserButtonItems from "./UserButtonItems";

import { useAuthStore } from "@/stores/authStore";

import { useLogout } from "@/hooks/auth/useLogout";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";

const UserButton = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuthStore();
  const { mutate: logout } = useLogout();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useHandleOutsideClick({
    isOpen: isDropdownOpen,
    onClose: () => setIsDropdownOpen(false)
  });

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full p-2 rounded-full hover:bg-muted dark:hover:bg-neutral-800 cursor-pointer"
      >
        <div className="flex items-center justify-between w-full">
          {/* Avatar + User Info */}
          <div className="flex items-center gap-3">
            <UserAvatar src={currentUser?.avatarImage} className="w-10 h-10" />
            <div className="hidden 2xl:flex flex-col items-start">
              <span className="font-bold text-sm truncate max-w-[120px]">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[120px]">
                @{currentUser.username}
              </span>
            </div>
          </div>

          <div className="hidden 2xl:block">
            <HiDotsHorizontal size={18} />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute bottom-14 left-2 lg:right-auto 2xl:right-auto w-64 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50 bg-white dark:bg-black">
          <UserButtonItems
            icon={LuSettings}
            label="Settings"
            onClick={() => navigate("/settings")}
          />

          <UserButtonItems
            icon={IoMdLogOut}
            label="Logout"
            onClick={handleLogout}
            className="border-t border-neutral-200 dark:border-neutral-700"
          />
        </div>
      )}
    </div>
  );
};

export default UserButton;
