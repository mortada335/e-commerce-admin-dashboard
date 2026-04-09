import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import Cookies from "js-cookie";
// import * as XLSX from "xlsx"

export function handleError(error) {
  // Handle the error
  if (error.response?.status !== 500) {
    // Check if errors object exists and handle validation errors
    if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
      // Iterate through the validation errors object
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        // If there are multiple messages for a field, show them all
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            // Show field name and error message
            const formattedField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            toast(`${formattedField}: ${message}`);
          });
        } else {
          // Single message for the field
          const formattedField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          toast(`${formattedField}: ${messages}`);
        }
      });
    } else if (error.response?.data?.message) {
      // Show the main error message if no field-specific errors
      toast(error.response.data.message);
    } else {
      toast("Failed!!!");
    }
  } else if (error.code === "ERR_NETWORK") {
    toast("Network error, please try again");
  } else {
    toast("An unknown error occurred. Please try again later");
  }
}
import i18n from "@/locales/i18n";
export const resolveMaintenanceStatusVariant = (status) => {
  if (status === 2) return { color: "#FFA500", name: i18n.t("Pending") }; // Orange (Warning)
  if (status === 7) return { color: "#007BFF", name: i18n.t("Assigned Leader") }; // Blue (Primary)
  if (status === 8) return { color: "#007BFF", name: i18n.t("Filled Data by Leader" )}; // Blue (Primary)
  if (status === 9) return { color: "#17A2B8", name: i18n.t("Reviewed") }; // Teal (Info)
  if (status === 10) return { color: "#28A745", name: i18n.t("Approved By Client" )}; // Green (Success)
  if (status === 11) return { color: "#DC3545", name: i18n.t("Rejected By Client") }; // Red (Error)
  if (status === 12) return { color: "#17A2B8", name: i18n.t("Assigned Employee") }; // Teal (Info)
  if (status === 13) return { color: "#DC3545", name: i18n.t("Rejected Time By Client") }; // Red (Error)
  if (status === 14) return { color: "#DC3545", name: i18n.t("Rejected Price By Client") }; // Red (Error)
  if (status === 5) return { color: "#28A745", name: i18n.t("Completed") }; // Green (Success)
  
 
  return { color: "#17A2B8", name: "Open" };
};
export const resolveTicketStatusVariant = (status) => {
  if (status === 2) return { color: "#FFA500", name: i18n.t("Pending") }; // Orange (Warning)
  if (status === 3) return { color: "#007BFF", name: i18n.t("In Progress")}; // Blue (Primary)

  if (status === 4) return { color: "#DC3545", name: i18n.t("Canceled") }; // Red (Error)
  if (status === 5) return { color: "#28A745", name: i18n.t("Completed") }; // Green (Success)
  if (status === 6) return { color: "#17A2B8", name: i18n.t("Close") }; // Green (Success)
  if (status === 7) return { color: "#DC3545", name: i18n.t("Cancelled By Customer ") }; // Green (Success)
  
 
  return { color: "#17A2B8", name: "Open" };
};


export const resolveInviteStatusVariant = (status) => {
  if (status === 1) return { color: "#FFA500", name: "pending" }; // Orange (Warning)
  if (status === 2) return { color: "#28A745", name: "confirmed" }; // Green (Success)

  if (status === 3) return { color: "#DC3545", name: "rejected" }; // Red (Error)

  
 
  return { color: "#FFA500", name: "pending" };
};
export const resolveVisitStatusVariant = (status) => {
  if (status === 1) return { color: "#FFA500", name: "pending" }; // Orange (Warning)
  if (status === 2) return { color: "#28A745", name: "confirmed" }; // Green (Success)

  if (status === 3) return { color: "#007BFF", name: "arrived" }; // 
  if (status === 4) return { color: "#17A2B8", name: "leave" }; // Teal (Info)
  if (status === 5) return { color: "#28A745", name: "finished" }; // Teal (Info)
  if (status === 6) return { color: "#DC3545", name: "cancelled " }; // Red (Error)

  
 
  return { color: "#17A2B8", name: "Open" };
};

