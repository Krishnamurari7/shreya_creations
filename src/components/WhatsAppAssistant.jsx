"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/whatsapp";
import {
  WA_FLOWS,
  buildFlowMessage,
  getFlowOptions,
  pickLocalized,
} from "@/lib/whatsappFlows";
import { useLanguage } from "@/components/LanguageProvider";

const COPY = {
  en: {
    welcome:
      "Namaste! 🙏 Welcome to Shreya creation. Select an option below — we'll ask a few quick follow-ups, then open WhatsApp with your details ready.",
    replies: "Replies within minutes",
    close: "Close Chat",
    open: "Open WhatsApp Support",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Priyanshi Sharma",
    noteLabel: "Anything else? (optional)",
    notePlaceholder: "Size, colour, budget, reference photo…",
    send: "Send on WhatsApp",
    back: "← Start over",
    namePrompt: "Almost done! Share your name so we can greet you on WhatsApp.",
    preview: "Your message preview:",
    nameRequired: "Please enter your name.",
  },
  hi: {
    welcome:
      "नमस्ते! 🙏 Shreya creation में आपका स्वागत है। नीचे एक विकल्प चुनें — कुछ सवालों के बाद WhatsApp आपके विवरण के साथ खुलेगा।",
    replies: "कुछ मिनटों में जवाब",
    close: "चैट बंद करें",
    open: "WhatsApp सहायता खोलें",
    nameLabel: "आपका नाम",
    namePlaceholder: "उदा. प्रियांशी शर्मा",
    noteLabel: "कुछ और? (वैकल्पिक)",
    notePlaceholder: "माप, रंग, बजट, रेफरेंस फोटो…",
    send: "WhatsApp पर भेजें",
    back: "← फिर से शुरू",
    namePrompt: "लगभग हो गया! WhatsApp पर आपको संबोधित करने के लिए अपना नाम लिखें।",
    preview: "आपके संदेश का पूर्वावलोकन:",
    nameRequired: "कृपया अपना नाम लिखें।",
  },
};

function usePageContext() {
  const pathname = usePathname();
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const title = document.querySelector("main h1")?.textContent?.trim() || "";
    const url = window.location.href;

    if (pathname.startsWith("/shop/") && pathname !== "/shop") {
      setCtx({ type: "product", title, url });
    } else if (pathname.startsWith("/courses/") && pathname !== "/courses") {
      setCtx({ type: "course", title, url });
    } else {
      setCtx(null);
    }
  }, [pathname]);

  return ctx;
}

