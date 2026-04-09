import { Loader2, Upload } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./button";
// import { saveAs } from "file-saver";
import { axiosPrivate } from "@/api/axios";



import {  exportToExcel, handleError } from "@/utils/methods";
import { useTranslation } from "react-i18next";

const ExportButton = ({
  children,
  url,
  page,
  itemPerPage,
  sortBy,
  initSortBy='-date_added',
  sortType,
  isCustomObject=false,
  exportObject=()=>{},
  filters=[],
  fileName='data.xlsx',
  ...props
}) => {

  const [isExporting, setIsExporting] = useState(false);
  const { t } = useTranslation()

      // Handler for exporting the orders list as a CSV file.
      const exportHandler = async () => {
        // Set the state to indicate loading and disable the button.
        setIsExporting(true);
          // Create a new URLSearchParams object
          const params = new URLSearchParams();
          if (page) {
            params.append("page", page);
            
          }
          if (itemPerPage) {
            
            params.append("page_size", itemPerPage);
          }

       
            
            params.append("ordering", sortBy
              ? `${sortType === "asc" ? "" : "-"}${sortBy}`
              : initSortBy);
      
        
         

    
            if (filters?.length) {
    
              filters?.forEach((filter)=>{
                if (filter?.value !== null && filter?.value !== undefined && filter?.value !== '') {
                  
                              params.append(filter?.key, filter?.value);
                  
                }
              })
              
            }
        // Try to fetch and handle the response data.
    
        try {
    
    
          const res = await axiosPrivate({
            url: `${url}?${params.toString()}`,
            method: "GET",
    
           
          });
            if (res.data?.results?.length) {
      
              const currentData = res.data?.results?.map((item)=> { 
      
                return isCustomObject?exportObject(item) :item
              })
      
              // Reset the state and initiate the CSV file download.
              setIsExporting(false);
              exportToExcel(currentData, fileName);
              // downloadCsv(response.data, undefined, "Orders List.csv");
            }
    
      
    
        } catch (error) {
        
          
          // Reset the state and notify the user about the error.
          setIsExporting(false);
          handleError(error)
         
        }finally{
          setIsExporting(false);
        }
      };
  return (
    <Button {...props} disabled={isExporting||!url}  onClick={exportHandler}>
      {isExporting ? (
        <p className="flex justify-center items-center space-x-2">
          <Loader2 className=" h-5 w-5 animate-spin" />
        </p>
      ) : (

        children ?children: <p className="flex items-center gap-2 text-sm">
                  {/* Medium screen and above. */}
                  <span className="hidden md:block">
                    <Upload size={14} />
                  </span>
                  {/* Small screen. */}
                  <span className="md:hidden">
                    <Upload size={12} />
                  </span>
                  {t("Export")}
                </p>
      )}
    </Button>
  );
};

export default ExportButton;
