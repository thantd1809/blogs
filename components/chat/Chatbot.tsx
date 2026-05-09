"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Xin chào! Tôi là trợ lý tư vấn yến sào. Bạn cần tư vấn gì không? 🌿",
        parts: [{ type: "text", text: "Xin chào! Tôi là trợ lý tư vấn yến sào. Bạn cần tư vấn gì không? 🌿" }],
      },
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto scroll xuống khi có tin nhắn mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Mở chat tư vấn"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Tư vấn Yến Sào</p>
              <p className="text-xs opacity-80">Trả lời ngay lập tức</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {message.role === "user"
                    ? <User className="w-4 h-4" />
                    : <Bot className="w-4 h-4" />
                  }
                </div>
                {/* Bubble */}
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted rounded-tl-sm"
                }`}>
                  {message.parts?.map((part, i) =>
                    part.type === "text" ? (
                      <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part.text}</span>
                    ) : null
                  ) ?? message.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {["Yến sào có tác dụng gì?", "Giá yến tinh chế bao nhiêu?", "Cách đặt hàng?"].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    handleInputChange({ target: { value: q } } as React.ChangeEvent<HTMLInputElement>);
                    setTimeout(() => {
                      const form = document.getElementById("chat-form") as HTMLFormElement;
                      form?.requestSubmit();
                    }, 50);
                  }}
                  className="text-xs border rounded-full px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            id="chat-form"
            onSubmit={handleSubmit}
            className="border-t px-3 py-3 flex gap-2"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Nhập câu hỏi..."
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
