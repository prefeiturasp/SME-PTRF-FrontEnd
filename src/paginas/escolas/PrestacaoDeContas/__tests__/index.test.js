import { render } from "@testing-library/react";
import { useParams } from "react-router-dom";
import React  from "react";
import { PrestacaoDeContasPage } from "../index";
import { PrestacaoDeContas } from "../../../../componentes/escolas/PrestacaoDeContas";
import {NotificacaoContext} from "../../../../context/Notificacoes";

// Mockando useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../../componentes/escolas/PrestacaoDeContas", () => ({
  PrestacaoDeContas: jest.fn(() => <div>Prestação de Contas</div>),
}));

jest.mock("../../../../componentes/escolas/PrestacaoDeContas/InformacoesIniciais", () => ({
  InformacoesIniciais: jest.fn(() => <div>Informações Iniciais</div>),
}));

jest.mock("../../../../componentes/escolas/PrestacaoDeContas/PresidenteAusente", () => ({
  PresidenteAusente: jest.fn(() => <div>Presidente Ausente</div>),
}));

jest.mock("../../../../componentes/escolas/PrestacaoDeContas/BarraAvisoErroProcessamentoPC", () => ({
  BarraAvisoErroProcessamentoPC: jest.fn(() => <div>Barra de Aviso de Erro</div>),
}));

describe('<PrestacaoDeContasPage>', () => {
  it('Deve renderizar o componente PrestacaoDeContas', async () => {
    useParams.mockReturnValue({ monitoramento: "teste-monitoramento" });
    render(
        <NotificacaoContext.Provider value={{ setShow: jest.fn() }}>
            <PrestacaoDeContas 
                setStatusPC={jest.fn()} 
                registroFalhaGeracaoPc={{}} 
                setRegistroFalhaGeracaoPc={jest.fn()} 
                setApresentaBarraAvisoErroProcessamentoPc={jest.fn()} 
            />
        </NotificacaoContext.Provider>
    )
  });
  it('Deve renderizar o componente PrestacaoDeContasPage', async () => {
    render(
      <PrestacaoDeContasPage />
    )
  });
});
