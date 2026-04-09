import { customFormatDate, isValidDate } from "@/utils/methods";
import  { useState, useEffect } from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Separator } from "./separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Text from "../layout/text";
import TimePicker from "./time-picker";

const FlatDatePicker = ({
  value,
  onChange=()=>{},
  isTimePicker = false,
  setIsOpen=()=>{},
  className,
  hideOptions
}) => {
  const currentDate =  value?new Date(value):new Date()
  
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [minutes, setMinutes] = useState(currentDate.getMinutes()||'00');
  const [hours, setHours] = useState(currentDate.getHours()||'00');
  const [calendarView, setCalendarView] = useState("days"); // "days", "months", "years"
  const [yearRangeStart, setYearRangeStart] = useState(Math.floor(currentYear / 10) * 10); // Start of the 10-year range




  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0)?.getDate();
  };
  
  const generateCalendar = (currentMonth, currentYear) => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayIndex = new Date(currentYear, currentMonth, 1)?.getDay();
    const prevMonthDays = new Date(currentYear, currentMonth, 0)?.getDate();
  
    let daysArray = [];
    for (let i = 0; i < 42; i++) {
      let day, month, year;
      if (i < firstDayIndex) {
        month = currentMonth === 0 ? 11 : currentMonth - 1;
        year = currentMonth === 0 ? currentYear - 1 : currentYear;
        day = prevMonthDays - firstDayIndex + i + 1;
      } else if (i < firstDayIndex + daysInMonth) {
        day = i - firstDayIndex + 1;
        month = currentMonth;
        year = currentYear;
      } else {
        month = currentMonth === 11 ? 0 : currentMonth + 1;
        year = currentMonth === 11 ? currentYear + 1 : currentYear;
        day = i - firstDayIndex - daysInMonth + 1;
      }
      daysArray.push({ day, month: month + 1, year });
    }
  
    return daysArray;
  };
  
  const [calendarDays,setCalendarDays] = useState(
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear()),
  );

  const toggleCalendarView = (newView) => {
    const view = calendarView===newView?'days':newView
    setCalendarView(view);
  };
  const selectMonth = (month) => {
    setCurrentMonth(month) ;
    toggleCalendarView("days"); // Show days after month selection
  };
  
  const updateDateValue = (val) => {
    setIsOpen(false)
     
    onChange(val)

  };
  
  const selectDate = (date) => {
  
  
    
    updateDateValue(customFormatDate(`${date.year}-${date.month}-${date.day} ${hours}:${minutes}:00`,isTimePicker));
  };
  
  
  const prevYearRange = () => {
    setYearRangeStart((prev)=>prev-= 10) ;
  };
  
  const nextYearRange = () => {

    setYearRangeStart((prev)=>prev+= 10) ;
  };
  
  const selectYear = (year) => {
    setCurrentYear(year);
    toggleCalendarView("months"); // Show months after year selection
  };
  
  const prevMonth = () => {
    if (currentMonth === 0) {

      setCurrentYear((prev)=>prev--) ;
      setCurrentMonth(11);
   
      setCalendarDays(generateCalendar(
        currentMonth,
        currentYear,
      ));
    } else {
        setCurrentMonth((prev)=>prev--) ;
        setCalendarDays(generateCalendar(
            currentMonth,
            currentYear,
          ));
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((prev)=>prev++) ;
      setCurrentMonth(0);
  
      setCalendarDays(generateCalendar(
        currentMonth,
        currentYear,
      ));
    } else {
        setCurrentMonth((prev)=>prev++) ;
      setCalendarDays(generateCalendar(
        currentMonth,
        currentYear,
      ));
    }
  };
  
  const next = ()=>{
    if (calendarView==='years') {
      nextYearRange()
    }
    else {
      nextMonth()
    }
  
  }
  const prev = ()=>{
    if (calendarView==='years') {
      prevYearRange()
    }
     else {
      prevMonth()
    }
  
  }
  
  const selectToday = () => {
    const today = new Date();
    updateDateValue(
      customFormatDate(`${today?.getFullYear()}-${today?.getMonth() + 1}-${today?.getDate()} ${hours}:${minutes}:00`,isTimePicker),
    );
  
  };
  
  const selectTomorrow = () => {
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    updateDateValue(
      customFormatDate(`${tomorrow?.getFullYear()}-${tomorrow?.getMonth() + 1}-${tomorrow?.getDate()} ${hours}:${minutes}:00`,isTimePicker),
    );
  
  };
  
  const selectNextWeek = () => {
    const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    updateDateValue(
      customFormatDate(`${nextWeek?.getFullYear()}-${nextWeek?.getMonth() + 1}-${nextWeek?.getDate()} ${hours}:${minutes}:00`,isTimePicker),
    );
  
  };
  
  const selectNextWeekend = () => {
    const nextWeekend = new Date();
    nextWeekend.setDate(nextWeekend?.getDate() + (5 - nextWeekend?.getDay()) + 7);
    updateDateValue(
      customFormatDate(`${nextWeekend?.getFullYear()}-${nextWeekend?.getMonth() + 1}-${nextWeekend?.getDate()} ${hours}:${minutes}:00`,isTimePicker),
    );
  
  };
  
  const selectNextNWeeks = (weeks) => {
    const nextNWeeks = new Date(
      new Date().getTime() + weeks * 7 * 24 * 60 * 60 * 1000,
    );
  
    updateDateValue(
      customFormatDate(`${nextNWeeks?.getFullYear()}-${nextNWeeks?.getMonth() + 1}-${nextNWeeks?.getDate()} ${hours}:${minutes}:00`,isTimePicker),
    );
  
  };
  
  const additionalButtons = [
    {
      title: "Today",
      action: selectToday,
    },
    {
      title: "Tomorrow",
      action: selectTomorrow,
    },
    {
      title: "Next Week",
      action: selectNextWeek,
    },
    {
      title: "Next Weekend",
      action: selectNextWeekend,
    },
  ];


  
