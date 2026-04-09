import ShaghlatyImagePlaceholder from "@/assets/images/for-signin.png"
import { format, parseISO, add } from "date-fns"

import Cookies from "js-cookie"
import { ChevronRight } from "lucide-react"
import { toast } from "sonner"
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";


import * as XLSX from "xlsx"
import { baghdadAreas, iraqCities } from "@/pages/orders/store"
import i18n from "@/locales/i18n"

export function parseCsvStringToJson(csvString) {
  const lines = csvString?.trim()?.split("\n")
  const headers = lines?.at(0)?.split(",")

  return lines?.slice(1)?.map((line) => {
    const values = line?.split(",")
    const rowObject = {}
    headers?.forEach((header, index) => {
      rowObject[header] = values[index]
    })
    return rowObject
  })
}




export function exportToExcel(data, fileName = "ExportedData.xlsx") {
  // Convert JSON data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Create a new workbook and add the worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

  // Export the workbook to an .xlsx file
  XLSX.writeFile(workbook, fileName)
}

export function setValueInCookie(name, value, maxAge) {
  Cookies.set(name, value, {
    expires: maxAge, // Cookie expiration in days
    secure: true, // Set to true if using HTTPS
    sameSite: "Strict", // Prevent CSRF
  })
}

export function getCookieValue(name) {
  return Cookies.get(name)
}

