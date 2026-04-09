

import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { setProductsOrder, useOrderStore } from "../store";


const ProductQuantityInput = ({ product_id, quantity,setOrderChanged }) => {
  const [newQuantity, setNewQuantity] = useState();
  const [isChanged, setIsChanged] = useState(false);

  const {  productsOrder,  } =
    useOrderStore();

  useEffect(() => {
    setNewQuantity(quantity);

  }, [quantity]);

  useEffect(() => {
    if (Number(newQuantity) !== Number(quantity)) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [newQuantity, quantity]);


  function onChange(newValue) {
    const updatedQuantity = Number(newValue);
    setNewQuantity(updatedQuantity);

    // Find the product by its product_id
    const updatedProductsOrder = productsOrder.map((product) =>
      product.product_id === product_id
        ? { ...product, quantity: updatedQuantity }
        : product
    );
    if (JSON.stringify(productsOrder) !== JSON.stringify(updatedProductsOrder)) {
      setOrderChanged(true);
    }

    setProductsOrder(updatedProductsOrder);
    

  }

  return (
   
      <div
   
        className=" flex justify-start items-center w-full gap-0 relative"
      >

                <Input
                  className={cn(
                    "  !ring-0 !outline-none !ring-offset-0 ",
                   
                    !isChanged && "border-none"
                  )}
                  type="number"
                  placeholder="sort_order"
                  value={newQuantity}
                  min={0}
                  onChange={(e) => {
                
                   
                    onChange(e.target.value)
                  }}
                  autoComplete="sort_order"
                />
           


      </div>
  
  );
};

export default ProductQuantityInput;
