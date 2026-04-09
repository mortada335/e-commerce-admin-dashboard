import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

function getCookieValue(name) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? match[2] : null
}


export default function AdminChatPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t,i18n } = useTranslation()
  const userId = Number(id)


  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const [userName, setUserName] = useState("")
  const socketRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const connectSocket = () => {
      const token = getCookieValue("accessToken")
      if (!token) {
        setError("No authentication token found. Please log in as admin.")
        return
      }

      const baseUrl = (import.meta.env.VITE_APP_BASE_URL || "").replace(/\/$/, "").replace(/^http/, "ws")
      const socketUrl = `${baseUrl}/ws/admin/chat/?token=${token}`

      const socket = new WebSocket(socketUrl)
      socketRef.current = socket

      socket.onopen = () => {
        setIsConnected(true)
        setError(null)

        socket.send(
          JSON.stringify({
            action: "subscribe",
            user_id: userId,
          }),
        )

        socket.send(
          JSON.stringify({
            action: "history",
            user_id: userId,
            limit: 50,
          }),
        )
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
        //   console.log(data)

          if (data.type === "subscribed") {
            console.log("Subscribed to user:", data.user_id)
          } else if (data.type === "unsubscribed") {
            console.log("Unsubscribed from user:", data.user_id)
          } else if (data.type === "history") {
            if (data.user_id === userId) {
              setMessages(data.messages || [])
            }
          } else if (data.type === "error") {
            setError(`Server error: ${data.message}`)
          } else {
            setMessages((prev) => [...prev, data])
          }
        } catch (err) {
          console.error("Invalid message format:", err)
        }
      }

      socket.onerror = (err) => {
        console.error("WebSocket error:", err)
        setError("Connection error occurred")
        setIsConnected(false)
      }

      socket.onclose = (event) => {
        setIsConnected(false)
        if (event.code !== 1000) {
          setError("Connection closed unexpectedly")
        }
      }
    }

    connectSocket()

    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            action: "unsubscribe",
            user_id: userId,
          }),
        )
        socketRef.current.close(1000, "Component unmounted")
      }
    }
  }, [userId])

  useEffect(() => {
    const fetchUserName = async () => {
      const token = getCookieValue("accessToken")
      if (!token) return

      try {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL?.replace(/\/$/, "") || ""
        const response = await fetch(`${baseUrl}/admin-chat/conversations/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const user = data.results?.find((c) => c.user_id === id)
          if (user) {
            setUserName(user.full_name)
          }
        }
      } catch (err) {
        console.error("Failed to fetch user name:", err)
      }
    }

    fetchUserName()
  }, [userId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    const message = input.trim()
    if (!message || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return

    socketRef.current.send(
      JSON.stringify({
        action: "send",
        user_id: userId,
        message,
      }),
    )
    setInput("")
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/chatpage")}>
                { i18n.language === "en" ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5"/>}
              </Button>
              <CardTitle>{userName || `User ${userId}`}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-muted-foreground">{isConnected ? t("Connected") : t("Disconnected")}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

          <ScrollArea className="h-[500px] pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-muted-foreground text-center">{t("No messages yet")}</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_from_admin ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.is_from_admin ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${msg.is_from_admin ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("Type your message...")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              disabled={!isConnected}
            />
            <Button onClick={sendMessage} disabled={!isConnected || !input.trim()}>
              {t("Send")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
