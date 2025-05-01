import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { LuSettings } from "react-icons/lu";

import UserAvatar from "@/components/UserAvatar";

import { useAuthStore } from "@/stores/authStore";

import { useLogout } from "@/hooks/auth/useLogout";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";
import UserButtonItems from "./sidebar/UserButtonItems";

const MobileUserButton = () => {
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
        className="hover:opacity-80 cursor-pointer"
      >
        <UserAvatar src={currentUser?.avatarImage} className="w-8 h-8" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute bottom-12 left-0 lg:right-auto 2xl:right-auto w-64 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 bg-white dark:bg-black">
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

export default MobileUserButton;
