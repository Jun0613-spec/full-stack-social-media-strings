import { Link, useNavigate } from "react-router-dom";

import UserAvatar from "@/components/UserAvatar";
import Button from "@/components/Button";
import Loader from "@/components/Loader";

import { useGetSuggestedUsers } from "@/hooks/users/useGetSuggestedUsers";
import { useGetFollowingUsers } from "@/hooks/users/useGetFollowings";
import { useToggleFollowUser } from "@/hooks/users/useToggleFollowUser";

import { User } from "@/types/prismaTypes";

const SuggestedUsersCard = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetSuggestedUsers();
  const { data: followingsUsers } = useGetFollowingUsers();
  const { mutate: toggleFollow } = useToggleFollowUser();

  const users = data?.suggestedUsers ?? [];
  const followings = followingsUsers?.followingUsers || [];

  const isFollowing = (userId: string) => {
    return followings.some((user: User) => user.id === userId);
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <Loader />
      </div>
    );
  }

  const hasSuggestionUsers = users.length > 0;

  return (
    <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col gap-4">
      {!hasSuggestionUsers ? (
        <div className="flex flex-col items-center justify-center  py-8 ">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No suggested users at the moment.
          </p>
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <Link
              to={`/profile/${user.username}`}
              className="flex items-center gap-2 flex-1 cursor-pointer"
            >
              <UserAvatar src={user.avatarImage} className="w-10 h-10" />
              <div className="flex flex-col items-start">
                <h1 className="text-sm font-bold hover:underline">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                  @{user.username}
                </span>
              </div>
            </Link>

            <Button
              variant={isFollowing(user.id) ? "outline" : "primary"}
              size="sm"
              onClick={() => toggleFollow(user.id)}
              className="rounded-full font-semibold"
            >
              {isFollowing(user.id) ? "Following" : "Follow"}
            </Button>
          </div>
        ))
      )}

      {hasSuggestionUsers && (
        <Button
          variant="muted"
          size="sm"
          onClick={() => navigate("/search")}
          className="flex items-center justify-start mt-2"
        >
          Show more
        </Button>
      )}
    </div>
  );
};

export default SuggestedUsersCard;
