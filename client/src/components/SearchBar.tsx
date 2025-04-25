// import { useRef, ChangeEvent, KeyboardEvent } from "react";
// import { HiSearch, HiX } from "react-icons/hi";
// import { useNavigate } from "react-router-dom";

// import { useSearch } from "@/providers/search-provider";

// const SearchBar = () => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const { query, setQuery } = useSearch();
//   const navigate = useNavigate();

//   const handleClear = () => {
//     setQuery("");
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setQuery(e.target.value);
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && query.trim()) {
//       navigate(`/search?query=${encodeURIComponent(query.trim())}`);
//     }
//   };

//   const handleSearchClick = () => {
//     if (query.trim()) {
//       navigate(`/search?query=${encodeURIComponent(query.trim())}`);
//     }
//   };

//   return (
//     <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-2 flex items-center gap-2 rounded-full focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition duration-200 w-full ">
//       <HiSearch
//         onClick={handleSearchClick}
//         className="w-4 h-4 text-neutral-500 dark:text-neutral-400 cursor-pointer"
//       />
//       <input
//         ref={inputRef}
//         type="text"
//         value={query}
//         onChange={handleChange}
//         onKeyDown={handleKeyDown}
//         placeholder="Search"
//         className="bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-700 placeholder:text-sm flex-1"
//       />
//       {query && (
//         <button
//           type="button"
//           onClick={handleClear}
//           className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition cursor-pointer"
//         >
//           <HiX className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default SearchBar;

import { useRef, useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import UserAvatar from "@/components/UserAvatar";

import Loader from "./Loader";

import { useSearchStore } from "@/stores/searchStore";

import { useSearchUsers } from "@/hooks/users/useSearchUsers";

const SearchBar = () => {
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const { query, setQuery } = useSearchStore();

  const { data, isLoading, fetchNextPage, hasNextPage } = useSearchUsers(query);

  const users = data?.pages.flatMap((page) => page.users) || [];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setDropdownVisible(value.trim().length > 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setDropdownVisible(false);
    }
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setDropdownVisible(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setDropdownVisible(false);
    inputRef.current?.focus();
  };

  const handleScroll = () => {
    const element = scrollRef.current;

    if (!element || !hasNextPage || isLoading) return;

    const isNearBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

    if (isNearBottom) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-xl" ref={dropdownRef}>
      <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-2 flex items-center gap-2 rounded-full focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition duration-200 w-full ">
        <HiSearch
          onClick={handleSearchClick}
          className="w-4 h-4 text-neutral-500 dark:text-neutral-400 cursor-pointer"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-700 placeholder:text-sm flex-1"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition cursor-pointer"
          >
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {isDropdownVisible && users.length > 0 && (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto custom-scrollbar absolute top-10 mt-2 bg-white dark:bg-neutral-800 shadow-md rounded-xl w-full max-h-80  z-50 border border-neutral-200 dark:border-neutral-800 "
        >
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                navigate(`/search?query=${encodeURIComponent(query.trim())}`);
                setDropdownVisible(false);
              }}
              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
            >
              <UserAvatar src={user.avatarImage} className="w-8 h-8" />
              <div>
                <p className="text-sm font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  @{user.username}
                </p>
              </div>
            </button>
          ))}

          {isLoading && <Loader />}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
