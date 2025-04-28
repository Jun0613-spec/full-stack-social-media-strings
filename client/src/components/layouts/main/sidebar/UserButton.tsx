import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosMore, IoMdLogOut } from "react-icons/io";
import { LuSettings } from "react-icons/lu";

import UserAvatar from "@/components/UserAvatar";

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
            <UserAvatar src={currentUser?.avatarImage} className="size-10" />
            <div className="hidden 2xl:flex flex-col items-start">
              <span className="font-bold text-sm truncate max-w-[120px]">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[120px]">
                @{currentUser.username}
              </span>
            </div>
          </div>

          {/* More icon */}
          <div className="hidden 2xl:block">
            <IoIosMore size={18} />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute bottom-20 lg:bottom-16 left-2 lg:right-auto 2xl:right-auto w-52 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 bg-white dark:bg-black">
          <button
            className="w-full px-4 py-3 hover:bg-muted dark:hover:bg-neutral-900 flex items-center gap-3 text-sm"
            onClick={() => navigate("/settings")}
          >
            <LuSettings className="text-lg flex-shrink-0" />
            <span className="truncate">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 hover:bg-muted dark:hover:bg-neutral-900 flex items-center gap-3 text-sm border-t border-neutral-200 dark:border-neutral-700"
          >
            <IoMdLogOut className="text-lg flex-shrink-0" />
            <span className="truncate">Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
