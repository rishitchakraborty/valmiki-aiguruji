"use client";

import React, { useEffect, useRef, useState } from "react";
import { HTMLMotionProps, motion } from "motion/react";
import { ConnectionState, RoomEvent } from "livekit-client";
import {
  useRoomContext,
  useSessionContext,
  useSessionMessages,
  useVoiceAssistant,
} from "@livekit/components-react";
import {
  Compass,
  Sparkles,
  Radio,
  User,
  Calendar,
  Clock,
  MapPin,
  Globe,
  ShieldCheck,
  Flame,
  BookOpen,
  Volume2,
  Activity,
  Layers,
  Award,
} from "lucide-react";
import type { AppConfig } from "@/app-config";
import type { UserFormData } from "@/components/app/welcome-view";
import {
  AgentControlBar,
  type AgentControlBarControls,
} from "@/components/agents-ui/agent-control-bar";
import { ChatTranscript } from "@/components/app/chat-transcript";
import { cn } from "@/lib/shadcn/utils";

const MotionBottom = motion.create("div");

const BOTTOM_VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      translateY: "0%",
    },
    hidden: {
      opacity: 0,
      translateY: "100%",
    },
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  transition: {
    duration: 0.3,
    delay: 0.15,
    ease: "easeOut",
  },
} satisfies HTMLMotionProps<"div">;

interface SessionViewProps {
  appConfig: AppConfig;
  formData: UserFormData;
}

