import * as yup from "yup";
export const attributesSchema = yup.object({
    nameEn: yup.string()
    .min(1, "Name in english must be at least 1 characters")
    .max(125, "Name in english must be at most 125 characters")
      .required("Name in english is required"),
    
      nameAr: yup.string()  .min(1, "Name in arabic must be at least 1 characters")
      .max(125, "Name in arabic must be at most 125 characters")
      .required("Name in arabic is required"),
     
   
 
     
  }).required();