export function deleteCookieValue(name) {
  Cookies.remove(name, { path: "/" })
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatDateWithTime(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export const displayBasicDateParseISO = (value) => {
  const date = new Date(value)
  const parsedDate = parseISO(date)
  return format(parsedDate, "yyyy-MM-dd HH:mm:ss a")
}

export const displayBasicDate = (timestamp) => {
  // split it to remove empty spaces

  if (timestamp) {
    // const splitedTimestamp = timestamp?.split()

    const dateOb = new Date(timestamp)

    // get the year
    const year = dateOb?.getUTCFullYear()

    // get the month ** this function return the previous month so always i increas it by 1 to fit with our local date standers
    const month = dateOb?.getUTCMonth() + 1

    // get the day
    const day = dateOb?.getUTCDate()
    const hours = dateOb?.getHours()
    const minutes = dateOb?.getMinutes()

    const isPM = hours >= 12 // Check if it's PM or AM
    const displayHours = (hours % 12 || 12)?.toString()?.padStart(2, "0") // Convert to 12-hour format and pad with leading zero if needed
    const displayMinutes = minutes?.toString().padStart(2, "0") // Ensure minutes are displayed with leading zero if needed

    // return the basic date format
    const basicDate = `${year}-${month}-${day} ${displayHours}:${displayMinutes} ${
      isPM ? "PM" : "AM"
    }`

    return basicDate
  } else {
    return ""
  }
}
export function updateTimestamp(originalTimestamp) {
  // Parse the original timestamp
  const originalDate = new Date(originalTimestamp)

  // Calculate the new timestamp
  const updatedDate = new Date(
    originalDate.getTime() + 11 * 3600000 + 58 * 60000 + 11.678994 * 1000
  )

  // Convert the updated date to ISO 8601 format with milliseconds and UTC timezone
  const updatedTimestamp = updatedDate.toISOString()

  return updatedTimestamp
}

export const formatDateToISO = (dateString) => {
  const dt = new Date(dateString)
  const tzOffset = dt.getTimezoneOffset() * 60000 // offset in milliseconds
  const localISOTime = new Date(dt - tzOffset).toISOString().slice(0, -1)
  return localISOTime
}
export const formatDateToISOWithoutZ = (dateString) => {
  const dt = new Date(dateString)
  const isoFormat = dt.toISOString()
  const isoWithoutZ = isoFormat.slice(0, -1) // Remove the last character 'Z'
  return isoWithoutZ
}
export function formatFullDate(date = "") {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }

  if (date && Date.parse(date)) {
    // Check if date is not empty and can be parsed
    const formattedDate = new Intl.DateTimeFormat("en-UK", options)?.format(
      new Date(date)
    )
    return formattedDate.replace(/\//g, "-")
  } else {
    return ""
  }
}

export function formatFullDateNoTime(date = "") {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }

  if (date && Date.parse(date)) {
    // Check if date is not empty and can be parsed
    const formattedDate = new Intl.DateTimeFormat("en-US", options)?.format(
      new Date(date)
    )
    return formattedDate.replace(/\//g, "-")
  } else {
    return ""
  }
}

export const calculateEndDate = (createdAt, daysToExpireAfterAdded) => {
  // Parse the created_at date using date-fns

  if (createdAt) {
    try {
      if (daysToExpireAfterAdded === 2147483647) {
        return "never expires"
      }

      // Parse the created_at date using date-fns
      const startDate = parseISO(createdAt)

      // Calculate number of years and remaining days
      const years = Math.floor(daysToExpireAfterAdded / 365)
      const remainingDays = daysToExpireAfterAdded % 365

      // Add years and then remaining days
      let resultDate = add(startDate, { years })
      resultDate = add(resultDate, { days: remainingDays })

      // Format the resulting date as needed (e.g., 'yyyy-MM-dd HH:mm:ss')
      return displayBasicDate(resultDate)
    } catch (error) {
      console.error("Error calculating end date:", error)
      return "Invalid Date"
    }
  } else {
    return ""
  }
}

// Helper function to check permissions
export const checkPermissions = (userPermissions, requiredPermissions) => {
  if (requiredPermissions.length === 0) {
    return false // Allow access when no specific permissions are required
  }
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  )
}
// checks if user has at least one of requiredPermissions
export const checkOnePermissions = (
  userPermissions,
  requiredPermissions = []
) => {
  // no requirements
  if (!requiredPermissions.length) {
    return false;
  }
  // or logic
  return requiredPermissions?.some((perm) =>
    userPermissions.includes(perm)
  );
};

export const ImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
export const VideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov", "video/mkv"];


export const avatarText = (value) => {
  if (!value) return ""
  const nameArray = value.split(" ")

  return nameArray.map((word) => word.charAt(0).toUpperCase()).join("")
}

export const appIconPlatforms = [
  {
    label:'Android',
    value:'1',
  },
  {
    label:'IOS',
    value:'2',
  },
  {
    label:'Both',
    value:'3',
  },
]

export const resolveAppIconPlatform = (platform) => {
  const platformNumber = Number(platform)

  switch (platformNumber) {
    case 1:
      return "Android"
    case 2:
      return "IOS"
    case 3:
      return "Both"

    default:
      return i18n.t("Unknown")
  }
}
export const convertStatusIdToString = (statusId) => {
  const statusNumber = Number(statusId)

  switch (statusNumber) {
    case 1:
      return "Pending"
    case 5:
      return "Completed"
    case 7:
      return "Cancelled Order"
    case 11:
      return "Refunded"
    case 20:
      return "Cashless Pending"
    case 21:
      return "Failed Payment"
    case 25:
      return "Whatsapp Completed"
    case 30:
      return "Preparing"
    case 31:
      return "Ready To Pickup"
    default:
      return "Unknown"
  }
}
export const convertStringToStatusId = (status) => {
  switch (status) {
    case "Pending":
      return 1
    case "Completed":
      return 5
    case "Cancelled Order":
      return 7
    case "Refunded":
      return 11
    case "Cashless Pending":
      return 20
    case "Failed Payment":
      return 21
    case "Whatsapp Completed":
      return 25
    case "Preparing":
      return 30
    case "Ready To Pickup":
      return 31
    default:
      return 1
  }
}

export const convertProductStatusStringToId = (statusString) => {
  switch (statusString) {
    case "NEW":
      return 0
    case "PROMOTED":
      return 1
    case "FEATURED":
      return 2
    case "DISCOUNT":
      return 3

    case "NONE":
      return 4

    default:
      return 4
  }
}

//[ 0, 1, 2, 3, 4 ]

export const convertProductStatusIdToString = (statusId) => {
  const statusNumber = Number(statusId)
  switch (statusNumber) {
    case 0:
      return "NEW"
    case 1:
      return "PROMOTED"
    case 2:
      return "FEATURED"
    case 3:
      return "DISCOUNT"
    case 4:
      return "NONE"

    default:
      return "NONE"
  }
}

export const giveMeDefaultFile = async (url = ShaghlatyImagePlaceholder) => {
  try {
    // Fetch the image data
    const response = await fetch(url)

    // Get the image blob
    const blob = await response.blob()

    // Create a new File object
    const file = new File([blob], "image.png", { type: "image/png" })

    return file
  } catch (error) {
    console.error("Error converting image to File:", error)
    return null
  }
}

// Min and max digits added as args, two detrmine how many digits you want to format to. It's 0 by default.
export function formatNumberWithCurrency(
  numberString,
  currencySymbol="IQD",
  minDigits = 0,
  maxDigits = 0
) {
  // Convert the string to a number
  const number = parseFloat(numberString)

  // Check if the number is valid
  if (isNaN(number)) {
    return "Invalid number"
  }

  // Convert the number to a formatted string with commas
  const formattedNumber = number.toLocaleString("en-US", {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  })

  // Append the currency symbol
  const formattedNumberWithCurrency = `${formattedNumber} ${currencySymbol}`

  return formattedNumberWithCurrency
}


export const isNumber = (value) => {
  // Check if the input is a valid string or number with only digits
  const isNumericString = typeof value === 'string' && /^[0-9]+$/.test(value);

  // Convert to number if it's a valid numeric string or is already a number
  const num = isNumericString ? Number(value) : value;

  // Validate the number is safe and within the range
  const isValidNumber =
    typeof num === 'number' &&
    !isNaN(num) &&
    isFinite(num) &&
    Number.isSafeInteger(num) &&
    num >= 0 &&
    num <= 2147483647;

  return isValidNumber;
};

export function formatNumber(num) {
  return Number(num) === 0 ? 0 : num;
}

export const customFormatDate = (value,includeTime=false) => {
  if (!value)
    // Checking if the value is falsy
    return value; // Return the value if it's falsy

  const date = new Date(value);

  // Ensure the date is valid
  if (isNaN(date.getTime()))
    return "Invalid date";

  // Format the date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return includeTime?`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`:`${year}-${month}-${day}`;
};


export const isValidDate = (value) => {
  let date;

  // If the value is a Date object, use it directly
  if (value instanceof Date) {
    date = value;
  }
  // If the value is a string, attempt to parse it
  else if (typeof value === "string") {
    // Normalize the string by replacing common separators with '/'
    const normalizedValue = value.replace(/[-.]/g, "/");

    // Ensure the string looks like a valid date or datetime format
    const dateTimeRegex = /^\d{4}\/\d{1,2}\/\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?$/;
    if (!dateTimeRegex.test(normalizedValue)) {
      return false;
    }

    date = new Date(normalizedValue);

    // Additional validation: Ensure the date parts match the original input
    const [datePart, timePart] = normalizedValue.split(" ");
    const dateParts = datePart.split("/");
    if (dateParts.length === 3) {
      const [year, month, day] = [parseInt(dateParts[0]), parseInt(dateParts[1]), parseInt(dateParts[2])];

      if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
      ) {
        return false;
      }
    }

    if (timePart) {
      const timeParts = timePart.split(":");
      if (timeParts.length >= 2) {
        const [hours, minutes, seconds] = timeParts.map((t) => parseInt(t, 10));

        if (
          hours !== date.getHours() ||
          minutes !== date.getMinutes() ||
          (seconds !== undefined && seconds !== date.getSeconds())
        ) {
          return false;
        }
      }
    }
  }
  // If the value is neither a Date object nor a string, it's invalid
  else {
    return false;
  }

  // Check if the parsed date is valid
  if (isNaN(date.getTime())) {
    return false;
  }

  return true;
};

