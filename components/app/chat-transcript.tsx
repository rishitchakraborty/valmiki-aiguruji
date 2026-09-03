"use client";

import React from "react";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import { type ReceivedMessage, useAgent } from "@livekit/components-react";
import { Sparkles, Mic, Radio, Compass, Quote, Sun } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageResponse } from "@/components/ai-elements/message";
import type { UserFormData } from "@/components/app/welcome-view";
import { cn } from "@/lib/shadcn/utils";

const MotionContainer = motion.create("div");

const CONTAINER_MOTION_PROPS = {
  variants: {
    hidden: {
      opacity: 0,
      transition: {
        ease: "easeOut",
        duration: 0.25,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.25,
      },
    },
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
} satisfies HTMLMotionProps<"div">;

interface ChatTranscriptProps {
  hidden?: boolean;
  messages?: ReceivedMessage[];
  formData?: UserFormData;
  className?: string;
}

export function ChatTranscript({
  hidden = false,
  messages = [],
  formData,
  className,
  ...props
}: ChatTranscriptProps & Omit<HTMLMotionProps<"div">, "ref">) {
  const { state: agentState } = useAgent();

  const userName = formData?.name?.trim() || "Devotee";
  const userInitial = userName.charAt(0).toUpperCase() || "D";

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden",
        className,
      )}
    >
      <AnimatePresence>
        {!hidden && (
          <MotionContainer
            {...props}
            {...CONTAINER_MOTION_PROPS}
            className="flex h-full w-full flex-col overflow-hidden"
          >
            <Conversation className="h-full w-full px-3 sm:px-6">
              <ConversationContent className="flex flex-col gap-6 pt-5 pb-24 sm:pt-6 sm:pb-28">
                {/* Empty State: Breathtaking Devotional Welcome Sanctuary Hero */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mx-auto my-auto w-full max-w-lg text-center space-y-4 px-6 py-7 sm:py-9 rounded-3xl border border-amber-500/25 bg-gradient-to-b from-card/95 via-card/85 to-amber-500/5 backdrop-blur-2xl shadow-2xl golden-glow"
                  >
                    {/* Guruji Centered Avatar in Radiant Aura */}
                    <div className="relative mx-auto size-24 sm:size-28 rounded-full bg-gradient-to-b from-amber-500/25 via-amber-500/10 to-transparent p-1.5 border-2 border-amber-500/40 shadow-xl golden-glow/40 flex items-center justify-center">
                      <div className="size-full rounded-full overflow-hidden flex items-center justify-center bg-card">
                        <img
                          src="/guruji-portrait.png"
                          alt="Valmiki AI Guruji"
                          className="size-full rounded-full object-cover object-top scale-110"
                        />
                      </div>
                    </div>

                    {/* Vedic Shanti Mantra Invocation */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-serif italic text-amber-700/80 dark:text-amber-300/80 tracking-wide">
                        ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ।
                      </p>
                      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                        Pranaam, {formData?.name || "Devotee"} 🙏
                      </h2>
                    </div>

                    {/* Chart Calibration Subtitle */}
                    <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Kundli calibrated for{" "}
                      <strong className="text-foreground font-semibold">
                        {formData?.placeOfBirth || "Birth Location"}
                      </strong>{" "}
                      ({formData?.dateOfBirth || "Birth Details Active"}).
                      Valmiki AI Guruji is listening to your voice.
                    </p>

                    {/* Suggested Question Pills */}
                    <div className="pt-2 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 px-3 text-xs text-foreground/90 backdrop-blur-xs flex items-center gap-2 transition-all hover:border-amber-500/40 hover:bg-amber-500/10">
                          <span className="text-sm">🪐</span>
                          <span className="text-[11px] font-medium leading-snug">
                            मेरी वर्तमान महादशा और उसका प्रभाव?
                          </span>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 px-3 text-xs text-foreground/90 backdrop-blur-xs flex items-center gap-2 transition-all hover:border-amber-500/40 hover:bg-amber-500/10">
                          <span className="text-sm">💼</span>
                          <span className="text-[11px] font-medium leading-snug">
                            What does my chart say about career growth?
                          </span>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 px-3 text-xs text-foreground/90 backdrop-blur-xs flex items-center gap-2 transition-all hover:border-amber-500/40 hover:bg-amber-500/10">
                          <span className="text-sm">🕉️</span>
                          <span className="text-[11px] font-medium leading-snug">
                            Which Vedic remedies or mantras are best for me?
                          </span>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 px-3 text-xs text-foreground/90 backdrop-blur-xs flex items-center gap-2 transition-all hover:border-amber-500/40 hover:bg-amber-500/10">
                          <span className="text-sm">🔮</span>
                          <span className="text-[11px] font-medium leading-snug">
                            How are current planetary transits affecting me?
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Live Mic Listening Pulse */}
                    <div className="pt-2 border-t border-border/40">
                      <div className="flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        <Mic className="size-3.5 animate-pulse" />
                        <span>Speak naturally into your microphone...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Messages Feed */}
                {messages.map((receivedMessage) => {
                  const { id, timestamp, from, message } = receivedMessage;
                  const isUser = from?.isLocal === true;
                  const locale =
                    typeof navigator !== "undefined"
                      ? navigator.language
                      : "en-US";
                  const time = new Date(timestamp);
                  const formattedTime = time.toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  if (isUser) {
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-end gap-1.5 ml-auto w-full max-w-[90%] sm:max-w-[82%]"
                      >
                        {/* User Header */}
                        <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
                          <span>{formattedTime}</span>
                          <span className="font-semibold text-foreground">
                            {userName}
                          </span>
                          <div className="size-5 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                            {userInitial}
                          </div>
                        </div>

                        {/* User Message Bubble */}
                        <div className="rounded-2xl rounded-tr-xs border border-border/80 bg-muted/80 dark:bg-muted/50 p-3.5 sm:p-4 shadow-sm backdrop-blur-md text-foreground text-xs sm:text-sm leading-relaxed">
                          <MessageResponse>{message}</MessageResponse>
                        </div>
                      </motion.div>
                    );
                  }

                  // Assistant (Guruji) Message
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-start gap-1.5 mr-auto w-full max-w-[96%] sm:max-w-[90%]"
                    >
                      {/* Guruji Header */}
                      <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
                        <div className="size-7 shrink-0 rounded-full bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent p-0.5 border border-amber-500/40 shadow-xs flex items-center justify-center overflow-hidden bg-card">
                          <img
                            src="/guruji-portrait.png"
                            alt="Guruji"
                            className="size-full rounded-full object-cover object-top scale-110"
                          />
                        </div>
                        <span className="font-bold text-foreground">
                          Valmiki AI Guruji
                        </span>
                        <span className="rounded-md bg-amber-500/15 px-1.5 py-0.2 text-[9px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          Vedic Guide
                        </span>
                        <span className="ml-auto">{formattedTime}</span>
                      </div>

                      {/* Guruji Message Bubble */}
                      <div className="rounded-2xl rounded-tl-xs border border-amber-500/25 bg-gradient-to-br from-amber-500/5 via-card/95 to-amber-500/10 p-4 sm:p-5 shadow-md golden-glow/20 backdrop-blur-md text-foreground text-xs sm:text-sm sm:text-[14.5px] leading-relaxed">
                        <MessageResponse>{message}</MessageResponse>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Astrological Contemplating State */}
                <AnimatePresence>
                  {agentState === "thinking" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="flex items-center gap-3 rounded-2xl border border-amber-500/35 bg-amber-500/10 dark:bg-amber-400/10 p-3 px-4 text-xs text-amber-800 dark:text-amber-200 backdrop-blur-md shadow-sm max-w-md mr-auto golden-glow/30"
                    >
                      <Sparkles
                        className="size-4 text-amber-500 animate-spin shrink-0"
                        style={{ animationDuration: "3s" }}
                      />
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground">
                          Guruji is analyzing your horoscope...
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Synthesizing planetary aspects, Dasha periods & Gochar transits
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ConversationContent>

              <ConversationScrollButton />
            </Conversation>
          </MotionContainer>
        )}
      </AnimatePresence>
    </div>
  );
}
