import { FaPlus } from "react-icons/fa6";

import { usePostModalStore } from "@/stores/modals/posts/postModalStore";

const PostButton = () => {
  const { openModal } = usePostModalStore();

  return (
    <div className="mt-4">
      <button
        onClick={openModal}
        className="2xl:hidden rounded-full bg-black text-white dark:bg-white dark:text-black w-11 h-11 flex items-center justify-center cursor-pointer hover:opacity-80"
      >
        <FaPlus className="w-5 h-5" />
      </button>
      <button
        onClick={openModal}
        className="hidden 2xl:block rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold py-2 px-20 cursor-pointer hover:opacity-80"
      >
        Post
      </button>
    </div>
  );
};

export default PostButton;
