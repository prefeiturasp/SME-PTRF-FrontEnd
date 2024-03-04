import React, {createContext, useMemo, useState} from 'react';

export const BarraMensagemFixaContext = createContext({
  mensagem: '',
  setMensagem: () => {},
  url: '',
  setUrl: () => {},
  txtBotao: '',
  setTxtBotao: () => {}
});

export function BarraMensagemFixaProvider({children}) {
  const [mensagem, setMensagem] = useState('Há um novo mandato em andamento. É necessário atualizar os novos membros.');
  const [url, setUrl] = useState('/membros-da-associacao');
  const [txtBotao, setTxtBotao] = useState('Ver informações');

  const contextValue = useMemo(() => {
    return {
      mensagem,
      setMensagem,
      url,
      setUrl,
      txtBotao,
      setTxtBotao
    };
  }, [mensagem, url, txtBotao]);

  return (
      <BarraMensagemFixaContext.Provider value={contextValue}>
        {children}
      </BarraMensagemFixaContext.Provider>
  );
}
