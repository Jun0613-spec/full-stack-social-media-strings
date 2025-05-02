import ReplyForm from "@/components/forms/ReplyForm";
import Header from "@/components/Header";
import PostCard from "@/components/home/PostCard";
import ReplyCard from "@/components/ReplyCard";
import { useGetPostByPostId } from "@/hooks/posts/useGetPostByPostId";

import { useParams } from "react-router-dom";

const PostDetailPage = () => {
  const { postId } = useParams();
  const { data: post } = useGetPostByPostId(postId as string);

  if (!post) return null;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <Header label="Post" />
      </div>

      <PostCard post={post} />
      <ReplyForm postId={post.id} username={post.user.username} />
      {post.replies?.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} />
      ))}
    </div>
  );
};

export default PostDetailPage;
