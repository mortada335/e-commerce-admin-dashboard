import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

import { Input } from "./input";

const TimePicker = ({ selectedTime, onSelectTime, minTime }) => {
  const initialTime = new Date(selectedTime);
  const initialHours = initialTime.getHours() % 12 || 12; // Get hours in 12-hour format
  const initialMinutes = initialTime.getMinutes();
  const initialAmPm = initialTime.getHours() >= 12 ? "PM" : "AM";

  const [hours, setHours] = useState(initialHours || 0);
  const [minutes, setMinutes] = useState(initialMinutes || 0);
  const [ampm, setAmPm] = useState(initialAmPm);

  // Update onSelectTime when hours, minutes, or ampm change
  useEffect(() => {
    if (!selectedTime) return;
    // Create a new Date object based on selectedTime
    const newTime = new Date(selectedTime);

    // Adjust hours based on AM or PM selection
    if (ampm === "PM" && hours < 12) {
      newTime.setHours(hours + 12);
    } else if (ampm === "AM" && hours === 12) {
      newTime.setHours(0);
    } else {
      newTime.setHours(hours);
    }

    // Set minutes.
    newTime.setMinutes(minutes);

    // Call onSelectTime with the updated time.
    onSelectTime(newTime);
    // Ensure the newTime is not earlier than minTime
    if (minTime && newTime < minTime) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, minutes, ampm]);

  const handleHourChange = (e) => {
    const newHours = Number(e.target.value);

    if (!isNaN(newHours) && newHours >= 1 && newHours <= 12) {
      setHours(newHours);
    }
  };

  const handleMinuteChange = (e) => {
    const newMinutes = Number(e.target.value);

    if (!isNaN(newMinutes) && newMinutes >= 0 && newMinutes <= 59) {
      setMinutes(newMinutes);
    }
  };

  return (
    <div className="flex justify-center items-center py-2 px-4 space-x-1">
      <Input
        className="px-2 py-1 w-14"
        type="number"
        min={1}
        max={12}
        value={hours}
        onChange={handleHourChange}
      />
      <span className="text-lg">:</span>
      <Input
        className="px-2 py-1 w-14"
        type="number"
        min={0}
        max={59}
        value={minutes}
        onChange={handleMinuteChange}
      />

      <Select
        onValueChange={(value) => {
          setAmPm(value);
        }}
        defaultValue={ampm}
      >
        <SelectTrigger className="w-fit px-2 py-1">
          <SelectValue placeholder="PM or AM" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimePicker;
