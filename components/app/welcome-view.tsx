import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface UserFormData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  language: "hindi" | "english";
}

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
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    language: "english",
  });

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
    onStartCall(formData);
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
