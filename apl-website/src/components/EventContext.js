import { createContext, useContext, useState, useEffect } from "react";

const EventContext = createContext({
  thisEvent: null,
  setThisEvent: () => {},
});

export function useEventContext() {
  return useContext(EventContext);
}

export function EventContextProvider({ children }) {
  const [thisEvent, setThisEvent] = useState(null);

  useEffect(() => {
    console.log("event changed", thisEvent);
  }, [thisEvent]);

  return (
    <div>
      <EventContext.Provider
        value={{ thisEvent, setThisEvent }}
      >
        {children}
      </EventContext.Provider>
    </div>
  );
}
