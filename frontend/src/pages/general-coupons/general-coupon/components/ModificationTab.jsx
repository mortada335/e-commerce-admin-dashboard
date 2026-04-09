import Pagination from "@/components/layout/Pagination"
import WrapperComponent from "@/components/layout/WrapperComponent"


import { Skeleton } from "@/components/ui/skeleton"


import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { AUDIT_LOGS } from "@/utils/constants/urls"
import contentTypes from "@/utils/contentTypes.json"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"

import ChangeTable from "@/elements/changes/ChangeTable"
import { Card } from "@/components/ui/card"

const ModificationTab = () => {
  const { id } = useParams()
  const axiosPrivate = useAxiosPrivate()

  const [page, setPage] = useState(1)


  const GetHistoryOfProduct = async (id) => {
    const objectReprParam = `OcCoupon object (${id})`

    return axiosPrivate.get(`${AUDIT_LOGS}?page=${page}`, {
      params: {
        // resource_type: contentTypes.occoupon,
        object_repr: objectReprParam,
      },
    })
  }

  const {
    data: productHistory,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["CouponModification", page],
    queryFn: () => GetHistoryOfProduct(id),
    enabled: !!id,
  })
  const totalPages = Math.ceil(productHistory?.data?.count / 25) // Assuming 25 items per page




  return (
    <div className="flex flex-col justify-start items-center w-full h-full">
      <WrapperComponent
        isEmpty={!productHistory?.data?.results.length}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={
          <div className="grid grid-cols-1 gap-8 place-content-center place-items-center w-full h-full py-4">
            {[1, 2].map((item) => (
              <Skeleton key={item} className="h-[125px] w-[90%] rounded-xl" />
            ))}
          </div>
        }
      emptyStateMessage="You don't have any changes to preview for this promo code."
      >
        <div className="grid grid-cols-1 gap-8 place-content-center place-items-center w-full h-full py-4 px-4">
          {productHistory?.data?.results?.map((item) => (

              <ChangeTable key={item.id} singleChange={item}/>
            
          ))}
        </div>

        <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
          <Pagination
            next={productHistory?.data?.next}
            previous={productHistory?.data?.previous}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
          />
        </Card>
      </WrapperComponent>
    </div>
  )
}

export default ModificationTab
