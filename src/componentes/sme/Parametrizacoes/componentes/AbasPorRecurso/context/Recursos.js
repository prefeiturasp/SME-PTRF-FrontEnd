import { createContext, useMemo, useState } from 'react';

const initialSelectedRecurso = null;

export const RecursosContext = createContext({
  selectedRecurso: initialSelectedRecurso,
  setSelectedRecurso: () => {},
  clickBtnEscolheOpcao: {},
  setClickBtnEscolheOpcao: () => {}
})

export const RecursosProvider = ({children}) => {

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
    <RecursosContext.Provider value={contextValue}>
      {children}
    </RecursosContext.Provider>
  )

}