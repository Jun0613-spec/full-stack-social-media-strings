import { FaArrowUp } from "react-icons/fa6";

const ReleaseToRefresh = () => {
  return (
    <div className="sticky z-10 w-full">
      <div className="mx-auto max-w-2xl bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-center gap-2 py-3 px-4 text-sm text-neutral-500 dark:text-neutral-400">
          <FaArrowUp className="animate-bounce" />
          <span>Release to refresh</span>
        </div>
      </div>
    </div>
  );
};

export default ReleaseToRefresh;