export default function WhatsAppAssistant({ number }) {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.en;
  const pageContext = usePageContext();

  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState("topic");
  const [flowId, setFlowId] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [chat, setChat] = useState([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const chatEndRef = useRef(null);
  const bodyRef = useRef(null);

  const flow = flowId ? WA_FLOWS[flowId] : null;
  const currentStep = flow?.steps?.[stepIndex];

  const flowOptions = useMemo(() => getFlowOptions(pageContext, lang), [pageContext, lang]);

  const reset = useCallback(() => {
    setPhase("topic");
    setFlowId(null);
    setStepIndex(0);
    setAnswers({});
    setChat([]);
    setName("");
    setNote("");
  }, []);

  const addBot = useCallback((text) => {
    setChat((prev) => [...prev, { role: "bot", text }]);
  }, []);

  const addUser = useCallback((text) => {
    setChat((prev) => [...prev, { role: "user", text }]);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, phase, isOpen]);

  useEffect(() => {
    if (isOpen && chat.length === 0) {
      addBot(t.welcome);
    }
  }, [isOpen, chat.length, t.welcome, addBot]);

  const handleOpenToggle = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      reset();
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const startFlow = (id) => {
    const selected = WA_FLOWS[id];
    if (!selected) return;

    const label = pickLocalized(selected.label, lang);
    if (pageContext?.type === "product" && id === "product" && pageContext.title) {
      addUser(`${pickLocalized({ en: "📦 Order:", hi: "📦 ऑर्डर:" }, lang)} ${pageContext.title}`);
    } else if (pageContext?.type === "course" && id === "coursePage" && pageContext.title) {
      addUser(`${pickLocalized({ en: "📚 Enroll:", hi: "📚 एनरोल:" }, lang)} ${pageContext.title}`);
    } else {
      addUser(label);
    }

    setFlowId(id);
    setStepIndex(0);
    setAnswers({});
    setPhase("followup");
    addBot(pickLocalized(selected.greeting, lang));
    addBot(pickLocalized(selected.steps[0].question, lang));
  };

  const handleAnswer = (option) => {
    if (!flow || !currentStep) return;

    const answerText = pickLocalized(option, lang);
    addUser(answerText);

    const nextAnswers = { ...answers, [currentStep.id]: answerText };
    setAnswers(nextAnswers);

    const nextIndex = stepIndex + 1;
    if (nextIndex < flow.steps.length) {
      setStepIndex(nextIndex);
      addBot(pickLocalized(flow.steps[nextIndex].question, lang));
    } else {
      setPhase("finalize");
      addBot(t.namePrompt);
    }
  };

  const previewMessage = useMemo(() => {
    if (!flowId) return "";
    return buildFlowMessage(flowId, answers, {
      name: name.trim(),
      note: note.trim(),
      url: pageContext?.url || (typeof window !== "undefined" ? window.location.href : ""),
      pageTitle: pageContext?.title || "",
      lang,
    });
  }, [flowId, answers, name, note, pageContext, lang]);

  const handleSend = () => {
    if (!name.trim()) {
      alert(t.nameRequired);
      return;
    }
    const link = waLink(number, previewMessage);
    window.open(link, "_blank", "noopener,noreferrer");
    handleClose();
  };

  return (
    <div className="wa-assistant-root fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end safe-bottom safe-right max-w-[calc(100vw-2rem)]">
      {isOpen && (
        <div className="mb-4 w-[min(100vw-2rem,350px)] glass rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-orange/30 animate-fadeUp flex flex-col max-h-[min(80dvh,560px)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange via-golden to-purple p-4 text-white flex items-center gap-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Shreya creation"
              className="h-10 w-10 rounded-full object-cover border border-white/20"
            />
            <div>
              <h4 className="font-display text-lg leading-tight text-white">Shreya creation</h4>
              <span className="text-[10px] text-ink flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                {t.replies}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="ml-auto text-white/80 hover:text-white text-lg h-7 w-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors"
              aria-label={t.close}
            >
              ✕
            </button>
          </div>

          {/* Chat body */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-white min-h-0">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-orange/15 border border-orange/25 text-ink rounded-br-md"
                      : "bg-ink/5 border border-ink/10 text-ink rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Topic selection */}
            {phase === "topic" && (
              <div className="flex flex-col gap-2 pt-1">
                {flowOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => startFlow(opt.id)}
                    className="w-full text-left bg-ink/5 hover:bg-orange/15 border border-ink/15 hover:border-orange/40 text-ink text-xs px-4 py-3 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {pickLocalized(opt.label, lang)}
                    {opt.id === "product" && pageContext?.title && (
                      <span className="block text-[10px] text-ink/60 mt-0.5 truncate">
                        {pageContext.title}
                      </span>
                    )}
                    {opt.id === "coursePage" && pageContext?.title && (
                      <span className="block text-[10px] text-ink/60 mt-0.5 truncate">
                        {pageContext.title}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Follow-up options */}
            {phase === "followup" && currentStep && (
              <div className="flex flex-col gap-2 pt-1">
                {currentStep.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="w-full text-left bg-ink/5 hover:bg-orange/15 border border-ink/15 hover:border-orange/40 text-ink text-xs px-4 py-2.5 rounded-2xl transition-all duration-300"
                  >
                    {pickLocalized(opt, lang)}
                  </button>
                ))}
              </div>
            )}

            {/* Finalize: name + note + send */}
            {phase === "finalize" && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-orange font-semibold mb-1.5">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-ink/5 border border-ink/15 hover:border-orange/35 rounded-xl px-3.5 py-2.5 text-ink placeholder:text-ink/50 focus:border-orange focus:ring-1 focus:ring-orange/30 focus:outline-none text-xs"
                    placeholder={t.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-orange font-semibold mb-1.5">
                    {t.noteLabel}
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="w-full bg-ink/5 border border-ink/15 hover:border-orange/35 rounded-xl px-3.5 py-2.5 text-ink placeholder:text-ink/50 focus:border-orange focus:ring-1 focus:ring-orange/30 focus:outline-none text-xs resize-none"
                    placeholder={t.notePlaceholder}
                  />
                </div>
                {name.trim() && (
                  <div className="rounded-xl bg-ink/5 border border-ink/10 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-orange font-semibold mb-1.5">
                      {t.preview}
                    </p>
                    <p className="text-[11px] text-ink/80 whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto">
                      {previewMessage}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleSend}
                  className="w-full rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
                >
                  {t.send}
                </button>
                <button
                  onClick={reset}
                  className="w-full text-center text-[11px] text-ink/55 hover:text-orange transition-colors py-1"
                >
                  {t.back}
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleOpenToggle}
        aria-label={t.open}
        className="grid place-items-center h-14 w-14 rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 relative group"
        style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
      >
        <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff" aria-hidden="true">
          <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.8 5.5 2.2 7.9L.2 31.8l8.1-2.4c2.3 1.3 4.9 1.9 7.7 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.5 0-4.9-.7-7-1.9l-.5-.3-4.8 1.4 1.4-4.7-.3-.5c-1.4-2.2-2.1-4.7-2.1-7.3C2.6 8.6 8.6 2.6 16 2.6S29.4 8.6 29.4 16 23.4 28.8 16 28.8zm7.4-9.6c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.6.1-.3 0-.5 0-.7s-.9-2.1-1.2-2.9c-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-.9.5-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.3-.2-.7-.4z" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-green-500/20 -z-10 animate-ping" />
      </button>
    </div>
  );
}
