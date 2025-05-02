import { User } from "@/types/prismaTypes";

import {
  HiMail,
  HiOutlineMail,
  HiOutlineSearch,
  HiSearch,
  HiHome,
  HiOutlineHome,
  HiBell,
  HiOutlineBell,
  HiOutlineUser,
  HiUser
} from "react-icons/hi";

export const sidebarLinks = (currentUser: User) => [
  {
    id: 1,
    label: "Home",
    href: "/",
    icon: HiOutlineHome,
    activeIcon: HiHome
  },
  {
    id: 2,
    label: "Search",
    href: "/search",
    icon: HiOutlineSearch,
    activeIcon: HiSearch
  },
  {
    id: 3,
    label: "Notification",
    href: "/notifications",
    icon: HiOutlineBell,
    activeIcon: HiBell
  },
  {
    id: 4,
    label: "Messages",
    href: "/messages",
    icon: HiOutlineMail,
    activeIcon: HiMail
  },
  {
    id: 5,
    label: "Profile",
    href: `/profile/${currentUser.username}`,
    icon: HiOutlineUser,
    activeIcon: HiUser
  }
];

export const MAX_FILES = 4;
