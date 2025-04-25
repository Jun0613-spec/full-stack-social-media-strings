import InfiniteScroll from "react-infinite-scroll-component";

import FeedItem from "./FeedItem";
import Loader from "../Loader";

import { Post } from "@/types/prismaTypes";

const generateMockPosts = (): Post[] => {
  const posts: Post[] = [];

  const imageURLs = [
    "https://plus.unsplash.com/premium_photo-1734435588155-1d6606d9b6c8?q=80&w=1667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1740347577512-08add2bd9740?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1745503261928-e3c568ab960f?q=80&w=1585&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  for (let i = 0; i < 30; i++) {
    // Randomly decide how many images this post will have (0 to 4)
    const numImages = Math.floor(Math.random() * 5);

    // Select images based on random count
    const images = [];
    for (let j = 0; j < numImages; j++) {
      // Select a random image from the imageURLs list
      const randomImage =
        imageURLs[Math.floor(Math.random() * imageURLs.length)];
      images.push(randomImage);
    }

    posts.push({
      id: i.toString(),
      user: {
        username: `user${i}`,
        firstName: `test${i}`,
        lastName: `user${i}`,
        avatarImage: `https://i.pravatar.cc/150?img=${i}` // Mock avatar
      },
      createdAt: new Date(),
      text: `This is the content of post ${i + 1}`,
      images: images, // Assign the selected images here
      _count: {
        likes: Math.floor(Math.random() * 100), // Random likes count
        replies: Math.floor(Math.random() * 20) // Random replies count
      }
    });
  }

  return posts;
};

interface FeedProps {
  type: string;
}

export const Feed = ({ type }: FeedProps) => {
  const mockPosts = generateMockPosts();

  if (type === "for_you") {
    return (
      // <InfiniteScroll
      //   dataLength={4}
      //   next={() => {}}
      //   hasMore={false}
      //   loader={<Loader />}
      //   endMessage={<h3>All Posts Loaded</h3>}
      // >
      //   {mockPosts.map((post) => (
      //     <FeedItem key={post.id} post={post} />
      //   ))}
      // </InfiniteScroll>

      <InfiniteScroll
        dataLength={1}
        next={() => {}}
        hasMore={false}
        loader={<Loader />}
        endMessage={
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            You've reached the end
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className=" divide-y divide-neutral-200 dark:divide-neutral-800">
          {mockPosts.map((post) => (
            <FeedItem key={post.id} post={post} />
          ))}
        </div>
      </InfiniteScroll>
    );
  }

  return (
    <InfiniteScroll
      dataLength={4}
      next={() => {}}
      hasMore={false}
      loader={<Loader />}
      endMessage={<h3>All Posts Loaded</h3>}
    >
      {mockPosts.map((post) => (
        <FeedItem key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
};