export const statusProgression = {
  2: 7,  // Pending → Assigned Leader
  7: 8,  // Assigned Leader → Filled Data by Leader
  8: 9,  // Filled Data by Leader → Reviewed
  9: 10, // Reviewed → Approved By Client
  10: 12, // Approved By Client → Assigned Employee
  11: 9, // Rejected By Client → Pending (optional, if allowed)
  12: 5, // Assigned Employee → Rejected Time By Client
  14: 9, // Assigned Employee → Rejected Time By Client
};

export function canMoveToNextStatus(status,actionStatus) {
  if (!status) return false; // No history, cannot proceed

  
  return statusProgression[status.value] === actionStatus 
}

export function hasStatusPassed(statusHistory, targetStatus) {
  return statusHistory?.some(entry => entry.status_value === targetStatus);
}

export function setValueInCookie(name, value, maxAge) {
  Cookies.set(name, value, {
    expires: maxAge, // Cookie expiration in days
    secure: true, // Set to true if using HTTPS
    sameSite: "Strict", // Prevent CSRF
  });
}
export function getDurationBetween(start, end) {
  if (!start || !end) return null; // handle null safely

  const startTime = new Date(start);
  const endTime = new Date(end);
  const diffMs = endTime - startTime; // milliseconds difference

  if (diffMs < 0) return null; // if times are invalid order

  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  // Format result as "1h 37m"
  return `${hours ? `${hours}h ` : ""}${minutes}m`;
}


export function getCookieValue(name) {
  return Cookies.get(name);
}

export function deleteCookieValue(name) {
  Cookies.remove(name, { path: "/" });
}

