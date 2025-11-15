"use client";

import { useState, useRef, useEffect } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatPanel() {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Merhaba! Workflow'unuzu oluşturmanıza yardımcı olabilirim. Ne yapmak istiyorsunuz?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerateFlow = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    const userMessage: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simüle edilmiş AI yanıtı - gerçek uygulamada API'ye istek atılacak
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: `Anladım! "${userInput}" için bir workflow oluşturuyorum...`,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Örnek workflow oluştur
      const generatedNodes = [
        {
          id: "start-1",
          type: "custom",
          position: { x: 250, y: 100 },
          data: { type: "start", label: "Start" },
        },
        {
          id: "http-1",
          type: "custom",
          position: { x: 250, y: 200 },
          data: { type: "http", label: "Fetch Data", method: "GET", url: "" },
        },
        {
          id: "ai-step-1",
          type: "custom",
          position: { x: 250, y: 300 },
          data: {
            type: "ai_step",
            label: "AI Analysis",
            config: {
              provider: "openai",
              model: "gpt-4",
              user_template: userInput,
              temperature: 0.7,
              max_tokens: 1000,
              output_mode: "text",
            },
          },
        },
        {
          id: "output-1",
          type: "custom",
          position: { x: 250, y: 400 },
          data: { type: "output", label: "Output" },
        },
      ];

      const generatedEdges = [
        { id: "e1", source: "start-1", target: "http-1" },
        { id: "e2", source: "http-1", target: "ai-step-1" },
        { id: "e3", source: "ai-step-1", target: "output-1" },
      ];

      setNodes(generatedNodes as any);
      setEdges(generatedEdges as any);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Workflow oluşturuldu! Canvas'da görüntüleyebilir ve düzenleyebilirsiniz.",
          },
        ]);
        setIsLoading(false);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="w-80 bg-dark-900 border-l border-dark-800 h-full flex flex-col">
      <div className="p-4 border-b border-dark-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">AI Asistan</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Doğal dil ile workflow oluşturun
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                message.role === "user"
                  ? "bg-primary-600 text-white"
                  : "bg-dark-800 text-foreground"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-dark-800 rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-dark-800">
        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Örn: Her gün saat 09:00'da Twitter'dan #btc etiketli son 10 tweet'i çek, sentiment analizi yap, negatifse bana e-posta gönder."
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerateFlow();
              }
            }}
          />
          <Button
            onClick={handleGenerateFlow}
            disabled={!input.trim() || isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Akışı Öner
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