export function handleError(error) {
  // Handle the error
  if (error.response?.status !== 500) {
    // Check if errors are provided and handle the error messages accordingly
    if (error.response?.data?.errors) {
      // Iterate through the error object to show messages
      Object.entries(error.response?.data?.errors).forEach(([key, values]) => {
        // If there are multiple messages, show them all
        if (Array.isArray(values)) {
          values.forEach(value => toast(value || "Failed!!!"));
        } else {
          toast(values || "Failed!!!");
        }
      });
    } else if (typeof error.response?.data === "object") {
      Object.entries(error.response?.data).forEach(([key, value]) =>
        toast(`${key}: ${value}` || "Failed!!!")
      );
    } else {
      toast(error.response?.data?.message || "Failed!!!");
    }
  } else if (error.code === "ERR_NETWORK") {
    toast("Network error, please try again");
  } else {
    toast("An unknown error occurred. Please try again later");
  }
}


export function generateFormattedCode({
  maxLength = 17,
  groupLength = 5,
  separator = '-',
  charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
} = {}) {
  const separatorLength = separator.length;
  const groupPlusSep = groupLength + separatorLength;

  // Calculate how many full groups fit within maxLength
  const groupsCount = Math.floor((maxLength + separatorLength) / groupPlusSep);

  // Calculate total characters needed
  const totalChars = groupsCount * groupLength;

  // Generate random characters
  let code = '';
  const randomValues = new Uint8Array(totalChars);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < totalChars; i++) {
    const randIndex = randomValues[i] % charset.length;
    code += charset[randIndex];
  }

  // Insert separator
  const regex = new RegExp(`.{1,${groupLength}}`, 'g');
  return code.match(regex).join(separator);
}

