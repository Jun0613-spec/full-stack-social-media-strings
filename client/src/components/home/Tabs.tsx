import { cn } from "@/lib/utils";

import Button from "../Button";

interface TabsProps {
  tabs: {
    label: string;
    value: string;
  }[];
  active: string;
  onChange: (value: string) => void;
}

const Tabs = ({ tabs, active, onChange }: TabsProps) => {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800">
      {tabs.map((tab) => (
        <Button
          size="md"
          variant="ghost"
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative flex-1 font-semibold text-sm cursor-pointer p-4 rounded-none",
            active === tab.value
              ? "text-foreground dark:text-foreground "
              : "text-muted-foreground dark:text-muted-foreground"
          )}
        >
          <div className="relative inline-block">
            {tab.label}
            {active === tab.value && (
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-neutral-800 dark:bg-neutral-200 rounded-full" />
            )}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
