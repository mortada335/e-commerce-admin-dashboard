import { Loader2 } from "lucide-react";

import { Button } from "./button";

const ActionButton = ({
  children,
  loading = false,

  ...props
}) => {
  return (
    <Button {...props}>
      {loading ? (
        <p className="flex justify-center items-center space-x-2">
          <Loader2 className=" h-5 w-5 animate-spin" />
        </p>
      ) : (
        children
      )}
    </Button>
  );
};

export default ActionButton;
