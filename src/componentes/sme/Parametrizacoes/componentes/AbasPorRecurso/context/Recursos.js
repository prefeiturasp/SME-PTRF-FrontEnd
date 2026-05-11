import { createContext, useMemo, useState } from 'react';

const initialSelectedRecurso = null;

export const AbasPorRecursoContext = createContext({
  selectedRecurso: initialSelectedRecurso,
  setSelectedRecurso: () => {},
  clickBtnEscolheOpcao: {},
  setClickBtnEscolheOpcao: () => {}
})

export const AbasPorRecursoProvider = ({children}) => {

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
    <AbasPorRecursoContext.Provider value={contextValue}>
      {children}
    </AbasPorRecursoContext.Provider>
  )

}