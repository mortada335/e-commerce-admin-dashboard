import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import i18n from "@/locales/i18n";

const Translation = () => {
  const { t } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng); // Store language in localStorage
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    } else if (!savedLanguage) {
      // Set Arabic as default if no language is saved
      localStorage.setItem("language", "ar");
      i18n.changeLanguage("ar");
    }
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative"
          size="icon"
          aria-haspopup="true"
        >
          <Languages size={20} />
          <span className="sr-only">Translation</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={cn(
            "",
            i18n.language === "ar" &&
              "bg-primary text-slate-100 dark:text-slate-800 hover:dark:text-slate-100 hover:text-slate-800"
          )}
          onClick={() => changeLanguage("ar")}
        >
          {t("Arabic")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "",
            i18n.language === "en" &&
              "bg-primary text-slate-100 dark:text-slate-800 hover:dark:text-slate-100 hover:text-slate-800"
          )}
          onClick={() => changeLanguage("en")}
        >
          {t("English")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Translation;