// Update calendar when year or month changes
useEffect(() => {
  if (calendarView === "days") {
    setCalendarDays(generateCalendar(currentMonth, currentYear));
  }
}, [currentYear, currentMonth]);


// Update calendar when month or year changes
useEffect(() => {

  
  const selectedDateObj = isValidDate(value)
    ? new Date(value)
    : new Date();



  const year = selectedDateObj.getFullYear();
  const month = selectedDateObj.getMonth();

  setCurrentMonth(month);
  setCurrentYear(year);

  
  setCalendarDays(generateCalendar(month, year));
}, [value]);



  const isSelectedDate=(val,date)=>{
    if (val && isValidDate(val) && date) {
  
      return customFormatDate(val) ===
      customFormatDate(`${date?.month}-${date?.day}-${date?.year}`)
    }
    return false
  }
  const isCurrentDate=(date)=>{
    if (date) {
      return customFormatDate(new Date()) ===
      customFormatDate(`${date?.month}-${date?.day}-${date?.year}`)
    }
    return false
  }
  
  
  function getShortMonthName(monthIndex) {
  
    return months[monthIndex].slice(0, 3);
  }
  
  
  function isSelectedMonth(currentMonth, month) {
    return currentMonth === month;
  }
  function isSelectedYear(currentYear, year) {
    return currentYear === year;
  }
  

  return (

    <Card
    className={cn(
        'flex flex-col justify-start items-center gap-2 py-0 px-0 border-none  w-full',
        className,
      )}
    
  >
  <div className="flex  flex-row justify-start items-center w-full h-fit">

             {
                calendarView === 'days'&&
                <>
             <CardContent
      
               className={cn('bg-bgLight-50 dark:bg-bgDark-600 min-h-full max-h-fit w-fit hidden sm:flex justify-start items-start px-0 py-0',isTimePicker&&'py-0')}
            >
                    
            {!hideOptions&&<div
 
              className="flex flex-col justify-start items-start px-3 py-2 gap-y-1"
            >
            {
                 additionalButtons.map((button)=>(

              <Button
                key={button.title}
                type="button"
                size="sm"
                variant="ghost"

                className="text-xs text-[#1D1B20] dark:text-[#E6E0E9] h-8 w-full justify-start"
                onClick={button.action}
              >
                { button.title }
              </Button>
                 ))
            }
            <Button
                variant="ghost"
                size="sm"
                 type="button"
                className="text-xs text-[#1D1B20] dark:text-[#E6E0E9] h-8 w-full justify-start"
                onClick={()=>selectNextNWeeks(2)}
              >
                2 Weeks
              </Button>
            <Button
                variant="ghost"
                size="sm"
                 type="button"
                className="text-xs text-[#1D1B20] dark:text-[#E6E0E9] h-8 w-full justify-start"
                onClick={()=>selectNextNWeeks(4)}
              >
                4 Weeks
              </Button>
            <Button
                variant="ghost"
                size="sm"
                 type="button"
                className="text-xs text-[#1D1B20] dark:text-[#E6E0E9] h-8 w-full justify-start "
                onClick={()=>selectNextNWeeks(8)}
              >
                8 Weeks
              </Button>




            </div> }
   
            </CardContent>

            <Separator orientation="vertical" />

                </>
        } 

        <CardContent
      
           className={cn('h-full w-fit py-2 px-2')}
        >
           
              <div className="flex justify-start items-center">
                <div
                  className="text-sm font-semibold px-0 flex justify-start items-center gap-0 text-[#1D1B20] dark:text-[#E6E0E9]"
                >
             

            <Button
                variant="ghost"
                size="sm"
                 type="button"
                className="text-sm text-[#1D1B20] dark:text-[#E6E0E9]"
                onClick={()=>toggleCalendarView('months')}
              >
                { months[currentMonth] }
              </Button>
            <Button
                variant="ghost"
                size="sm"
                 type="button"
                className="text-sm text-[#1D1B20] dark:text-[#E6E0E9]"
                onClick={()=>toggleCalendarView('years')}
              >
                { currentYear }
              </Button>
                </div>
                <div className="w-full" />
                <Button
                size="sm"
                 type="button"
                variant="ghost"
                className="text-sm text-[#1D1B20] dark:text-[#E6E0E9]"
                onClick={selectToday}
              >
                Today
              </Button>

              {
                calendarView !== 'months'&&
                <>
                <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
          
                <Button
                  type="button"
                  
                  variant={"ghost"}
                  size="icon"
                  className="rounded-full min-w-7 h-7"
              onClick={prev}
                >
                               <ChevronLeft  size="16" aria-hidden="true" />
                               </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Text text={"Prev"} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
                <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
           
                <Button
                  type="button"
                  variant={"ghost"}
                  size="icon"
                  className="rounded-full min-w-7 h-7"
              onClick={next}
                >
                               <ChevronRight  size="16" aria-hidden="true" />
                               </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Text text={"Next"} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
                </>

              }


              </div>
            
              {
                calendarView === 'days'&&
              <div
                className="grid grid-cols-7 text-center text-xs font-semibold uppercase"
             
              >
{                days.map((day)=>(

                <p
                 
                  key={day}
                  className="py-2 text-[#1D1B20] dark:text-[#E6E0E9]"
                >
                  { day }
                </p>
                ))}
              </div>
              }
              {
                calendarView === 'years'&&
                
              <div className="grid grid-cols-3 gap-2">
              {
                Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((year)=>(

          <button
           type="button"
            key={year}
            onClick={()=>selectYear(year)}
            className="py-1 text-[#1D1B20] dark:text-[#E6E0E9] cursor-pointer rounded-sm font-medium"
          >

            <p
                    className={cn("text-sm text-[#1D1B20] rounded-sm dark:text-[#E6E0E9] hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-2", isSelectedYear(currentYear,year)&&'bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-500 text-white  py-2 px-2 w-full')}

                  >
                  {  year }

                  </p>
          </button>
                ))
              }
        </div>
                }
                {
                    calendarView === 'months'&&

              <div className="grid grid-cols-3 gap-2 min-w-[290px]">
              {
                months.map((month, index)=>(

          <button
          type="button"
            key={month+index}
            onClick={()=>selectMonth(index)}
            className="py-1 w-full text-sm text-[#1D1B20] dark:text-[#E6E0E9] cursor-pointer  rounded-sm font-medium"
          >

            <p
                    className={cn("text-[#1D1B20] rounded-sm dark:text-[#E6E0E9] hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-2",isSelectedMonth(months[currentMonth],month)&&'bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-500 text-white  py-2 px-4 w-full')}
  
                  >
                  { getShortMonthName(index) }
                  </p>
          </button>
                ))
              }
        </div>
                }
                {
                    calendarView === 'days'&&
              <div  className="grid grid-cols-7 gap-x-1">
              {
                calendarDays.map((date, index)=>(

                <button
                  type="button"
                  key={index}
                  onClick={()=>selectDate(date)}
    
                  className={cn("w-full h-8  text-center text-sm",date.day?'cursor-pointer  rounded-sm font-medium':'text-gray-400',)}
                >
                  <p
                    className={cn("text-[#1D1B20] rounded-sm dark:text-[#E6E0E9] w-full hover:bg-gray-300 dark:hover:bg-gray-600 py-1 px-2",isSelectedDate(value,date)&& 'bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-500 text-white  ')}

                  >
                    { date.day ? date.day : "" }
                    {isCurrentDate(date)&&
                    <div className={cn('opacity-0 w-full h-[1px] bg-red-500',isCurrentDate(date)&&'opacity-100') }/>
                    }
                  </p>
                </button>
                ))
              }
              </div>
                }
         

        </CardContent>
  </div>
  {isTimePicker&&<>
  <Separator  />

  <TimePicker
                              selectedTime={value}
                              onSelectTime={(time) => {
                                onChange(    customFormatDate(time,isTimePicker))
                              }}
                            />
</>}
  </Card>
  );
};

export default FlatDatePicker;
