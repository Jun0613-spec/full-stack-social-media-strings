import InfiniteScroll from "react-infinite-scroll-component";

import PostCard from "./PostCard";
import Loader from "../Loader";
import EndOfScroll from "../EndOfScroll";
import ReleaseToRefresh from "../ReleaseToRefresh";

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
        endMessage={<EndOfScroll sectionName="feeds" />}
        refreshFunction={refetchForYou}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        releaseToRefreshContent={<ReleaseToRefresh />}
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
      endMessage={<EndOfScroll sectionName="feeds" />}
      refreshFunction={refetchFollowings}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      releaseToRefreshContent={<ReleaseToRefresh />}
      scrollableTarget="scrollableDiv"
    >
      {followingsPosts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
};