export const avatarText = (value) => {
  if (!value) return "";
  const nameArray = value.split(" ");

  // Get the first letter of the first and second words (if available)
  return nameArray
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export const ImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
export const VideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov", "video/mkv"];

export const iraqCities = [
  {
    name: "Al Anbar",
    name_ar: "الانبار",
    postcode: 1580,
  },
  {
    name: "Al Basrah",
    name_ar: "البصرة",
    postcode: 1573,
  },
  {
    name: "Al Karbala",
    name_ar: "كربلاء",
    postcode: 1578,
  },
  {
    name: "Al Muthanna",
    name_ar: "المثنى",
    postcode: 1575,
  },
  {
    name: "Al Qadisyah",
    name_ar: "القادسية",
    postcode: 1576,
  },
  {
    name: "Al Najaf",
    name_ar: "النجف",
    postcode: 1579,
  },
  {
    name: "Erbil",
    name_ar: "اربيل",
    postcode: 1583,
  },
  {
    name: "Sulaymaniyah",
    name_ar: "السليمانية",
    postcode: 1585,
  },
  {
    name: "Kirkuk",
    name_ar: "كركوك",
    postcode: 1584,
  },
  {
    name: "Babil",
    name_ar: "بابل",
    postcode: 1577,
  },
  {
    name: "Baghdad",
    name_ar: "بغداد",
    postcode: 1568,
  },
  {
    name: "Dahuk",
    name_ar: "دهوك",
    postcode: 1582,
  },
  {
    name: "Dhi Qar",
    name_ar: "ذي قار",
    postcode: 1574,
  },
  {
    name: "Diyala",
    name_ar: "ديالى",
    postcode: 1570,
  },
  {
    name: "Maysan",
    name_ar: "ميسان",
    postcode: 1572,
  },
  {
    name: "Ninawa",
    name_ar: "نينوى",
    postcode: 1581,
  },
  {
    name: "Salah ad Din",
    name_ar: "صلاح الدين",
    postcode: 1569,
  },
  {
    name: "Wasit",
    name_ar: "واسط",
    postcode: 1571,
  },
  {
    name: "Halabjah",
    name_ar: "حلبجة",
    postcode: 1572,
  },
];

// 👇 helper to access nested and array paths
export const getValueByPath = (obj, path) => {
  return path.split('.').reduce((acc, part) => {
    const match = part.match(/(\w+)\[(\d+)\]/);
    if (match) {
      const [, arrayName, index] = match;
      return acc?.[arrayName]?.[Number(index)];
    }
    return acc?.[part];
  }, obj);
};

export function getRateLabel(rate) {
  switch (rate) {
    case 5:
      return { label: 'Excellent-128-above', variant: 'default' };
    case 4:
      return { label: 'Very-good-96-127', variant: 'secondary' };
    case 3:
      return { label: 'Good-64-95', variant: 'outline' };
    case 2:
      return { label: 'Medium-32-63', variant: 'destructive' };
    case 1:
      return { label: 'Week-31-Less', variant: 'destructive' };
    default:
      return { label: String(rate ?? ''), variant: 'outline' };
  }
}

export function getWarningStatusLabel(type) {
  switch (type) {
    case 0:
      return { label: 'New', variant: 'default' };
    case 1:
      return { label: 'Action Taken', variant: 'secondary' };
    case 2:
      return { label: 'Action Not Needed', variant: 'destructive' };

    default:
      return { label: String(type ?? ''), variant: 'outline' };
  }
}

export function getWarningTypeLabel(type) {
  switch (type) {
    case 1:
      return { label: 'Notice', variant: 'default' };
    case 2:
      return { label: 'First Warning', variant: 'secondary' };
    case 3:
      return { label: 'Termination', variant: 'destructive' };

    default:
      return { label: String(type ?? ''), variant: 'outline' };
  }
}

export function getWarningReasonTypeLabel(type) {
  switch (type) {
    case 1:
      return { label: 'Exceeded Leave Limit', variant: 'default' };
    case 2:
      return { label: 'Repeated Tardiness', variant: 'secondary' };
    case 3:
      return { label: 'Non Compliance With Regulations', variant: 'outline' };
    case 4:
      return { label: 'Others', variant: 'outline' };

    default:
      return { label: String(type ?? ''), variant: 'outline' };
  }
}
export function getWarningActionTypeLabel(type) {
  switch (type) {
    case 1:
      return { label: 'Salary Deduction', variant: 'default' };

    default:
      return { label: String(type ?? ''), variant: 'outline' };
  }
}


import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * @param {Array<Object>} data - Your JSON data.
 * @param {string} fileName - Desired filename.
 * @param {boolean} isGrouped - Whether to add grouped headers or flat headers.
 * @param {Array<{label: string, keys: string[]}>} groupedHeaders - Required only if isGrouped is true.
 */

export function exportToExcel(data, fileName = "ExportedData.xlsx", isGrouped = false, groupedHeaders = [],  summaryRows = []) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  let headerKeys = [];
  let currentRow = 1;
    // === Add Summary Rows if any ===
  if (summaryRows.length) {
    summaryRows.forEach(row => {
      const excelRow = worksheet.getRow(currentRow++);
      excelRow.getCell(1).value = row.label;
      excelRow.getCell(2).value = row.value;
      excelRow.font = { bold: true };
    });

    currentRow++; // add a blank row after summary
  }
  

  if (isGrouped && groupedHeaders.length) {
    // Flatten the keys array for data extraction (key property)
    headerKeys = groupedHeaders.flatMap(g =>
      g.keys.map(k => (typeof k === "string" ? k : k.key))
    );

    // === Group Row ===
    const groupRow = worksheet.getRow(currentRow);
    let col = 1;
    groupedHeaders.forEach(group => {
      const colStart = col;
      const colEnd = col + group.keys.length - 1;

      if (group.keys.length > 1) {
        worksheet.mergeCells(currentRow, colStart, currentRow, colEnd);
      }

      const cell = groupRow.getCell(colStart);
      cell.value = group.label;

      // Apply group style if provided
      const groupStyle = group.groupStyle || {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFDDEBF7" },
        },
      };

      Object.assign(cell, { ...groupStyle });

      col = colEnd + 1;
    });
    currentRow++;

    // === Header Row (with labels and headerStyle per key) ===
    const headerRow = worksheet.getRow(currentRow);
    let i = 1;
    groupedHeaders.forEach(group => {
      group.keys.forEach(k => {
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
    // Flat headers
    headerKeys = Object.keys(data[0] || {});
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

  // === Add Data Rows ===
  data.forEach(item => {
    const row = worksheet.getRow(currentRow++);
    headerKeys.forEach((key, i) => {
      row.getCell(i + 1).value = item[key] ?? "";
    });
  });

  // === Auto Width ===
  worksheet.columns.forEach((col, i) => {
    const maxLength = Math.max(...worksheet.getColumn(i + 1).values.map(v => (v ? v.toString().length : 10)));
    col.width = maxLength + 2;
  });

  // === Save File ===
  workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer]), fileName);
  });
}


  export const exportCashFlowOriginalLabels = async (sections,from,to,closing,net_change,opening) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Cash Flow Statement");

    // Static header
    worksheet.addRow(["",`${from}-${to}`]).font = { bold: true };
    worksheet.addRow(["", "الرصيد"]).font = { bold: true };

    if (opening?.label) {
      
      worksheet.addRow([opening?.label, opening?.total]).font = { bold: true };
      worksheet.addRow([""]);
    }
    if (net_change?.label) {
      
      worksheet.addRow([net_change?.label, net_change?.total]).font = { bold: true };
      worksheet.addRow([""]);
    }



    Object.entries(sections).forEach(([key, section]) => {
      worksheet.addRow([""]); // Spacer
      const sectionRow = worksheet.addRow([section.label, parseFloat(section.total || "0").toFixed(2)]);
      sectionRow.font = { bold: true };

      (section.lines || []).forEach((line) => {
        worksheet.addRow([
          "    " + line.label,
          parseFloat(line.amount || "0").toFixed(2),
        ]);
      });
    });

    worksheet.addRow([""]);
    if (closing?.label) {
      
      worksheet.addRow([closing?.label, closing?.total]).font = { bold: true };
    }
    // Styling
    worksheet.columns.forEach((col) => {
      col.width = 50;
      col.alignment = { horizontal: "right" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "كشف_التدفقات_النقدية.xlsx");
  } catch (error) {
    toast("فشل في التصدير: حدث خطأ غير متوقع.");
  }
};


