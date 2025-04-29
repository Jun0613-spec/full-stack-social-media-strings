import { useNavigate } from "react-router-dom";

import { LuShell } from "react-icons/lu";

const SidebarLogo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogoClick}
      className="cursor-pointer p-2 hover:bg-muted dark:hover:bg-neutral-800 rounded-full hover:scale-105 flex items-center gap-4"
    >
      <LuShell className="w-6 h-6" />
    </button>
  );
};

export default SidebarLogo;
