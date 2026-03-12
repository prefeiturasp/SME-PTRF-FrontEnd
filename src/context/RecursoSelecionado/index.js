import { createContext, useContext } from "react";
import useRecursoSelecionado from "../../hooks/Globais/useRecursoSelecionado";
import { visoesService } from "../../services/visoes.service";

const RecursoSelecionadoContext = createContext(null);

export const RecursoSelecionadoProvider = ({ children }) => {
  const value = useRecursoSelecionado({ visoesService });
  return (
    <RecursoSelecionadoContext.Provider value={value}>
      {children}
    </RecursoSelecionadoContext.Provider>
  );
};

export const useRecursoSelecionadoContext = () => useContext(RecursoSelecionadoContext);
