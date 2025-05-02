import { Link } from "react-router-dom";

import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import UserAvatar from "@/components/UserAvatar";

import { useGetFollowingUsers } from "@/hooks/users/useGetFollowings";
import { useToggleFollowUser } from "@/hooks/users/useToggleFollowUser";
import { useSearchUsers } from "@/hooks/users/useSearchUsers";

import { User } from "@/types";

import { useSearchStore } from "@/stores/searchStore";
import { useAuthStore } from "@/stores/authStore";

const SearchPage = () => {
  const { query } = useSearchStore();
  const { currentUser } = useAuthStore();

  const { data, isLoading } = useSearchUsers(query);
  const { data: followingsUsers } = useGetFollowingUsers();
  const { mutate: toggleFollow } = useToggleFollowUser();

  const users = data?.pages.flatMap((page) => page.searchUsers) || [];

  const followings = followingsUsers?.followingUsers || [];

  const isFollowing = (userId: string) => {
    return followings.some((user: User) => user.id === userId);
  };

  return (
    <div className="p-4">
      <SearchBar />

      <div className="mt-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {users.map((user: User, index: number) => (
              <div key={user.id}>
                <div className="flex items-center justify-between py-4 cursor-pointer">
                  <Link
                    to={`/profile/${user.username}`}
                    className="flex items-start gap-2"
                  >
                    <UserAvatar src={user.avatarImage} className="w-12 h-12" />
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <h1 className="text-sm font-bold truncate hover:underline">
                          {user.firstName} {user.lastName}
                        </h1>
                      </div>
                      <span className="text-neutral-500 dark:text-neutral-400 text-sm truncate">
                        @{user.username}
                      </span>
                      <p className="text-sm mt-1 line-clamp-2">{user.bio}</p>
                      <div className="flex  items-center gap-2">
                        <span className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                          {user._count?.followings.toLocaleString()} followings
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                          {user._count?.followers.toLocaleString()} followers
                        </span>
                      </div>
                    </div>
                  </Link>

                  {user.id !== currentUser?.id && (
                    <Button
                      variant={isFollowing(user.id) ? "outline" : "primary"}
                      size="sm"
                      onClick={() => toggleFollow(user.id)}
                      className="rounded-full font-semibold"
                    >
                      {isFollowing(user.id) ? "Following" : "Follow"}
                    </Button>
                  )}
                </div>
                {index < users.length - 1 && (
                  <div className="border-[0.5px] border-neutral-200 dark:border-neutral-800" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
