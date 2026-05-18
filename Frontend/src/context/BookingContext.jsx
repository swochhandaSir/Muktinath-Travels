import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState("");

  const openBookingForm = useCallback((bikeName = "") => {
    setSelectedBike(bikeName || "");
    setIsBookingOpen(true);
  }, []);

  const closeBookingForm = useCallback(() => {
    setIsBookingOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isBookingOpen,
      selectedBike,
      openBookingForm,
      closeBookingForm,
    }),
    [isBookingOpen, selectedBike, openBookingForm, closeBookingForm],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return ctx;
}
