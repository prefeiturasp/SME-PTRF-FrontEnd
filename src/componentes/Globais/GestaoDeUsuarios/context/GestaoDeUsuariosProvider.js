import React, { createContext, useMemo, useState } from 'react';

const initialFilter = {
  search: '',
  grupo: '',
  tipoUsuario: '',
};

export const GestaoDeUsuariosContext = createContext({
  filter: initialFilter,
  setFilter: () => {},
  initialFilter: initialFilter,
});

export function GestaoDeUsuariosProvider({ children }) {
  const [filter, setFilter] = useState(initialFilter);

  const contextValue = useMemo(() => {
    return { filter, setFilter, initialFilter };
  }, [filter]);

  return (
    <GestaoDeUsuariosContext.Provider value={contextValue}>
      {children}
    </GestaoDeUsuariosContext.Provider>
  );
}
