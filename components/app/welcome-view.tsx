"use client";

import { useState, useEffect, forwardRef } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Sparkles,
  Mic,
  Compass,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
  Radio,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlacesAutocomplete, type Place } from "@/components/ui/places-autocomplete";
import { cn } from "@/lib/shadcn/utils";

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  timeZone: number;
}

export interface UserFormData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  language: "hindi" | "english";
  currentLocation: CurrentLocation;
}

const DEFAULT_LOCATION: CurrentLocation = {
  latitude: 22.5726,
  longitude: 88.3639,
  timeZone: 5.5,
};

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: (formData: UserFormData) => void;
}

export const WelcomeView = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & WelcomeViewProps
>(({ startButtonText, onStartCall, className, ...props }, ref) => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    language: "hindi" as "hindi" | "english",
  });

  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>(DEFAULT_LOCATION);
  const [locationStatus, setLocationStatus] = useState<"detecting" | "detected" | "default">("detecting");
  const [validationError, setValidationError] = useState<string | null>(null);

  const detectLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      setLocationStatus("detecting");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const tzOffset = -new Date().getTimezoneOffset() / 60;
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timeZone: tzOffset,
          });
          setLocationStatus("detected");
        },
        (error) => {
          console.warn("Geolocation permission error or rejected, using default Kolkata location:", error.message);
          setCurrentLocation(DEFAULT_LOCATION);
          setLocationStatus("default");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setCurrentLocation(DEFAULT_LOCATION);
      setLocationStatus("default");
    }
  };

  // Automatically detect location on initial mount
  useEffect(() => {
    detectLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setValidationError("Please enter your full name.");
      return;
    }
    if (!formData.dateOfBirth.trim()) {
      setValidationError("Please specify your date of birth.");
      return;
    }
    if (!formData.timeOfBirth.trim()) {
      setValidationError("Please specify your time of birth for accurate Lagna (Ascendant).");
      return;
    }
    if (!formData.placeOfBirth.trim()) {
      setValidationError("Please specify your place of birth.");
      return;
    }
    if (!formData.language) {
      setValidationError("Please select your consultation language.");
      return;
    }

    setValidationError(null);
    onStartCall({
      ...formData,
      currentLocation,
    });
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12",
        className
      )}
      {...props}
    >
      {/* Subtle Background Glow Circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/4 -z-10 size-72 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-400/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 right-1/4 -z-10 size-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Hero & Vedic Brand Showcase */}
        <div className="lg:col-span-6 space-y-6 lg:space-y-8 text-left">
          {/* Top Vedic Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 backdrop-blur-md shadow-xs">
            <Sparkles className="size-3.5 text-amber-500 animate-pulse" />
            <span>AI-Powered Vedic Jyotish Consultation</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Divine Vedic Wisdom,{" "}
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-200 bg-clip-text text-transparent">
                Spoken in Real Time
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Connect directly with <strong className="text-foreground font-semibold">Valmiki AI Guruji</strong>.
              Enter your birth coordinates to synthesize your personalized Kundli, planetary dashas, and daily transits through natural voice dialogue.
            </p>
          </div>

          {/* Guruji Brand Showcase Card */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card/90 to-indigo-500/5 p-4 sm:p-5 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-amber-500/40">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <div className="relative shrink-0 rounded-2xl bg-gradient-to-b from-amber-500/20 to-transparent p-2.5 border border-amber-500/30 shadow-inner">
                <img
                  src="/guruji.png"
                  alt="Valmiki AI Guruji"
                  className="h-20 sm:h-24 w-auto object-contain drop-shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                  <span className="size-2 rounded-full bg-white animate-ping opacity-75 absolute" />
                  <span className="size-2 rounded-full bg-white" />
                </div>
              </div>
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Valmiki AI Guruji
                  </h2>
                  <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    Vedic Guide
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Synthesizes Parashari & Jaimini principles with ultra-low latency voice responses.
                </p>
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Radio className="size-3 text-emerald-500" />
                    Live Voice AI
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="size-3 text-amber-500" />
                    Hindi & English
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Three Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 backdrop-blur-xs">
              <div className="flex items-center gap-2 mb-1 text-amber-600 dark:text-amber-400">
                <Compass className="size-4" />
                <span className="text-xs font-semibold text-foreground">Precision Kundli</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Accurate Lagna, Bhavas & planetary degrees calculated to the second.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 backdrop-blur-xs">
              <div className="flex items-center gap-2 mb-1 text-amber-600 dark:text-amber-400">
                <Mic className="size-4" />
                <span className="text-xs font-semibold text-foreground">Natural Voice</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Speak freely. Ask follow-up questions, remedies, and life guidance.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 backdrop-blur-xs">
              <div className="flex items-center gap-2 mb-1 text-amber-600 dark:text-amber-400">
                <ShieldCheck className="size-4" />
                <span className="text-xs font-semibold text-foreground">100% Confidential</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Private consultation session with strict ephemeral processing.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Consultation Intake Card */}
        <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
          <section className="relative rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl golden-glow text-left">
            {/* Form Header */}
            <div className="mb-5 space-y-1.5 pb-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Compass className="size-4" />
                </span>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Enter Birth Details
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Precision coordinates ensure accurate planetary placements and rising sign (Lagna).
              </p>
            </div>

            {/* Validation Alert */}
            {validationError && (
              <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="size-4 shrink-0" />
                <span className="font-medium">{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                  <User className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Date & Time of Birth (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => {
                        setFormData({ ...formData, dateOfBirth: e.target.value });
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                    <Calendar className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Time of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="time"
                      required
                      value={formData.timeOfBirth}
                      onChange={(e) => {
                        setFormData({ ...formData, timeOfBirth: e.target.value });
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                    <Clock className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Place of Birth with PlacesAutocomplete */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Place of Birth <span className="text-red-500">*</span>
                </label>
                <PlacesAutocomplete
                  value={formData.placeOfBirth}
                  onChange={(val) => {
                    setFormData((prev) => ({ ...prev, placeOfBirth: val }));
                    if (validationError) setValidationError(null);
                  }}
                  onSelect={(place: Place) => {
                    const formatted = [place.name, place.city, place.country]
                      .filter((item, index, self) => item && self.indexOf(item) === index)
                      .join(", ");
                    setFormData((prev) => ({ ...prev, placeOfBirth: formatted }));
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Search birth city, town, or village..."
                  required
                  className="w-full"
                />
                <span className="block mt-1 text-[11px] text-muted-foreground">
                  Exact birth place calibrates your geographic coordinates and house divisions.
                </span>
              </div>

              {/* Current Transit Location Telemetry Widget */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-xs font-semibold text-foreground truncate">
                      Current Transit Location
                    </span>
                    {locationStatus === "detecting" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        <Loader2 className="size-2.5 animate-spin" />
                        Syncing
                      </span>
                    )}
                    {locationStatus === "detected" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        GPS Synced
                      </span>
                    )}
                    {locationStatus === "default" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Kolkata Standard
                      </span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={detectLocation}
                    disabled={locationStatus === "detecting"}
                    className="h-7 text-[11px] px-2.5 gap-1 shrink-0 cursor-pointer hover:border-amber-500/50"
                  >
                    {locationStatus === "detecting" ? (
                      <>
                        <Loader2 className="size-3 animate-spin" />
                        <span>Locating...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="size-3 text-muted-foreground" />
                        <span>Update GPS</span>
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span className="font-mono text-[10px] text-foreground/80">
                    {currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E
                  </span>
                  <span className="text-[10px]">
                    UTC{currentLocation.timeZone >= 0 ? `+${currentLocation.timeZone}` : currentLocation.timeZone}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 leading-tight">
                  Calibrates real-time planetary transits (Gochar) and Prashna Kundli with your current sky.
                </p>
              </div>

              {/* Language Selection: Interactive Pill Buttons */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Consultation Language <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, language: "hindi" });
                      if (validationError) setValidationError(null);
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all cursor-pointer",
                      formData.language === "hindi"
                        ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 shadow-xs ring-1 ring-amber-500/30"
                        : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span className="text-sm">🇮🇳</span>
                    <span>हिंदी (Hindi)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, language: "english" });
                      if (validationError) setValidationError(null);
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all cursor-pointer",
                      formData.language === "english"
                        ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 shadow-xs ring-1 ring-amber-500/30"
                        : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span className="text-sm">🌐</span>
                    <span>English</span>
                  </button>
                </div>
              </div>

              {/* Start Call CTA Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="relative w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base tracking-wide"
                >
                  <Mic className="size-4 sm:size-5 animate-pulse" />
                  <span>{startButtonText || "Start Voice Consultation"}</span>
                  <ArrowRight className="size-4 sm:size-5 ml-1" />
                </Button>
                <div className="mt-2 text-center">
                  <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                    Encrypted • Real-time voice stream • Instant connect
                  </span>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
});

WelcomeView.displayName = "WelcomeView";
