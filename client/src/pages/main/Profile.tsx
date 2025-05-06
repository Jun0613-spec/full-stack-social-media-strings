import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import { FiCalendar } from "react-icons/fi";

import Header from "@/components/Header";
import UserAvatar from "@/components/UserAvatar";
import Button from "@/components/Button";
import Tabs from "@/components/home/Tabs";
import PostCard from "@/components/home/PostCard";
import ReplyCard from "@/components/ReplyCard";
import Loader from "@/components/Loader";
import EndOfScroll from "@/components/EndOfScroll";
import ReleaseToRefresh from "@/components/ReleaseToRefresh";

import { useGetUserProfile } from "@/hooks/users/useGetUserProfile";
import { useGetFollowingUsers } from "@/hooks/users/useGetFollowings";
import { useToggleFollowUser } from "@/hooks/users/useToggleFollowUser";
import { useGetUserPosts } from "@/hooks/posts/useGetUserPosts";
import { useGetUserReplies } from "@/hooks/replies/useGetUserReplies";

import { useAuthStore } from "@/stores/authStore";
import { useEditUserModalStore } from "@/stores/modals/modalStore";

import { User, Post, Reply } from "@/types/prismaTypes";

const ProfilePage = () => {
  const { currentUser } = useAuthStore();
  const { openModal } = useEditUserModalStore();

  const [activeTab, setActiveTab] = useState<string>("posts");

  const { username } = useParams();

  const { data } = useGetUserProfile(username as string);
  const {
    data: userPostsData,
    fetchNextPage: fetchUserPostsNextPage,
    hasNextPage: hasUserPostsNextPage,
    refetch: refetchUserPosts
  } = useGetUserPosts(username as string);
  const {
    data: userRepliesData,
    fetchNextPage: fetchUserRepliesNextPage,
    hasNextPage: hasUserRepliesNextPage,
    refetch: refetchUserReplies
  } = useGetUserReplies(username as string);
  const { data: followingsUsers } = useGetFollowingUsers();
  const { mutate: toggleFollow } = useToggleFollowUser();

  if (!data?.user) return null;

  const user = data?.user;

  const followings = followingsUsers?.followingUsers || [];

  const userPosts =
    userPostsData?.pages.flatMap((page) => page.userProfilePosts) ?? [];

  const userReplies =
    userRepliesData?.pages.flatMap((page) => page.userProfileReplies) ?? [];

  const isFollowing = (userId: string) => {
    return followings.some((user: User) => user.id === userId);
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <Header label={`${user.firstName} ${user.lastName}`} />
      </div>

      <div className="relative">
        {/* CoverImage */}
        <div className="h-48 w-full">
          {user.coverImage ? (
            <img src={user.coverImage} className="h-full w-full object-cover" />
          ) : (
            <div className="h-48 w-full bg-neutral-300 dark:bg-neutral-600 " />
          )}
        </div>

        {/* Profile Picture and Follow Button */}
        <div className="px-4">
          <div className="flex justify-between items-end relative">
            <div className="absolute -top-16 border-4 border-white dark:border-black rounded-full">
              <UserAvatar src={user.avatarImage} className="w-32 h-32" />
            </div>
            <div className="ml-auto mt-4">
              {currentUser?.id === user.id ? (
                <Button
                  size="md"
                  variant="outline"
                  className="rounded-full py-1 font-bold"
                  onClick={openModal}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  size="md"
                  variant={isFollowing(user.id) ? "outline" : "primary"}
                  onClick={() => toggleFollow(user.id)}
                  className="rounded-full py-1 font-bold"
                >
                  {isFollowing(user.id) ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-4 pt-16 pb-4">
          <h1 className="text-xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-neutral-500">@{user.username}</p>

          {user.bio && <p className="my-3">{user.bio}</p>}

          <div className="flex items-center just text-neutral-500 dark:text-neutral-400 gap-2 mt-4">
            <FiCalendar className="w-5 h-5" />
            Joined{" "}
            {new Date(user.createdAt).toLocaleDateString("en-UK", {
              month: "long",
              year: "numeric"
            })}
          </div>

          <div className="flex gap-4 mt-3">
            <div className="flex gap-1">
              <span className="font-bold">{user._count.followings || 0}</span>
              <span className="text-neutral-500">Followings</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">{user._count.followers || 0}</span>
              <span className="text-neutral-500">Followers</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={[
            { label: "Posts", value: "posts" },
            { label: "Replies", value: "replies" }
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="pb-5">
        {activeTab === "posts" && (
          <>
            {userPosts.length === 0 ? (
              <p className="text-center text-neutral-500 dark:text-neutral-400 mt-10">
                {currentUser?.id === user.id
                  ? "You haven’t posted anything yet."
                  : `${user.firstName} hasn’t posted anything yet`}
              </p>
            ) : (
              <InfiniteScroll
                dataLength={userPosts.length}
                next={fetchUserPostsNextPage}
                hasMore={!!hasUserPostsNextPage}
                loader={<Loader />}
                endMessage={<EndOfScroll sectionName="posts" />}
                refreshFunction={refetchUserPosts}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                releaseToRefreshContent={<ReleaseToRefresh />}
                scrollableTarget="scrollableDiv"
              >
                {userPosts?.map((post: Post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </InfiniteScroll>
            )}
          </>
        )}

        {activeTab === "replies" && (
          <>
            {userReplies.length === 0 ? (
              <p className="text-center text-neutral-500 dark:text-neutral-400 mt-10">
                {currentUser?.id === user.id
                  ? "You haven't replied to any posts yet."
                  : `${user.firstName} hasn't replied to any posts yet`}
              </p>
            ) : (
              <InfiniteScroll
                dataLength={userReplies.length}
                next={fetchUserRepliesNextPage}
                hasMore={!!hasUserRepliesNextPage}
                loader={<Loader />}
                endMessage={<EndOfScroll sectionName="replies" />}
                refreshFunction={refetchUserReplies}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                releaseToRefreshContent={<ReleaseToRefresh />}
                scrollableTarget="scrollableDiv"
              >
                {userReplies?.map((reply: Reply) => (
                  <div key={reply.id}>
                    <div className="relative">
                      <PostCard post={reply.post} hasBorder />
                      <div className="absolute left-9 top-14 bottom-0 w-0.5 bg-primary/20 z-10" />
                    </div>

                    <ReplyCard reply={reply} />
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
