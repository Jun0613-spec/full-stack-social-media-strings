import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  className?: string;
  href?: string | null;
}

const UserAvatar = ({ src, className, href }: UserAvatarProps) => {
  const defaultImage = "/images/profile.png";

  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <div
      onClick={href ? handleClick : undefined}
      className={cn("size-8 rounded-full overflow-hidden", className)}
    >
      <img
        src={src || defaultImage}
        alt={"user-avatar"}
        className=" object-cover w-full h-full"
      />
    </div>
  );
};

export default UserAvatar;
