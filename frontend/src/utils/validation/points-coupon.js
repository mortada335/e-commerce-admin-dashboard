import * as yup from "yup";
export const couponSchema = yup.object({
  name: yup.string()
    .min(1, "Name must be at least 1 characters")
    .max(125, "Name must be at most 125 characters")
      .required("Name is required"),
    

      
      points_needed: yup.number() 
            .integer("Points Needed must be an number"),
          
      
            discount: yup.number() 
            .integer("Discount must be an number")
          
           
     
          
    
      
  
     
  }).required();

