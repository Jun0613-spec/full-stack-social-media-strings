import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useMatch, useNavigate } from "react-router-dom";

import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

import { useReplyModalStore } from "@/stores/modals/replies/replyModalStore";

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { openModal } = useReplyModalStore();

  const handleBackClick = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === "/";
  const isPostDetailPage = useMatch("/:username/post/:postId");

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        {!isHomePage && (
          <Button onClick={handleBackClick} variant="ghost" size="icon">
            <FaArrowLeftLong className=" dark:text-neutral-400" />
          </Button>
        )}

        <h1 className="text-xl font-semibold text-foreground">{label}</h1>
      </div>
      <div className="flex items-center gap-4">
        {isPostDetailPage && (
          <Button
            onClick={() => openModal(isPostDetailPage.params.postId as string)}
            variant="primary"
            size="sm"
            className="rounded-full py-1"
          >
            Reply
          </Button>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