// export function exportToExcel(data, fileName = "ExportedData.xlsx", isGrouped = false, groupedHeaders = []) {
//   if (!data?.length) return;

//   const worksheet = XLSX.utils.aoa_to_sheet([]);

//   if (isGrouped && groupedHeaders.length) {
//     // 1. Flatten the keys and build the merged row
//     const flatHeaderKeys = groupedHeaders.flatMap(group => group.keys);
//     const mergedHeaderRow = groupedHeaders.flatMap(group => {
//       const fillers = Array(group.keys.length - 1).fill(null);
//       return [group.label, ...fillers];
//     });

//     // 2. Add merged header and keys
//     XLSX.utils.sheet_add_aoa(worksheet, [mergedHeaderRow], { origin: "A1" });
//     XLSX.utils.sheet_add_aoa(worksheet, [flatHeaderKeys], { origin: "A2" });

//     // 3. Add data starting from row 3
//     const formattedData = data.map(item =>
//       flatHeaderKeys.map(key => item[key] ?? "")
//     );
//     XLSX.utils.sheet_add_aoa(worksheet, formattedData, { origin: "A3" });

//     // 4. Add merges
//     let colStart = 0;
//     worksheet["!merges"] = groupedHeaders.map(group => {
//       const merge = {
//         s: { r: 0, c: colStart },
//         e: { r: 0, c: colStart + group.keys.length - 1 },
//       };
//       colStart += group.keys.length;
//       return merge;
//     });

