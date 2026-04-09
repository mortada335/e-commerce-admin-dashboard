import React from "react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import i18n from "@/locales/i18n";

// Utility function to create localized summary items
export const createLocalizedSummaryItems = (items,) => {
  return items.map(item => ({
    ...item,
    label: item.label, // The label will be translated via t() in the component
  }));
};

// Default summary items configuration
const DEFAULT_SUMMARY_ITEMS = [
  {
    key: "total_cities",
    label: i18n.t("Total Cities"),
    value: 0,
    color: "gray",
    icon: (
<svg className="w-4 h-4 sm:w-5 sm:h-5" fill xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2-icon lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
    ),
    formatValue: (value) => value,
    valueColor: "text-gray-900 dark:text-gray-100"
  },
  {
    key: "total_orders",
    label: i18n.t("Total Orders"),
    value: 0,
    color: "blue",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    formatValue: (value) => value,
    valueColor: "text-slate-900 dark:text-slate-100"
  },
  {
    key: "highest_city",
    label: i18n.t("Highest City"),
    value: 0,
      color: "green",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    formatValue: (value) => <p>{i18n.t(value.name)} ({value.order_count})</p>,
    valueColor: "text-green-600 dark:text-green-400"
  },
  {
    key: "highest_area",
    label: i18n.t("Highest Area"),
    value: 0,
       color: "emerald",
   icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    formatValue: (value) => <p>{value.name} ({value.order_count})</p>,
    valueColor: "text-emerald-600 dark:text-emerald-400"
  },

];

// Color mapping for dynamic styling
const COLOR_CLASSES = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400"
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400"
  },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400"
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400"
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600 dark:text-orange-400"
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400"
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400"
  },
  indigo: {
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    text: "text-indigo-600 dark:text-indigo-400"
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    text: "text-pink-600 dark:text-pink-400"
  },
  gray: {
    bg: "bg-gray-100 dark:bg-gray-900/30",
    text: "text-gray-600 dark:text-gray-400"
  }
};

const SummaryCard = ({ item, }) => {
  const colorClasses = COLOR_CLASSES[item.color] || COLOR_CLASSES.blue;
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 dark:border-slate-700 w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
            {i18n.t(item.label)}
          </p>
          <p className={`text-sm sm:text-lg font-bold ${item.valueColor} truncate`}>
            {item.formatValue(item.value)}
          </p>
        </div>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClasses.bg} rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
          <div className={`${colorClasses.text} w-4 h-4 sm:w-5 sm:h-5`}>
            {item.icon}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportsSummary = ({ 
  summary, 
  title = i18n.t("Orders Summary Statistics"),
  showLastUpdated = true,
  customItems = null,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ",
  className = "",
  cardClassName = "",
  date
}) => {

  
  if (!summary) return null;

  // Use custom items if provided, otherwise use default items with summary data
  const summaryItems = customItems || DEFAULT_SUMMARY_ITEMS.map(item => ({
    ...item,
    value: summary[item.key] || 0
  }));

  return (
    <Card className={`p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0 w-full ${cardClassName}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rtl:flex-row-reverse mb-4 sm:mb-6 gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <div className="w-2 h-6 sm:h-8 bg-blue-500 rounded-full"></div>
          {title}
        </h3>
        {showLastUpdated && (
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {i18n.t("Date")}: {date?.from} - {date?.to}
          </div>
        )}
      </div>
      <div className={`grid ${gridCols} gap-3 sm:gap-4 w-full ${className}`}>
        {summaryItems.map((item, index) => (
          <SummaryCard key={item.key || index} item={item} />
        ))}
      </div>
    </Card>
  );
};

export default ReportsSummary; 