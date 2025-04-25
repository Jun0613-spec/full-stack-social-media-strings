import Button from "@/components/Button";
import { useTheme } from "@/providers/theme-provider";

const AdCard = () => {
  const { theme } = useTheme();

  return (
    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 ">
      <h1 className="font-bold text-lg">Sponsored Ads</h1>

      <div className="flex flex-col mt-6 gap-2">
        <div className="flex items-center justify-center w-full h-52 rounded-2xl bg-neutral-100 dark:bg-neutral-900">
          <img
            src={
              theme === "light" ? "/images/ad-light.svg" : "/images/ad-dark.svg"
            }
            alt="Ad Placeholder"
            width={120}
            height={120}
            className="object-cover"
          />
        </div>

        <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 mt-2">
          Reach thousands of users by advertising on Strings. Start today!
        </p>

        <Button
          className="mt-4 flex items-center justify-center"
          variant="primary"
          size="sm"
        >
          <a href="mailto:kumo5110@gmail.com?subject=Advertising%20Inquiry">
            Advertise with us
          </a>
        </Button>
      </div>
    </div>
  );
};

export default AdCard;
