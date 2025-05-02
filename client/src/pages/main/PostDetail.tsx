import { useRef } from "react";
import { FaArrowUp } from "react-icons/fa6";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";

import ReplyForm from "@/components/forms/ReplyForm";
import Header from "@/components/Header";
import PostCard from "@/components/home/PostCard";
import Loader from "@/components/Loader";
import ReplyCard from "@/components/ReplyCard";

import { useGetPostByPostId } from "@/hooks/posts/useGetPostByPostId";
import { useGetRepliesByPostId } from "@/hooks/replies/useGetRepliesByPostId";

const PostDetailPage = () => {
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const { postId } = useParams();

  const { data: post } = useGetPostByPostId(postId as string);
  const {
    data: repliesData,
    fetchNextPage,
    hasNextPage,
    refetch: refetchReplies
  } = useGetRepliesByPostId(postId as string);

  const replies = repliesData?.pages.flatMap((page) => page.replies) ?? [];

  if (!post) return null;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <Header label="Post" />
      </div>

      <PostCard post={post} />
      <ReplyForm postId={post.id} username={post.user.username} />

      <div
        id="scrollableDiv"
        ref={scrollableDivRef}
        className="overflow-y-auto h-screen no-scrollbar"
      >
        <InfiniteScroll
          dataLength={replies.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<Loader />}
          endMessage={
            <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
              You've reached the end of replies
            </div>
          }
          refreshFunction={refetchReplies}
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
          {replies.map((reply) => (
            <ReplyCard key={reply.id} reply={reply} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PostDetailPage;
