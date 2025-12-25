import { useState } from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "default",
  size = "md",
  className = "",
}: TabsProps) {
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-2.5",
  };

  if (variant === "pills") {
    return (
      <div className={`inline-flex bg-gray-100 rounded-xl p-1 ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative ${sizeStyles[size]} rounded-lg font-medium transition-colors
              ${activeTab === tab.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}
            `}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-lg shadow-soft"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div className={`flex border-b border-gray-200 ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative ${sizeStyles[size]} font-medium transition-colors -mb-px
              ${activeTab === tab.id ? "text-primary-600" : "text-stone-500 hover:text-stone-700"}
            `}
          >
            <span className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex gap-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            ${sizeStyles[size]} rounded-lg font-medium transition-all
            ${
              activeTab === tab.id
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          <span className="flex items-center gap-2">
            {tab.icon}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// Tab Content wrapper with animation
interface TabContentProps {
  children: React.ReactNode;
  tabId: string;
  activeTab: string;
  className?: string;
}

export function TabContent({
  children,
  tabId,
  activeTab,
  className = "",
}: TabContentProps) {
  if (tabId !== activeTab) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Controlled Tabs component (combines tabs and content)
interface ControlledTabsProps {
  tabs: Array<Tab & { content: React.ReactNode }>;
  defaultTab?: string;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
  contentClassName?: string;
}

export function ControlledTabs({
  tabs,
  defaultTab,
  variant = "default",
  size = "md",
  className = "",
  contentClassName = "",
}: ControlledTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={className}>
      <Tabs
        tabs={tabs.map(({ id, label, icon }) => ({ id, label, icon }))}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant={variant}
        size={size}
      />
      <div className={`mt-4 ${contentClassName}`}>
        {tabs.map((tab) => (
          <TabContent key={tab.id} tabId={tab.id} activeTab={activeTab}>
            {tab.content}
          </TabContent>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
