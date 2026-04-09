import axiosInstance from "@/utils/axiosInstance";

const currencyExchangeRoute = "currency_exchange/";
export const fetchAdminCurrencyExchange = async (user) => {
  try {
    const response = await axiosInstance.get(currencyExchangeRoute, {
      headers: {
        Authorization: `Token ${user.token}`,
      },
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const EditAdminCurrencyExchange = async (user, id, newCurrencyExchange) => {
  const formData = new FormData();
  formData.append("iqd_to_dollars_exchange", newCurrencyExchange);

  try {
    const response = await axiosInstance.put(
      `${currencyExchangeRoute}${id}/`,

      formData,
      {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      }
    );

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};
