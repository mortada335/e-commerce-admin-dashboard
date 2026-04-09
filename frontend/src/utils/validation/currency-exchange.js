import * as yup from "yup";
export const currencyExchangeSchema = yup.object({
    
      iqd_to_dollars_exchange: yup.number().positive("Currency Exchange  must be a positive number")
      .integer("Currency Exchange must be an number")
      .required("Currency Exchange number is required"),
 
     
  }).required();

