import React, {createContext, useMemo, useState} from 'react';

export const BarraMensagemFixaContext = createContext({
  mensagem: '',
  setMensagem: () => {},
  url: '',
  setUrl: () => {},
  txtBotao: '',
  setTxtBotao: () => {},
  exibeBotao: true,
  setExibeBotao: () => {}
});

export function BarraMensagemFixaProvider({children, mensagem: mensagemProp, exibeBotao: exibeBotaoProp, url: urlProp, txtBotao: txtBotaoProp, fixed = false}) {
  const [mensagem, setMensagem] = useState(mensagemProp ?? 'Há um novo mandato em andamento. É necessário atualizar os novos membros.');
  const [url, setUrl] = useState(urlProp ?? '/membros-da-associacao');
  const [txtBotao, setTxtBotao] = useState(txtBotaoProp ?? 'Ver informações');
  const [exibeBotao, setExibeBotao] = useState(exibeBotaoProp ?? true);

  const contextValue = useMemo(() => {
    return {
      mensagem,
      setMensagem,
      url,
      setUrl,
      txtBotao,
      setTxtBotao,
      exibeBotao,
      setExibeBotao
    };
  }, [mensagem, url, txtBotao, exibeBotao]);

  return (
      <BarraMensagemFixaContext.Provider value={contextValue}>
        {fixed ? (
          <div className="barra-mensagem-fixa-container">
            {children}
          </div>
        ) : (
          children
        )}
      </BarraMensagemFixaContext.Provider>
  );
}
