"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/shadcn/utils";

export interface Place {
  name: string;
  city?: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface PlacesAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (place: any) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

interface PhotonFeature {
  properties: {
    name?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    country?: string;
    [key: string]: unknown;
  };
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  value: externalValue,
  onChange,
  onSelect,
  placeholder = "Search for a place...",
  className,
  disabled = false,
  required = false,
  name,
  id,
}) => {
  const [query, setQuery] = useState<string>(externalValue || "");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastRequestTimeRef = useRef<number>(0);

  // Sync internal state with external prop if provided as controlled component
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== query) {
      setQuery(externalValue);
    }
  }, [externalValue, query]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Deduplicate places based on visible presentation label and geographic vicinity
  const deduplicatePlaces = (places: Place[]): Place[] => {
    const seen = new Set<string>();
    return places.filter((place) => {
      const normName = place.name.trim().toLowerCase();
      const normCity = (place.city || "").trim().toLowerCase();
      const normState = (place.state || "").trim().toLowerCase();
      const normCountry = (place.country || "").trim().toLowerCase();

      // Normalize city if it's identical to the place name
      const effectiveCity = normCity === normName ? "" : normCity;

      // Primary key: visible name + admin areas
      const labelKey = `${normName}|${effectiveCity}|${normState}|${normCountry}`;

      // Geo key: name + country + rounded coordinates (1 decimal place) to merge nearby duplicate nodes
      const approxLat = place.latitude.toFixed(1);
      const approxLng = place.longitude.toFixed(1);
      const geoKey = `${normName}|${normCountry}|${approxLat}|${approxLng}`;

      if (seen.has(labelKey) || seen.has(geoKey)) {
        return false;
      }
      seen.add(labelKey);
      seen.add(geoKey);
      return true;
    });
  };

  // Perform API Fetch with AbortController and Throttling safeguard
  const fetchPlaces = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setError(null);
      setIsOpen(false);
      return;
    }

    // Cancel any ongoing fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Throttle check: ensure requests are spaced out by at least 400ms
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimeRef.current;
    const minInterval = 400; // ms

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    lastRequestTimeRef.current = Date.now();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=10`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch places`);
      }

      const data = await response.json();
      const features: PhotonFeature[] = data.features || [];

      const parsedPlaces: Place[] = features.map((feature) => {
        const props = feature.properties;
        const [longitude, latitude] = feature.geometry.coordinates;

        const type = (props.type as string) || "";
        const isCityType = [
          "city",
          "municipality",
          "town",
          "locality",
          "village",
          "district",
        ].includes(type.toLowerCase());

        const city =
          props.city ||
          props.town ||
          props.village ||
          props.municipality ||
          props.locality ||
          props.district ||
          props.county ||
          (isCityType ? props.name : "") ||
          "";

        return {
          name: props.name || city || props.country || "Unknown Location",
          city,
          state: props.state || "",
          country: props.country || "",
          latitude,
          longitude,
        };
      });

      const uniquePlaces = deduplicatePlaces(parsedPlaces);
      setSuggestions(uniquePlaces);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // Request was intentionally cancelled; do not update UI with error
        return;
      }
      console.error("Photon API Error:", err);
      setError("Failed to fetch location suggestions.");
      setSuggestions([]);
      setIsOpen(true);
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, []);

  // Debounced input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) {
      onChange(val);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim().length < 2) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Debounce timer: wait 400ms after last keystroke
    debounceTimerRef.current = setTimeout(() => {
      fetchPlaces(val);
    }, 400);
  };

  // Selection Handler
  const handleSelectPlace = (place: Place) => {
    const formattedName = [place.name, place.city, place.country]
      .filter((item, index, self) => item && self.indexOf(item) === index)
      .join(", ");

    setQuery(formattedName);
    if (onChange) {
      onChange(formattedName);
    }
    if (onSelect) {
      onSelect(place);
    }
    setIsOpen(false);
    setActiveIndex(-1);
  };

  // Clear Input
  const handleClear = () => {
    setQuery("");
    if (onChange) {
      onChange("");
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setSuggestions([]);
    setIsOpen(false);
    setIsLoading(false);
    setError(null);
  };

  const scrollToIndex = (index: number) => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll("li");
      if (items[index]) {
        items[index].scrollIntoView({ block: "nearest" });
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" && query.trim().length >= 2) {
        fetchPlaces(query);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev < suggestions.length - 1 ? prev + 1 : 0;
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev > 0 ? prev - 1 : suggestions.length - 1;
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelectPlace(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  // Format secondary details (city, state, country) excluding duplicate name
  const formatLocationDetails = (place: Place) => {
    const details = [place.city, place.state, place.country].filter(
      (item): item is string => Boolean(item) && item !== place.name,
    );
    return details.join(", ");
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 || error) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete="off"
          className="w-full rounded-lg border border-input bg-background pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />

        <div className="absolute right-3 flex items-center gap-1">
          {isLoading && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
          {!isLoading && query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded-full focus:outline-none"
              aria-label="Clear input"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md overflow-hidden text-popover-foreground">
          {error ? (
            <div className="p-3 text-xs text-destructive text-center">
              {error}
            </div>
          ) : suggestions.length === 0 && !isLoading ? (
            <div className="p-3 text-xs text-muted-foreground text-center">
              No matching places found.
            </div>
          ) : (
            <ul
              ref={listRef}
              className="max-h-60 overflow-y-auto py-1 text-sm divide-y divide-border/30"
              role="listbox"
            >
              {suggestions.map((place, index) => {
                const isSelected = activeIndex === index;
                const details = formatLocationDetails(place);

                return (
                  <li
                    key={`${place.name}-${place.latitude}-${place.longitude}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectPlace(place)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex items-start gap-2.5 px-3 py-2 cursor-pointer transition-colors text-left",
                      isSelected
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50 text-foreground",
                    )}
                  >
                    <MapPin className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium leading-tight truncate">
                        {place.name}
                      </span>
                      {details && (
                        <span className="text-xs text-muted-foreground leading-tight truncate">
                          {details}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