//   } else {
//     // Flat export using json_to_sheet with headers from keys
//     const flatSheet = XLSX.utils.json_to_sheet(data);
//     Object.assign(worksheet, flatSheet);
//   }

//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//   XLSX.writeFile(workbook, fileName);
// }

export const countryOptions = [
  // Middle East
  { value: "iq", label: "iraq" },
  { value: "ae", label: "united_arab_emirates" },
  { value: "bh", label: "bahrain" },
  { value: "eg", label: "egypt" },
  { value: "jo", label: "jordan" },
  { value: "kw", label: "kuwait" },
  { value: "lb", label: "lebanon" },
  { value: "om", label: "oman" },
  { value: "qa", label: "qatar" },
  { value: "sa", label: "saudi_arabia" },
  { value: "sy", label: "syria" },
  { value: "ye", label: "yemen" },

  // Europe
  { value: "at", label: "austria" },
  { value: "be", label: "belgium" },
  { value: "ch", label: "switzerland" },
  { value: "de", label: "germany" },
  { value: "dk", label: "denmark" },
  { value: "es", label: "spain" },
  { value: "fi", label: "finland" },
  { value: "fr", label: "france" },
  { value: "gb", label: "united_kingdom" },
  { value: "gr", label: "greece" },
  { value: "ie", label: "ireland" },
  { value: "it", label: "italy" },
  { value: "nl", label: "netherlands" },
  { value: "no", label: "norway" },
  { value: "pt", label: "portugal" },
  { value: "se", label: "sweden" },

  // Americas
  { value: "ar", label: "argentina" },
  { value: "br", label: "brazil" },
  { value: "ca", label: "canada" },
  { value: "cl", label: "chile" },
  { value: "mx", label: "mexico" },
  { value: "us", label: "united_states" },

  // Asia Pacific
  { value: "au", label: "australia" },
  { value: "cn", label: "china" },
  { value: "hk", label: "hong_kong" },
  { value: "in", label: "india" },
  { value: "jp", label: "japan" },
  { value: "kr", label: "south_korea" },
  { value: "my", label: "malaysia" },
  { value: "nz", label: "new_zealand" },
  { value: "sg", label: "singapore" },
  { value: "th", label: "thailand" }
];


export  const roundCost=(num) =>{
  const rounded = Math.round(num)
   return rounded < 1000 ? rounded * 1000 : rounded;
}

export const formatArea =(area, currentSymbol = "m²")=>{
  const number= parseFloat(area)
  if(isNaN(area)){
    return "Invalid number"
  }
  const formattedArea= number.toLocaleString("en-US")
  return `${formattedArea}${currentSymbol}`
  
  
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


const pad = (n) => (n < 10 ? `0${n}` : String(n));

export function formatDateOnly(value) {
  if (!value) return "";
  if (typeof value === "string") {
    const s = value.replace("T", " ").split(" ")[0];
    return s;
  }
  const d = new Date(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDateTimeToMinutes(value) {
  if (!value) return "";
  if (typeof value === "string") {
    const s = value.replace("T", " ").split(".")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s} 00:00`;
    const mm = s.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/);
    if (mm) return `${mm[1]} ${mm[2]}`;
    return s;
  }
  const d = new Date(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function getCurrentDateTime() {
  const now = new Date();
  return formatDateTimeToMinutes(now);
}

export function getCurrentDate() {
  const now = new Date();
  return formatDateOnly(now);
}

export function validateRequiredFields(formFields) {
  const requiredFields = ['issue_id', 'site_name', 'author', 'incident_location', 'incident_time'];
  return requiredFields.every(field => formFields[field] && formFields[field].trim() !== '');
}

export function prepareFormDataForSubmission(formFields) {
  return {
    ...formFields,
    issue_date: formatDateOnly(formFields.issue_date),
    revision_date: formatDateOnly(formFields.revision_date),
    incident_time: formatDateTimeToMinutes(formFields.incident_time),
  };
}
