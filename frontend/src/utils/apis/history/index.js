import axiosInstance from "@/utils/axiosInstance"
import { AUDIT_LOGS } from "@/utils/constants/urls"

import contentTypes from "@/utils/contentTypes.json"

export const GetHistoryOfOrderStatusAndComment = async (
  orderId,
  page = AUDIT_LOGS
) => {
  const objectReprParam = `OcOrder object (${orderId})`

  const response = await axiosInstance.get(page, {
    params: {
      // resource_type: contentTypes.ocorder,
      object_repr: objectReprParam,
    },
  })

  return response
}

export const GetHistoryOfProduct = async (productId, page = AUDIT_LOGS) => {
  const objectReprParam = `OcProduct object (${productId})`

  const response = await axiosInstance.get(page, {
    params: {
      resource_type: contentTypes.ocproduct,
      object_repr: objectReprParam,
    },
  })

  return response
}

export const GetRewardPointsHistory = async (
  customerMembershipId,
  page = AUDIT_LOGS
) => {
  const objectReprParam = `OcCustomerMembership ID: ${customerMembershipId}`

  const response = await axiosInstance.get(page, {
    params: {
      resource_type: contentTypes.occustomermembership,
      object_repr: objectReprParam,
    },
  })

  return response
}

export const GetHistoryOfCoupon = async (couponId, page = AUDIT_LOGS) => {
  const objectReprParam = `OcCoupon object (${couponId})`

  const response = await axiosInstance.get(page, {
    params: {
      resource_type: contentTypes.occoupon,
      object_repr: objectReprParam,
    },
  })

  return response
}
