import InfiniteScroll from "react-infinite-scroll-component";
import { FaArrowUp } from "react-icons/fa6";

import PostCard from "./PostCard";

import Loader from "../Loader";

import { Post } from "@/types/prismaTypes";

import { useGetForYouFeed } from "@/hooks/posts/useGetForYouFeed";
import { useGetFollowingsFeed } from "@/hooks/posts/useGetFollowingsFeed";

interface FeedProps {
  type: string;
}

export const Feed = ({ type }: FeedProps) => {
  const {
    data: forYouData,
    fetchNextPage: fetchForYouNextPage,
    hasNextPage: hasForYouNextPage,
    refetch: refetchForYou
  } = useGetForYouFeed();
  const {
    data: followingsData,
    fetchNextPage: fetchFollowingsNextPage,
    hasNextPage: hasFollowingsNextPage,
    refetch: refetchFollowings
  } = useGetFollowingsFeed();

  const forYouPosts =
    forYouData?.pages.flatMap((page) => page.forYouFeed) ?? [];
  const followingsPosts =
    followingsData?.pages.flatMap((page) => page.followingsFeed) ?? [];

  if (type === "for_you") {
    return (
      <InfiniteScroll
        dataLength={forYouPosts.length}
        next={fetchForYouNextPage}
        hasMore={!!hasForYouNextPage}
        loader={<Loader />}
        endMessage={
          <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
            You've reached the end of the feed
          </div>
        }
        refreshFunction={refetchForYou}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        releaseToRefreshContent={
          <div className="sticky z-10 w-full">
            <div className="mx-auto max-w-2xl bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center justify-center gap-2 py-3 px-4 text-sm text-neutral-500 dark:text-neutral-400">
                <FaArrowUp className="animate-bounce" />
                <span>Release to refresh</span>
              </div>
            </div>
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        {forYouPosts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    );
  }

  return (
    <InfiniteScroll
      dataLength={followingsPosts.length}
      next={fetchFollowingsNextPage}
      hasMore={!!hasFollowingsNextPage}
      loader={<Loader />}
      endMessage={
        <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
          You've reached the end of the feed
        </div>
      }
      refreshFunction={refetchFollowings}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      releaseToRefreshContent={
        <div className="sticky z-10 w-full">
          <div className="mx-auto max-w-2xl bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-center gap-2 py-3 px-4 text-sm text-neutral-500 dark:text-neutral-400">
              <FaArrowUp className="animate-bounce" />
              <span>Release to refresh</span>
            </div>
          </div>
        </div>
      }
      scrollableTarget="scrollableDiv"
    >
      {followingsPosts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
};
