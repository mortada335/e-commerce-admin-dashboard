import axios from "axios"

const vonageSendMessageRoute =
  "https://crmapi.shaghlaty.net/v1/api-messages/vonage-send-message"

export const vonageSendMessage = async (
  messageObjectBody,
  page = vonageSendMessageRoute
) => {
  const response = await axios.post(page, messageObjectBody, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer pVYJf!zJl06b9ECFaEwo=rERjD3Zdh5Kr3CMWxGvusw1hbYolWFETBj00Tw78RjT`,
    },
  })

  return response
}
