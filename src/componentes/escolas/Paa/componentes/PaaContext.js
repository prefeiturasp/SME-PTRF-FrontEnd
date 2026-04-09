import { createContext, useContext } from "react";

export const PaaContext = createContext(null);

export const usePaaContext = () => {
  const context = useContext(PaaContext);
  if (context === null) {
    throw new Error("usePaaContext deve ser usado dentro de um PaaContext.Provider");
  }
  return context;
};
