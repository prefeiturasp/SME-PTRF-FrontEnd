import { createContext, useMemo, useState } from 'react';

const initialSelectedRecurso = null;

export const AbasPorRecursosContext = createContext({
  selectedRecurso: initialSelectedRecurso,
  setSelectedRecurso: () => {},
  clickBtnEscolheOpcao: {},
  setClickBtnEscolheOpcao: () => {}
})

export const AbasPorRecursosProvider = ({children}) => {

  const [selectedRecurso, setSelectedRecurso] = useState(initialSelectedRecurso)
  const [clickBtnEscolheOpcao, setClickBtnEscolheOpcao] = useState({});

  const contextValue = useMemo(() => {
    return {
      selectedRecurso,
      setSelectedRecurso,
      clickBtnEscolheOpcao,
      setClickBtnEscolheOpcao
    };
  }, [selectedRecurso, clickBtnEscolheOpcao]);

  return (
    <AbasPorRecursosContext.Provider value={contextValue}>
      {children}
    </AbasPorRecursosContext.Provider>
  )

}