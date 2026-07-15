import { useState, useRef, useEffect, useCallback } from "react";

// The Gemini → Groq → Cerebras fallback chain and system prompt now live
// server-side (lib/chat.js), reached via /api/chat, so provider keys never
// ship in the browser bundle.

async function askSaathi(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.reply;
}

// ─── Styles ──────────────────────────────────────────────────────────────
// All styles are self-contained so this component drops into any page.

const COLORS = {
  bg: "#1a1625",
  surface: "#231e30",
  surfaceHover: "#2d2640",
  accent: "#9b72cf",
  accentSoft: "rgba(155, 114, 207, 0.15)",
  accentGlow: "rgba(155, 114, 207, 0.3)",
  text: "#e8e2f0",
  textMuted: "#9e95ad",
  userBubble: "#9b72cf",
  userText: "#ffffff",
  botBubble: "#2d2640",
  botText: "#e8e2f0",
  border: "rgba(155, 114, 207, 0.12)",
  inputBg: "#1a1625",
};

const styles = {
  fab: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${COLORS.accent}, #7c4dbd)`,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 4px 24px ${COLORS.accentGlow}, 0 0 0 0 ${COLORS.accentGlow}`,
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    zIndex: 9998,
  },
  fabHover: {
    transform: "scale(1.08)",
    boxShadow: `0 6px 32px ${COLORS.accentGlow}`,
  },

  window: {
    position: "fixed",
    bottom: 96,
    right: 24,
    width: 380,
    maxWidth: "calc(100vw - 32px)",
    height: 540,
    maxHeight: "calc(100vh - 120px)",
    borderRadius: 20,
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${COLORS.border}`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    animation: "saathiSlideUp 0.3s ease-out",
  },

  header: {
    padding: "16px 20px",
    background: COLORS.surface,
    borderBottom: `1px solid ${COLORS.border}`,
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${COLORS.accent}, #7c4dbd)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 15,
    fontWeight: 600,
    color: COLORS.text,
    margin: 0,
    letterSpacing: "0.01em",
  },
  headerStatus: {
    fontSize: 12,
    color: COLORS.textMuted,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#4ade80",
    display: "inline-block",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: COLORS.textMuted,
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.15s",
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 16px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  msgRow: (isUser) => ({
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
    alignItems: "flex-end",
    gap: 8,
  }),
  bubble: (isUser) => ({
    maxWidth: "78%",
    padding: "10px 14px",
    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    background: isUser ? COLORS.userBubble : COLORS.botBubble,
    color: isUser ? COLORS.userText : COLORS.botText,
    fontSize: 14,
    lineHeight: 1.55,
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  }),

  typing: {
    display: "flex",
    gap: 4,
    padding: "12px 16px",
    background: COLORS.botBubble,
    borderRadius: "16px 16px 16px 4px",
    width: "fit-content",
  },
  typingDot: (delay) => ({
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: COLORS.textMuted,
    animation: `saathiBounce 1.2s ease-in-out ${delay}s infinite`,
  }),

  inputArea: {
    padding: "12px 16px 16px",
    borderTop: `1px solid ${COLORS.border}`,
    background: COLORS.surface,
    flexShrink: 0,
  },
  inputRow: {
    display: "flex",
    gap: 8,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.inputBg,
    color: COLORS.text,
    fontSize: 14,
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    lineHeight: 1.5,
    maxHeight: 100,
    transition: "border-color 0.15s",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "none",
    background: COLORS.accent,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "opacity 0.15s, transform 0.15s",
  },
  sendBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },

  disclaimer: {
    padding: "8px 16px 4px",
    textAlign: "center",
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 1.4,
  },
};

// Keyframe animation injection (runs once)
if (typeof document !== "undefined") {
  const id = "saathi-keyframes";
  if (!document.getElementById(id)) {
    const sheet = document.createElement("style");
    sheet.id = id;
    sheet.textContent = `
      @keyframes saathiSlideUp {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes saathiBounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-5px); }
      }
      .saathi-scrollbar::-webkit-scrollbar { width: 5px; }
      .saathi-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .saathi-scrollbar::-webkit-scrollbar-thumb { background: ${COLORS.accentSoft}; border-radius: 10px; }
      .saathi-input:focus { border-color: ${COLORS.accent} !important; }
    `;
    document.head.appendChild(sheet);
  }
}

// ─── Icons ───────────────────────────────────────────────────────────────

const HeartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────

export default function SaathiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fabHover, setFabHover] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      getGreeting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getGreeting = useCallback(async () => {
    setIsLoading(true);
    try {
      const reply = await askSaathi([{ role: "user", content: "hi" }]);
      setMessages([{ role: "assistant", content: reply }]);
    } catch {
      setMessages([
        {
          role: "assistant",
          content:
            "Hey! 💜 I'm Saathi — your safe space to talk. I'm here whenever you need me. What's on your mind?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      const reply = await askSaathi(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having a little trouble connecting right now. Please try again in a moment. I'm not going anywhere 💜",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
  };

  return (
    <>
      {!isOpen && (
        <button
          style={{ ...styles.fab, ...(fabHover ? styles.fabHover : {}) }}
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setFabHover(true)}
          onMouseLeave={() => setFabHover(false)}
          aria-label="Open Saathi chat"
        >
          <HeartIcon />
        </button>
      )}

      {isOpen && (
        <div style={styles.window}>
          <div style={styles.header}>
            <div style={styles.avatar}>💜</div>
            <div style={styles.headerInfo}>
              <p style={styles.headerName}>Saathi</p>
              <p style={styles.headerStatus}>
                <span style={styles.onlineDot} />
                Always here for you
              </p>
            </div>
            <button
              style={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
            >
              <CloseIcon />
            </button>
          </div>

          <div style={styles.messages} className="saathi-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} style={styles.msgRow(msg.role === "user")}>
                <div style={styles.bubble(msg.role === "user")}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={styles.msgRow(false)}>
                <div style={styles.typing}>
                  <span style={styles.typingDot(0)} />
                  <span style={styles.typingDot(0.15)} />
                  <span style={styles.typingDot(0.3)} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div style={styles.disclaimer}>
            Saathi is an AI companion, not a therapist. In crisis, call iCall: 9152987821
          </div>

          <div style={styles.inputArea}>
            <div style={styles.inputRow}>
              <textarea
                ref={inputRef}
                className="saathi-input"
                style={styles.input}
                rows={1}
                placeholder="Type your message…"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                style={{
                  ...styles.sendBtn,
                  ...(!input.trim() || isLoading ? styles.sendBtnDisabled : {}),
                }}
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
