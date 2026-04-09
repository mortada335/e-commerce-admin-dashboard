import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Plus,
  Search,
  X,
  Loader2,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFullDate } from "@/utils/methods";

function getCookieValue(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export default function ChatPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalMessageCount, setTotalMessageCount] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageCaption, setImageCaption] = useState("");

  const socketRef = useRef(null);
  const msgScrollRef = useRef(null);
  const convScrollRef = useRef(null);
  const lastMessageRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  const prevScrollHeightRef = useRef(0);
  const messagesRef = useRef([]);
  const lastUpdateSourceRef = useRef("");
  const searchTimeoutRef = useRef(null);
  const imageInputRef = useRef(null);
  const hasRestoredFromStorageRef = useRef(false);
  const pendingTempMessagesRef = useRef(new Map());

  const fetchConversations = async () => {
    const token = getCookieValue("accessToken");
    if (!token) return setError(t("no_auth_token")), setIsLoading(false);

    try {
      console.log("📥 Fetching conversations from API...");
      const baseUrl =
        import.meta.env.VITE_APP_BASE_URL?.replace(/\/$/, "") || "";
      const url = `${baseUrl}/admin-chat/conversations/`;
      console.log("📥 API URL:", url);

      const res = await fetch(url, {
        headers: { Authorization: `Token ${token}` },
      });

      console.log("📥 Response status:", res.status, res.statusText);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`Failed to fetch conversations: ${res.status}`);
      }

      const data = await res.json();
      console.log("📥 API Response:", data);
      console.log(
        "📥 Conversations count:",
        data.results?.length,
        "Total in DB:",
        data.count
      );
      console.log(
        "📥 Conversation user IDs:",
        data.results?.map((c) => `${c.user_id} (${c.full_name})`)
      );

      setConversations(data.results || []);
      setTotalMessageCount(data.count || 0);

      return data; // Return data for promise chaining
    } catch (err) {
      console.error("❌ Fetch conversations error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [t]);

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchUsers([]);
      return;
    }

    clearTimeout(searchTimeoutRef.current);
    setSearchLoading(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const token = getCookieValue("accessToken");
        const baseUrl =
          import.meta.env.VITE_APP_BASE_URL?.replace(/\/$/, "") || "";
        const res = await fetch(
          `${baseUrl}/users/?search=${encodeURIComponent(query)}`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to search users");
        const data = await res.json();
        const existingIds = new Set(conversations.map((c) => c.user_id));
        setSearchUsers(
          (data.results || data || []).filter((u) => !existingIds.has(u.id))
        );
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const startChatWithUser = async (user) => {
    const newConversation = {
      user_id: user.id,
      full_name: user.full_name || user.name || user.username || "User",
      preview: "No messages yet",
      created_at: new Date().toISOString(),
    };

    console.log("💬 Starting chat with user:", user.username, "ID:", user.id);

    // Check if conversation already exists
    const existingConv = conversations.find((c) => c.user_id === user.id);
    if (existingConv) {
      console.log("ℹ️ Conversation already exists, just selecting it");
      setSelectedUser(existingConv);
      setShowUserSearch(false);
      setSearchQuery("");
      setSearchUsers([]);
      return;
    }

    // Add temporary conversation
    setConversations((prev) => [newConversation, ...prev]);
    setSelectedUser(newConversation);
    setShowUserSearch(false);
    setSearchQuery("");
    setSearchUsers([]);

    // Send initial message to create conversation on backend
    const token = getCookieValue("accessToken");
    const baseUrl = (import.meta.env.VITE_APP_BASE_URL || "")
      .replace(/\/$/, "")
      .replace(/^http/, "ws");
    const socketUrl = `${baseUrl}/ws/admin/chat/?token=${token}`;
    const tempSocket = new WebSocket(socketUrl);

    tempSocket.onopen = () => {
      console.log(
        "📤 Sending initial message to create conversation for user:",
        user.id
      );

      // Send a visible message instead of just whitespace
      tempSocket.send(
        JSON.stringify({
          action: "send",
          user_id: user.id,
          message: "Hello! How can I help you?",
        })
      );

      console.log("✅ Initial message sent successfully");
    };

    tempSocket.onmessage = (event) => {
      console.log("📨 Response from temp socket:", event.data);
      try {
        const response = JSON.parse(event.data);
        console.log("📨 Parsed response:", response);

        // After message is confirmed, fetch conversations
        if (response.id) {
          console.log("✅ Message confirmed with ID:", response.id);
          setTimeout(() => {
            console.log("🔄 Fetching conversations after message confirmation");
            fetchConversations().then(() => {
              console.log("✅ Conversations re-fetched");
            });
          }, 1000);
        }
      } catch (err) {
        console.error("❌ Error parsing temp socket response:", err);
      }
      tempSocket.close();
    };

    tempSocket.onerror = (err) => {
      console.error("❌ Error creating chat via temp socket:", err);
      // Still try to fetch conversations in case it worked
      setTimeout(() => {
        console.log("🔄 Fetching conversations after socket error");
        fetchConversations();
      }, 2000);
    };

    tempSocket.onclose = () => {
      console.log("🔌 Temp socket closed");
    };
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser) return;

    setUploadingImage(true);
    try {
      const token = getCookieValue("accessToken");
      const formData = new FormData();
      formData.append("image_file", file);

      const baseUrl =
        import.meta.env.VITE_APP_BASE_URL?.replace(/\/$/, "") || "";
      const uploadRes = await fetch(`${baseUrl}/chat/images/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");
      const { id: imageId, url: imageUrl } = await uploadRes.json();

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const payload = {
          action: "send",
          user_id: selectedUser.user_id,
          image_id: imageId,
        };
        if (imageCaption.trim()) {
          payload.message = imageCaption;
        }
        socketRef.current.send(JSON.stringify(payload));
        setImageCaption("");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // Restore selected user from localStorage ONLY ONCE on mount
  useEffect(() => {
    if (hasRestoredFromStorageRef.current) return;

    const saved = localStorage.getItem("selectedUser");
    if (saved) {
      const user = JSON.parse(saved);
      console.log("💾 Restored selected user from localStorage:", user);
      hasRestoredFromStorageRef.current = true;

      setConversations((prev) => {
        if (prev.some((c) => c.user_id === user.user_id)) {
          return prev;
        }
        console.log("➕ Adding selected user to conversations list");
        return [user, ...prev];
      });

      setSelectedUser(user);
    } else {
      hasRestoredFromStorageRef.current = true;
    }
  }, []); // Empty dependency array - run only once

  // Save to localStorage when selectedUser changes
  useEffect(() => {
    if (selectedUser && hasRestoredFromStorageRef.current) {
      console.log("💾 Saving selected user to localStorage:", selectedUser);
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
  }, [selectedUser]);

  // WebSocket connection
  useEffect(() => {
    if (!selectedUser) return;
    const token = getCookieValue("accessToken");
    if (!token) return;

    // Clear messages when switching users
    setMessages([]);
    console.log(
      "🔄 Switching to user:",
      selectedUser.user_id,
      selectedUser.full_name
    );

    const baseUrl = (import.meta.env.VITE_APP_BASE_URL || "")
      .replace(/\/$/, "")
      .replace(/^http/, "ws");
    const socketUrl = `${baseUrl}/ws/admin/chat/?token=${token}`;
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🔌 WebSocket connected for user:", selectedUser.user_id);
      setIsConnected(true);
      setError(null);

      console.log("📡 Subscribing to user:", selectedUser.user_id);
      socket.send(
        JSON.stringify({ action: "subscribe", user_id: selectedUser.user_id })
      );

      console.log(
        "📜 Fetching initial history for user:",
        selectedUser.user_id
      );
      socket.send(
        JSON.stringify({
          action: "history",
          user_id: selectedUser.user_id,
          limit: 50,
          offset: 0,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "history" && data.user_id === selectedUser.user_id) {
          console.log(
            "📜 Received history batch:",
            data.messages?.length,
            "messages for user:",
            data.user_id
          );
          console.log("📜 Current messages count:", messages.length);

          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMsgs = (data.messages || []).filter(
              (m) => !existingIds.has(m.id)
            );
            console.log("📜 New unique messages to add:", newMsgs.length);
            return [...newMsgs, ...prev];
          });
          setIsLoadingOlder(false);
        } else if (!data.type) {
          console.log("📩 New WS message received:", data);

          // Remove matching temp message if it exists
          if (data.is_from_admin && data.text) {
            const tempMsg = pendingTempMessagesRef.current.get(data.text);
            if (tempMsg) {
              console.log(
                "🗑️ Removing temp message, replacing with real:",
                data.text
              );
              setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
              pendingTempMessagesRef.current.delete(data.text);
            }
          }

          console.log("✅ Adding new message to state");
          lastUpdateSourceRef.current = "new";
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.id)) {
              console.log("⚠️ Message ID already exists, skipping");
              return prev;
            }
            return [...prev, data];
          });

          setConversations((prev) =>
            prev.map((conv) =>
              conv.user_id === data.user_id
                ? {
                    ...conv,
                    preview: data.image_url ? "[Image]" : data.text || "",
                    created_at: data.created_at,
                  }
                : conv
            )
          );
        } else if (data.type === "error") {
          console.error("❌ Server error:", data.message);
          setError(`Server error: ${data.message}`);
        }
      } catch (err) {
        console.error("❌ Invalid WS message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      setError("Connection error occurred");
      setIsConnected(false);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log("📡 Unsubscribing from user:", selectedUser.user_id);
        socket.send(
          JSON.stringify({
            action: "unsubscribe",
            user_id: selectedUser.user_id,
          })
        );
      }
      socket.close();
    };
  }, [selectedUser?.user_id]); // Only depend on user_id

  const scrollToBottom = () => {
    if (!msgScrollRef.current) return;
    const container =
      msgScrollRef.current.contentElement || msgScrollRef.current;
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: isFirstLoadRef.current ? "auto" : "smooth",
        block: "end",
      });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  };

  const loadOlderMessages = () => {
    if (
      !selectedUser ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    )
      return;
    const container =
      msgScrollRef.current?.contentElement || msgScrollRef.current;
    if (!container) return;

    if (messages.length >= totalMessageCount) {
      console.log("📜 All messages loaded");
      return;
    }

    console.log(
      "📜 Loading older messages. Current count:",
      messages.length,
      "Total:",
      totalMessageCount
    );
    setIsLoadingOlder(true);
    prevScrollHeightRef.current = container.scrollHeight;

    const offset = messages.length;
    const remaining = totalMessageCount - messages.length;
    const nextBatchSize = remaining >= 50 ? 50 : remaining;

    console.log(
      "📜 Requesting history with offset:",
      offset,
      "limit:",
      nextBatchSize
    );
    socketRef.current.send(
      JSON.stringify({
        action: "history",
        user_id: selectedUser.user_id,
        limit: nextBatchSize,
        offset: offset,
      })
    );
  };

  const sendMessage = () => {
    const message = input.trim();
    if (
      !message ||
      !selectedUser ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    )
      return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMessage = {
      id: tempId,
      text: message,
      is_from_admin: true,
      created_at: new Date().toISOString(),
    };

    console.log("📤 Sending message:", message);

    // Track temp message
    pendingTempMessagesRef.current.set(message, tempMessage);

    setMessages((prev) => [...prev, tempMessage]);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.user_id === selectedUser.user_id
          ? {
              ...conv,
              preview: `You: ${message}`,
              created_at: tempMessage.created_at,
            }
          : conv
      )
    );

    socketRef.current.send(
      JSON.stringify({ action: "send", user_id: selectedUser.user_id, message })
    );

    setInput("");

    // Cleanup temp message after 5 seconds if not replaced
    setTimeout(() => {
      if (pendingTempMessagesRef.current.has(message)) {
        console.log(
          "⚠️ Temp message not replaced after 5s, removing:",
          message
        );
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        pendingTempMessagesRef.current.delete(message);
      }
    }, 5000);
  };

  useEffect(() => {
    if (messages.length > 0 && selectedUser) scrollToBottom();
    isFirstLoadRef.current = false;
  }, [messages, selectedUser]);

  useEffect(() => {
    isFirstLoadRef.current = true;
  }, [selectedUser?.user_id]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const container =
      msgScrollRef.current?.contentElement || msgScrollRef.current;
    if (!container) return;

    const onScroll = () => {
      if (
        container.scrollTop <= 10 &&
        !isLoadingOlder &&
        isConnected &&
        selectedUser
      ) {
        loadOlderMessages();
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [
    isLoadingOlder,
    isConnected,
    selectedUser,
    messages.length,
    totalMessageCount,
  ]);

  return (
    <div className="flex h-[85vh] w-full border rounded-xl overflow-hidden bg-background shadow-md">
      <div
        className={cn(
          "w-1/3 min-w-[300px] border-r flex flex-col bg-muted/30",
          isRTL && "border-l border-r-0"
        )}
      >
        <div className="p-5 border-b font-semibold text-xl flex items-center justify-between">
          <span>{t("conversations")}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowUserSearch(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {showUserSearch && (
          <div className="p-4 border-b bg-muted/50 space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search users")}
                value={searchQuery}
                onChange={(e) => handleSearchUsers(e.target.value)}
                className="pr-10"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setShowUserSearch(false);
                  setSearchQuery("");
                  setSearchUsers([]);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {searchLoading && (
              <div className="p-3 text-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 inline animate-spin mr-2" />
                Searching...
              </div>
            )}
            {searchQuery && !searchLoading && searchUsers.length === 0 && (
              <div className="p-3 text-center text-sm text-muted-foreground">
                No users found
              </div>
            )}
            {searchUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => startChatWithUser(user)}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <div className="font-medium">{user.username}</div>
              </button>
            ))}
          </div>
        )}

        <ScrollArea ref={convScrollRef} className="flex-1">
          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground text-base">
              {t("loading_conversations")}
            </div>
          ) : error ? (
            <div className="p-6 text-destructive text-center text-base">
              {error}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-base">
              {t("no_conversations")}
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.user_id}
                  onClick={() => setSelectedUser(conv)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg transition-colors",
                    selectedUser?.user_id === conv.user_id
                      ? "bg-primary/10"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="font-medium text-base">{conv.full_name}</div>
                  <div className="text-sm text-muted-foreground truncate mt-1">
                    {conv.preview}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {formatFullDate(conv.created_at)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-5 border-b flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedUser(null)}
                >
                  {isRTL ? <ArrowRight /> : <ArrowLeft />}
                </Button>
                <h2 className="font-semibold text-lg">
                  {selectedUser.full_name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? t("connected") : t("disconnected")}
                </span>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6" ref={msgScrollRef}>
              <div className="space-y-5">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-[60vh] text-muted-foreground text-base">
                    {t("no_messages")}
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.is_from_admin ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] px-5 py-3 rounded-2xl shadow-sm",
                            msg.is_from_admin
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {msg.image_url && (
                            <img
                              src={msg.image_url || "/placeholder.svg"}
                              alt="message"
                              className="max-w-sm rounded-lg mb-2 max-h-[300px] object-cover"
                            />
                          )}
                          {msg.text && (
                            <p className="break-words text-base">{msg.text}</p>
                          )}
                          {msg.voucher_code && (
                            <div className="mt-2 p-2 bg-white/20 rounded text-sm font-mono">
                              Code: {msg.voucher_code}
                            </div>
                          )}
                          <p
                            className={cn(
                              "text-[11px] mt-1",
                              msg.is_from_admin
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {formatFullDate(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={lastMessageRef} />
                  </>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-muted/20 space-y-2">
              {imageCaption && (
                <div className="text-sm text-muted-foreground px-2">
                  Caption: {imageCaption}
                </div>
              )}
              <div className="flex gap-3">
                <Input
                  disabled={!isConnected}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type message..."
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  aria-label="Upload image"
                  onClick={() => imageInputRef.current?.click()}
                  size="icon"
                  variant="outline"
                  disabled={!isConnected || uploadingImage}
                >
                  {uploadingImage ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Image className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  aria-label={t("send_message")}
                  onClick={sendMessage}
                  size="icon"
                  disabled={!isConnected || !input.trim()}
                  className="px-5"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-lg text-muted-foreground">
            {t("select_conversation")}
          </div>
        )}
      </div>
    </div>
  );
}
