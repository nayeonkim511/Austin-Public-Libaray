import { createContext, useContext, useState, useEffect } from "react";

const ModalContext = createContext({
  isClicked: false,
  setIsClicked: () => {},
  modalEvent: null,
  setModalEvent: () => {},
});

export function useModalContext() {
  return useContext(ModalContext);
}

export function ModalContextProvider({ children }) {
  const [isClicked, setIsClicked] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  useEffect(() => {
    console.log("click event", modalEvent);
  }, [modalEvent]);

  useEffect(() => {
    console.log("change click", isClicked);
  }, [isClicked]);

  return (
    <div>
      <ModalContext.Provider
        value={{ isClicked, setIsClicked, modalEvent, setModalEvent }}
      >
        {children}
      </ModalContext.Provider>
    </div>
  );
}
