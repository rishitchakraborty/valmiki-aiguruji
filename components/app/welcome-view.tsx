import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  timeZone: string;
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
  timeZone: "Asia/Kolkata",
};

function WelcomeImage() {
  return (
    <img
      style={{
        height: "8em",
        width: "20em",
        marginBottom: "0.75em",
        filter: "drop-shadow(0 0 2px white)",
      }}
      src="../../guruji.png"
      alt="Quarkgen Logo"
      className="block size-6"
    />
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: (formData: UserFormData) => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<"div"> & WelcomeViewProps) => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    language: "english" as "hindi" | "english",
  });

  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>(DEFAULT_LOCATION);
  const [locationStatus, setLocationStatus] = useState<"detecting" | "detected" | "default">("detecting");

  const detectLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      setLocationStatus("detecting");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timeZone: tz,
          });
          setLocationStatus("detected");
        },
        (error) => {
          console.warn("Geolocation permission not approved or error, using Kolkata default:", error.message);
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

  // Fetch location from browser automatically on component mount
  useEffect(() => {
    detectLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.dateOfBirth.trim() ||
      !formData.timeOfBirth.trim() ||
      !formData.placeOfBirth.trim() ||
      !formData.language
    ) {
      alert("All fields are mandatory. Please fill in all details.");
      return;
    }
    onStartCall({
      ...formData,
      currentLocation,
    });
  };

  return (
    <div ref={ref} className="w-full max-w-md mx-auto px-4 py-4">
      <section className="bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
        <WelcomeImage />

        <h1 className="text-lg font-bold text-foreground mb-1">
          Vedic Astrology Consultation
        </h1>
        <p className="text-muted-foreground text-xs mb-5">
          Enter your birth details to generate your horoscope and begin voice
          consultation.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-3.5 text-left">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. John Doe"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Time of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={formData.timeOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, timeOfBirth: e.target.value })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Place of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.placeOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, placeOfBirth: e.target.value })
              }
              placeholder="e.g. New Delhi, India"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Separate Current Location Section with fetch button */}
          <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-foreground">
                  Current Location
                </span>
                <span className="text-[11px] text-muted-foreground block truncate">
                  {locationStatus === "detecting" && "Detecting current location..."}
                  {locationStatus === "detected" && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Lat: {currentLocation.latitude.toFixed(4)}, Long: {currentLocation.longitude.toFixed(4)}
                    </span>
                  )}
                  {locationStatus === "default" && (
                    <span>Default: Kolkata (22.5726, 88.3639)</span>
                  )}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={detectLocation}
                disabled={locationStatus === "detecting"}
                className="h-8 shrink-0 text-xs px-2.5 flex items-center gap-1.5"
              >
                {locationStatus === "detecting" ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="size-3 text-primary" />
                    <span>Fetch Location</span>
                  </>
                )}
              </Button>
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center justify-between border-t border-border/40 pt-1.5">
              <span>Timezone: {currentLocation.timeZone}</span>
              <span>
                {locationStatus === "detected" ? "Browser GPS Active" : "Default Mode"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.language}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: e.target.value as "hindi" | "english",
                })
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
            </select>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-5 w-full rounded-full font-mono text-xs font-bold tracking-wider uppercase"
          >
            {startButtonText || "Start Call"}
          </Button>
        </form>
      </section>
    </div>
  );
};
