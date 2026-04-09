import { useEffect, useState } from 'react';
import DatePicker from './date-picker';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { customFormatDate } from '@/utils/methods';
import { useTranslation } from 'react-i18next';

const CustomRangeDatePicker = (
  { fromTitle = 'from', toTitle = 'to', range, setRange, setPage = () => {} },
  className
) => {
  const [from, setFrom] = useState(range?.from || null);
  const [to, setTo] = useState(range?.to || null);

  const {t}= useTranslation()
  const [canApply, setCanApply] = useState(false);

  // Ensure "from" is never greater than "to"
  useEffect(() => {
    if (from && to && from > to) {
      setTo(from);
    }
  }, [from]);

  // Ensure both dates are valid before enabling Apply
  useEffect(() => {
    if (from && to && from <= to) {
      setCanApply(true);
    } else {
      setCanApply(false);
    }
  }, [from, to]);

  return (
    <form
      className={cn(
        'flex flex-col md:flex-row justify-start items-center gap-2 w-full md:w-fit px-0',
        className
      )}
      onSubmit={(e) => {
        e.preventDefault();
        if (canApply) {
          setRange({
            from: customFormatDate(from),
            to: customFormatDate(to),
          });

          if (setPage) {
            setPage(1);
          }
        }
      }}
    >
      <DatePicker
        title={fromTitle}
        date={from}
        setDate={setFrom}
      />
      <DatePicker
        title={toTitle}
        date={to}
        setDate={setTo}
        disabled={!from}
        minDate={from} // prevents picking a date earlier than "from" in the UI
      />
      <Button
        size="sm"
        className="flex flex-row justify-center md:justify-start items-center gap-2 w-full md:w-fit"
        type="submit"
        disabled={!canApply}
      >
        {t("Apply")}
      </Button>
    </form>
  );
};

export default CustomRangeDatePicker;