export function formatText(text) {
  return text
    .split("?")[0] // Remove everything after '?'
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\./g, " ") // Remove periods
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}



export function formatStringToDate(raw, format = "YYYY-MM-DD HH:mm:ss") {
  if (!/^\d{8}(\d{6})?$/.test(raw)) {
    throw new Error("Invalid input. Expected 'YYYYMMDD' or 'YYYYMMDDHHMMSS'.");
  }

  const year = raw.substring(0, 4);
  const month = raw.substring(4, 6);
  const day = raw.substring(6, 8);

  const hasTime = raw.length === 14;
  const hour = hasTime ? raw.substring(8, 10) : null;
  const minute = hasTime ? raw.substring(10, 12) : null;
  const second = hasTime ? raw.substring(12, 14) : null;

  const datePart = `${year}-${month}-${day}`;
  const timePart = hasTime ? `${hour}:${minute}:${second}` : "";

  switch (format) {
    case "YYYY-MM-DD":
      return datePart;
    case "YYYY-MM-DD HH:mm:ss":
      return hasTime ? `${datePart} ${timePart}` : datePart;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}` + (hasTime ? ` ${timePart}` : "");
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}` + (hasTime ? ` ${timePart}` : "");
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}



export const handleShare = (itemId,route='category/category&category_id') => {
  const shareLink = `${import.meta.env.VITE_APP_BASE_URL}index.php?route=${route}=${itemId}`;
  
  // Copy to clipboard
  navigator.clipboard.writeText(shareLink);
  toast(`Done!!: ${itemId} share link copied to clipboard successfully.`);

  // Open in a new tab
  // window.open(shareLink, '_blank');
};