export const SessionView = ({
  appConfig,
  formData,
  ...props
}: React.ComponentProps<"section"> & SessionViewProps) => {
  const session = useSessionContext();
  const room = useRoomContext();
  const { messages } = useSessionMessages(session);
  const { state: agentState } = useVoiceAssistant();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Live session timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const controls: AgentControlBarControls = {
    leave: true,
    microphone: true,
    chat: false,
    camera: false,
    screenShare: false,
  };

  useEffect(() => {
    if (!room) return;

    let isMounted = true;
    let hasPublished = false;

    const sendBirthDetails = async () => {
      if (hasPublished || !isMounted) return;
      if (room.state !== ConnectionState.Connected) return;

      if (room.remoteParticipants.size === 0) {
        console.log("Waiting for agent to join room before sending birth_details...");
        return;
      }

      try {
        const payload = {
          type: "birth_details",
          topic: "birth_details",
          name: formData.name,
          date_of_birth: formData.dateOfBirth,
          time_of_birth: formData.timeOfBirth,
          place_of_birth: formData.placeOfBirth,
          language: formData.language,
          current_location: formData.currentLocation,
        };

        const data = new TextEncoder().encode(JSON.stringify(payload));

        await room.localParticipant.publishData(data, {
          reliable: true,
          topic: "birth_details",
        });

        hasPublished = true;
        console.log("Successfully published birth_details to agent:", payload);
      } catch (err) {
        console.error("Error publishing birth_details to agent:", err);
      }
    };

    const intervalId = setInterval(() => {
      if (hasPublished || !isMounted) {
        clearInterval(intervalId);
        return;
      }
      sendBirthDetails();
    }, 1000);

    const handleParticipantConnected = () => {
      console.log("Participant connected, sending birth_details...");
      sendBirthDetails();
    };

    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    sendBirthDetails();

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
    };
  }, [room]);

  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;

    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section
      className="celestial-bg relative z-10 h-svh w-svw overflow-hidden flex flex-col"
      {...props}
    >
      {/* Dynamic Ambient Background Glow Lights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 -z-10 size-[30rem] rounded-full bg-amber-500/12 blur-[100px] animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 right-1/4 -z-10 size-[36rem] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse"
        style={{ animationDuration: "10s" }}
      />

      {/* Main Studio 3-Panel Layout */}
      <div className="relative z-20 flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-16 sm:pt-18 pb-4 h-[calc(100svh-0px)] grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden">
        
        {/* ================= LEFT COLUMN: VEDIC SANCTUARY & TELEMETRY ================= */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4 overflow-y-auto pr-1 pb-4 scrollbar-none">
          
          {/* Card 1: Valmiki AI Guruji Sanctuary Card */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-card/95 via-card/85 to-amber-500/5 p-4 backdrop-blur-2xl shadow-xl golden-glow space-y-3.5">
            <div className="flex items-center gap-3.5">
              <div className="relative size-14 shrink-0 rounded-full bg-gradient-to-b from-amber-500/25 via-amber-500/10 to-transparent p-1 border-2 border-amber-500/40 shadow-lg golden-glow/40 flex items-center justify-center">
                <img
                  src="/guruji-portrait.png"
                  alt="Valmiki AI Guruji"
                  className="size-full rounded-full object-cover object-top scale-110"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                    Valmiki AI Guruji
                  </h3>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.2 text-[9px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/25">
                    Vedic Guide
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  Parashari & Jaimini Jyotish AI
                </p>
              </div>
            </div>

            {/* Live Audio Visualizer State Strip */}
            <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  {agentState === "speaking" ? (
                    <>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-80" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-amber-500" />
                    </>
                  ) : (
                    <>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                    </>
                  )}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {agentState === "speaking"
                    ? "Guruji Speaking"
                    : agentState === "thinking"
                    ? "Analyzing Chart..."
                    : "Voice Stream Active"}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground font-medium">
                &lt;250ms
              </span>
            </div>
          </div>

          {/* Card 2: Devotee Kundli Profile & Coordinates */}
          <div className="rounded-2xl border border-border/80 bg-card/90 p-4 backdrop-blur-xl shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-foreground tracking-tight">
                  Kundli Coordinates
                </span>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                Lagna Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                  <User className="size-3 text-muted-foreground" /> Devotee
                </span>
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {formData.name || "Aarav Sharma"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                  <Calendar className="size-3 text-muted-foreground" /> Date of Birth
                </span>
                <span className="font-medium text-foreground text-[11px]">
                  {formData.dateOfBirth || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                  <Clock className="size-3 text-muted-foreground" /> Time of Birth
                </span>
                <span className="font-medium text-foreground text-[11px]">
                  {formData.timeOfBirth || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                  <MapPin className="size-3 text-muted-foreground" /> Birth Place
                </span>
                <span className="font-medium text-foreground truncate max-w-[150px] text-[11px]">
                  {formData.placeOfBirth || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                  <Globe className="size-3 text-muted-foreground" /> Language
                </span>
                <span className="font-medium text-foreground text-[11px]">
                  {formData.language === "hindi" ? "🇮🇳 हिंदी (Hindi)" : "🌐 English"}
                </span>
              </div>
            </div>

            {/* Transit Telemetry */}
            <div className="pt-2 border-t border-border/40 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Transit Sky Location</span>
                <span className="font-mono text-foreground/90 font-medium">
                  {formData.currentLocation.latitude.toFixed(2)}°N, {formData.currentLocation.longitude.toFixed(2)}°E
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug">
                Real-time Gochar and Bhava planetary houses synchronized.
              </p>
            </div>
          </div>

          {/* Card 3: Navagraha Systems Active */}
          <div className="rounded-2xl border border-border/80 bg-card/75 p-3.5 backdrop-blur-md text-xs space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-foreground text-[11px]">
              <Layers className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span>Astrological Systems Active</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-1.5 text-center font-medium text-foreground">
                🪐 Vimshottari Dasha
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-1.5 text-center font-medium text-foreground">
                ☀️ Surya Lagna
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-1.5 text-center font-medium text-foreground">
                🌙 Chandra Rashi
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-1.5 text-center font-medium text-foreground">
                🌌 Gochar Transit
              </div>
            </div>
          </div>

          {/* Card 4: Sanctuary Privacy */}
          <div className="rounded-2xl border border-border/70 bg-card/60 p-3 backdrop-blur-md text-[11px] text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span className="text-[10px] leading-tight">
              100% Confidential & Ephemeral Voice Stream
            </span>
          </div>
        </aside>

        {/* ================= CENTER COLUMN: CONVERSATION STUDIO ================= */}
        <main className="col-span-12 lg:col-span-6 flex flex-col relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-500/25 bg-card/75 backdrop-blur-2xl shadow-2xl golden-glow/20">
          
          {/* Top Consultation Studio Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-card/85 text-xs backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-foreground text-xs truncate">
                {formData.name || "Live Consultation"}
              </span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground text-[11px] hidden sm:inline truncate">
                {formData.placeOfBirth}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Live Session Timer */}
              <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-foreground">
                <Clock className="size-2.5 text-muted-foreground" />
                <span>{formatTimer(secondsElapsed)}</span>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                Kundli Synced
              </span>
            </div>
          </div>

          {/* Transcript Scroll Area */}
          <div className="relative flex-1 overflow-hidden">
            <ChatTranscript
              hidden={false}
              messages={messages}
              formData={formData}
            />
          </div>

          {/* Floating Bottom Luxury Controls (Mute & End Call) */}
          <div className="absolute inset-x-4 bottom-3 sm:bottom-4 z-40 flex justify-center pointer-events-none">
            <div className="rounded-full border border-amber-500/35 bg-card/95 p-1 sm:p-1.5 shadow-2xl backdrop-blur-2xl golden-glow pointer-events-auto transition-transform duration-200 hover:scale-[1.02]">
              <AgentControlBar
                variant="livekit"
                controls={controls}
                isConnected={session.isConnected}
                onDisconnect={session.end}
                className="border-none bg-transparent p-0 drop-shadow-none"
              />
            </div>
          </div>
        </main>

        {/* ================= RIGHT COLUMN: VEDIC INQUIRY DOMAINS ================= */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4 overflow-y-auto pl-1 pb-4 scrollbar-none">
          
          {/* Card 1: Vedic Guidance Focus & Inquiry Domains */}
          <div className="rounded-2xl border border-border/80 bg-card/90 p-4 backdrop-blur-xl shadow-md space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-foreground tracking-tight">
                Vedic Inquiry Focus
              </span>
            </div>

            <div className="space-y-2">
              <div className="group rounded-xl border border-border/70 bg-muted/30 p-2.5 space-y-0.5 transition-all hover:border-amber-500/40 hover:bg-amber-500/5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">
                  <span>🪐</span>
                  <span>Dasha & Planetary Transits</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  Current Mahadasha, Antardasha, Sade Sati & Rahu-Ketu impacts.
                </p>
              </div>

              <div className="group rounded-xl border border-border/70 bg-muted/30 p-2.5 space-y-0.5 transition-all hover:border-amber-500/40 hover:bg-amber-500/5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">
                  <span>💼</span>
                  <span>Career & Artha (Wealth)</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  10th house strength, auspicious timing for ventures & profession.
                </p>
              </div>

              <div className="group rounded-xl border border-border/70 bg-muted/30 p-2.5 space-y-0.5 transition-all hover:border-amber-500/40 hover:bg-amber-500/5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">
                  <span>🕉️</span>
                  <span>Vedic Remedies & Upayas</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  Prescribed gemstones, Rudraksha, Daan, Yantras & Stotrams.
                </p>
              </div>

              <div className="group rounded-xl border border-border/70 bg-muted/30 p-2.5 space-y-0.5 transition-all hover:border-amber-500/40 hover:bg-amber-500/5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">
                  <span>❤️</span>
                  <span>Vivah & Relationships</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  7th house analysis, Mangal dosha, and matrimonial harmony.
                </p>
              </div>

              <div className="group rounded-xl border border-border/70 bg-muted/30 p-2.5 space-y-0.5 transition-all hover:border-amber-500/40 hover:bg-amber-500/5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">
                  <span>🌿</span>
                  <span>Swasthya & Ayur-Jyotish</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  Mind-body dosha balance, mental serenity & vitality insights.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Classical Scripture Shastras Reference */}
          <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-card/85 to-indigo-500/10 p-3.5 backdrop-blur-md space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-foreground text-[11px]">
              <BookOpen className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span>Classical Jyotish Shastras</span>
            </div>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              Synthesized in accordance with <em>Brihat Parashara Hora Shastra</em> & <em>Jaimini Upadesha Sutras</em>.
            </p>
          </div>
        </aside>

      </div>
    </section>
  );
};
