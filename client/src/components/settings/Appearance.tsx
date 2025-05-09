import { SystemMode } from "./SystemMode";
import { DarkMode } from "./DarkMode";
import { LightMode } from "./LightMode";

import { cn } from "@/lib/utils";

import { useTheme } from "@/providers/theme-provider";

const themeOptions: {
  id: "light" | "dark" | "system";
  label: string;
  component: React.ReactNode;
  description: string;
}[] = [
  {
    id: "light",
    label: "Light Mode",
    component: <LightMode />,
    description: "Bright theme for daytime use"
  },
  {
    id: "dark",
    label: "Dark Mode",
    component: <DarkMode />,
    description: "Easier on the eyes at night"
  },
  {
    id: "system",
    label: "System Mode",
    component: <SystemMode />,
    description: "Follows your device settings"
  }
];

const Appearance = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-1 text-neutral-900 dark:text-white">
        Appearance
      </h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Customize the app theme
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
        {themeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={cn(
              "group rounded-2xl border-2 p-2 transition-all cursor-pointer",
              theme === option.id
                ? "border-primary"
                : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
            )}
            aria-pressed={theme === option.id}
          >
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              {option.component}
            </div>
            <div className="mt-2 text-center">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                {option.label}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Appearance;