export function advancedExportToExcel(
  data,
  fileName = "ExportedData.xlsx",
  isGrouped = false,
  groupedHeaders = [],
  summaryRows = []
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  let headerKeys = [];
  let currentRow = 1;

  // === Add Summary Rows ===
  if (summaryRows.length) {
    summaryRows.forEach(row => {
      const excelRow = worksheet.getRow(currentRow++);
      excelRow.getCell(1).value = row.label;
      excelRow.getCell(2).value = row.value;
      excelRow.font = { bold: true };
    });
    currentRow++; // blank row
  }

  // === Prepare headers ===
  if (isGrouped && groupedHeaders.length) {
    headerKeys = groupedHeaders.flatMap(g =>
      g.keys.map(k => (typeof k === "string" ? k : k.key))
    );
    // Remove 'areas' from headers
    headerKeys = headerKeys.filter(k => k !== "areas");

    // Group row
    const groupRow = worksheet.getRow(currentRow);
    let col = 1;
    groupedHeaders.forEach(group => {
      const filteredKeys = group.keys.filter(k => {
        const key = typeof k === "string" ? k : k.key;
        return key !== "areas";
      });
      const colStart = col;
      const colEnd = col + filteredKeys.length - 1;
      if (filteredKeys.length > 1) {
        worksheet.mergeCells(currentRow, colStart, currentRow, colEnd);
      }
      const cell = groupRow.getCell(colStart);
      cell.value = group.label;
      const groupStyle = group.groupStyle || {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDEBF7" } },
      };
      Object.assign(cell, { ...groupStyle });
      col = colEnd + 1;
    });
    currentRow++;

    // Header row
    const headerRow = worksheet.getRow(currentRow);
    let i = 1;
    groupedHeaders.forEach(group => {
      group.keys
        .filter(k => (typeof k === "string" ? k : k.key) !== "areas")
        .forEach(k => {
          const key = typeof k === "string" ? k : k.key;
          const label = typeof k === "string" ? k : k.label || key;
          const style = typeof k === "string" ? {} : k.headerStyle || {};
          const cell = headerRow.getCell(i);
          cell.value = label;
          cell.font = style.font || { bold: true };
          cell.fill = style.fill || {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFBDD7EE" },
          };
          cell.alignment = style.alignment || { horizontal: "center" };
          i++;
        });
    });
    currentRow++;
  } else {
    headerKeys = Object.keys(data[0] || {}).filter(k => k !== "areas");
    const headerRow = worksheet.getRow(currentRow);
    headerKeys.forEach((key, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = key;
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFBDD7EE" },
      };
    });
    currentRow++;
  }

  // === Add City & Area Rows ===
  data.forEach(item => {
    // City row
    const cityRow = worksheet.getRow(currentRow++);
    headerKeys.forEach((key, i) => {
      cityRow.getCell(i + 1).value = item[key] ?? "";
    });

    // Add areas as expandable rows (no 'areas' column in header)
    if (Array.isArray(item.areas) && item.areas.length > 0) {
      item.areas.forEach(area => {
        const areaRow = worksheet.getRow(currentRow++);
        areaRow.getCell(1).value = `   ${area.name}`; // indent name
        areaRow.getCell(2).value = area.order_count || 0;
        areaRow.outlineLevel = 1; // collapsible under city
      });
    }
  });

  worksheet.properties.outlineProperties = { summaryBelow: true };

  // Auto column width
  worksheet.columns.forEach((col, i) => {
    const maxLength = Math.max(
      ...worksheet.getColumn(i + 1).values.map(v =>
        v ? v.toString().length : 10
      )
    );
    col.width = maxLength + 2;
  });

  workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer]), fileName);
  });
}


export function resolveCity(postcode){
      return iraqCities.find((item) =>
        String(item.postcode)===String(postcode)
      );
}

export function resolveArea(address){
   if ( isNumber(address)) {
          const area = baghdadAreas.find((item) =>
            String(item.id)===String(address)
          );
          
          return area?.arabic_name
        }else{
          return address
        }
}