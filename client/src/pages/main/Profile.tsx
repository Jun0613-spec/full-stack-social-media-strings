import { useParams } from "react-router-dom";

import { useState } from "react";
import { FiCalendar } from "react-icons/fi";

import Header from "@/components/Header";
import UserAvatar from "@/components/UserAvatar";
import Button from "@/components/Button";
import Tabs from "@/components/home/Tabs";
import PostCard from "@/components/home/PostCard";

import { useAuthStore } from "@/stores/authStore";

import { useGetUserProfile } from "@/hooks/users/useGetUserProfile";

import { Post } from "@/types/prismaTypes";

import { useEditUserModalStore } from "@/stores/modals/modalStore";

const ProfilePage = () => {
  const { currentUser } = useAuthStore();
  const { openModal } = useEditUserModalStore();

  const [activeTab, setActiveTab] = useState<string>("posts");

  const { username } = useParams();
  const { data } = useGetUserProfile(username as string);

  if (!data?.user) return null;

  const user = data?.user;

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
                  className="rounded-full py-1.5 font-bold"
                  onClick={openModal}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  size="md"
                  variant="primary"
                  className="rounded-full py-1.5 font-bold"
                >
                  Follow
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

          <div className="flex items-center just text-neutral-500 datk:text-neutral-400 gap-2 mt-4">
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
              <span className="text-neutral-500">Following</span>
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
            {user.posts.length === 0 ? (
              <p className="text-center text-neutral-500 dark:text-neutral-400 mt-10">
                {currentUser?.id === user.id
                  ? "You haven’t posted anything yet."
                  : `${user.firstName} hasn’t posted anything yet`}
              </p>
            ) : (
              <>
                {user.posts.map((post: Post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                <p className="text-center text-neutral-400 dark:text-neutral-500 mt-6">
                  You’ve reached the end
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
