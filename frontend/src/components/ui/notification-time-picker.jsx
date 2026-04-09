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
import { cn } from "@/lib/utils";
import { isNumber } from "@/utils/methods";

const TimePicker = ({ selectedTime, onSelectTime, minTime }) => {
  const initialTime = new Date(selectedTime);
  const initialHours = initialTime.getHours() % 12 || 12; // Get hours in 12-hour format
  const initialMinutes = initialTime.getMinutes()
    
  // const initialMinutes = () => {
  //   const minutes = initialTime.getMinutes();
  //   const predefinedMinutes = [0, 15, 30, 45];
  
  //   // Find the closest value in predefinedMinutes to the actual minutes
  //   return predefinedMinutes.reduce((prev, curr) =>
  //     Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev
  //   );
  // };
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

    if (!isNaN(newHours) &&  newHours <= 12) {
      setHours(newHours);
    }
  };

  const handleMinuteChange = (value) => {
    const newMinutes = Number(value);

    if (!isNaN(newMinutes) && newMinutes >= 0 && newMinutes <= 59) {
      setMinutes(newMinutes);
    }
  };

  return (
    <div className="flex justify-center items-center py-2 px-4 space-x-1">
      <Input
        className={cn("px-2 py-1 w-14",(!isNumber(hours)|| (!hours >= 1 && !hours <= 12))&&'!ring-red-500')}
        type="text"
        value={hours}
        onChange={handleHourChange}
      />
      <span className="text-lg">:</span>
      {/* <Input
        className="px-2 py-1 w-14"
        type="number"
        min={0}
        max={59}
        value={minutes}
        onChange={handleMinuteChange}
      /> */}

      <Select
        onValueChange={(value) => {
          handleMinuteChange(value);
        }}
        defaultValue={minutes}
        value={minutes}
      >
        <SelectTrigger className="w-fit px-2 py-1">
          <SelectValue placeholder="0" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={0}>0</SelectItem>
            <SelectItem value={5}>5</SelectItem>
            <SelectItem value={10}>10</SelectItem>
            <SelectItem value={15}>15</SelectItem>
            <SelectItem value={20}>20</SelectItem>
            <SelectItem value={25}>25</SelectItem>
            <SelectItem value={30}>30</SelectItem>
            <SelectItem value={35}>35</SelectItem>
            <SelectItem value={40}>40</SelectItem>
            <SelectItem value={45}>45</SelectItem>
            <SelectItem value={50}>50</SelectItem>
            <SelectItem value={55}>55</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
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
