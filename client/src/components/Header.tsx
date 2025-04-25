import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === "/";

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        {!isHomePage && (
          <Button onClick={handleBackClick} variant="ghost" size="icon">
            <FaArrowLeftLong />
          </Button>
        )}

        <h1 className="text-xl font-semibold text-foreground">{label}</h1>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Header;
