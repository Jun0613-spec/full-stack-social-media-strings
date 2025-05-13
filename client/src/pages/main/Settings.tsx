import Header from "@/components/Header";
import Appearance from "@/components/settings/Appearance";
import DangerZone from "@/components/settings/DangerZone";

const SettingsPage = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        <Header label="Settings" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <Appearance />
        <DangerZone />
      </div>
    </div>
  );
};

export default SettingsPage;
