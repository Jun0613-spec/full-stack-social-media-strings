import { HiCheckCircle } from "react-icons/hi2";

interface EndOfScrollProps {
  sectionName?: string;
}

const EndOfScroll = ({ sectionName }: EndOfScrollProps) => (
  <div className="flex flex-col items-center justify-center text-center py-8 px-4 text-neutral-500 dark:text-neutral-400">
    <HiCheckCircle className="w-6 h-6 mb-2" />
    <p className="text-sm font-medium">
      You’ve reached the end of the {sectionName}
    </p>
    <p className="text-xs mt-1">Check back later for new content.</p>
    <div className="h-10" aria-hidden />
  </div>
);

export default EndOfScroll;
