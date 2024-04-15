import { createContext, useContext, useState, useEffect } from "react";

const PanelContext = createContext({
  panelVisible: false,
  setPanelVisible: () => {},
  setPanelVisibleTest: () => {},
});

export function usePanelContext() {
  return useContext(PanelContext);
}

const setPanelVisibleTest = () => {
    console.log("setPanelVisible");
};



export function PanelContextProvider({children}) {
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    console.log("panelVisible", panelVisible);
  }, [panelVisible]);

  return (
    <div>
      <PanelContext.Provider value={{ panelVisible, setPanelVisible, setPanelVisibleTest }}>
        {children}
      </PanelContext.Provider>
    </div>
  );
}
