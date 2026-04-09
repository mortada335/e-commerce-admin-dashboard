import { cn } from "@/lib/utils";

const Text = ({ className, text }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{text}</p>
  );
};

export default Text;
