import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AnaliseDre } from "../index";
import * as service from "../../../../services/escolas/AnaliseDaDre.service";
import * as prestacaoService from "../../../../services/escolas/PrestacaoDeContas.service";
import * as tabelaService from "../../../../services/dres/PrestacaoDeContas.service";
import {mantemEstadoAnaliseDre as meapcservice} from "../../../../services/mantemEstadoAnaliseDre.service";
import { visoesService } from "../../../../services/visoes.service";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../../services/escolas/AnaliseDaDre.service");
jest.mock("../../../../services/escolas/PrestacaoDeContas.service");
jest.mock("../../../../services/dres/PrestacaoDeContas.service");
jest.mock("../../../../services/mantemEstadoAnaliseDre.service", () => ({
  mantemEstadoAnaliseDre: {
    limpaAnaliseDreUsuarioLogado: jest.fn(),
  },
}));
jest.mock("../../../../services/visoes.service");

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <AnaliseDre />
    </BrowserRouter>,
  );
};

const mockLista = [
  {
    prestacao_de_contas_uuid: "uuid-1",
    referencia: "01/2024",
    data_inicio_realizacao_despesas: "2024-01-01",
    data_fim_realizacao_despesas: "2024-01-31",
    texto_status: "Aprovado",
    legenda_cor: "verde",
    pode_habilitar_botao_ver_acertos_em_analise_da_dre: true,
  },
];

describe("AnaliseDre", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.setItem("ASSOCIACAO_UUID", "uuid-assoc");

    service.getListaDeAnalises.mockResolvedValue(mockLista);
    prestacaoService.getPeriodosAteAgoraForaImplantacaoDaAssociacao.mockResolvedValue(
      [],
    );
    tabelaService.getTabelasPrestacoesDeContas.mockResolvedValue({});
    service.getListaDeAnalisesFiltros.mockResolvedValue(mockLista);

    visoesService.getUsuarioLogin.mockReturnValue("usuario-logado");
  });

  it("deve renderizar título e carregar dados iniciais", async () => {
    renderComponent();

    expect(screen.getByText("Análise DRE")).toBeInTheDocument();

    await waitFor(() => {
      expect(service.getListaDeAnalises).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.queryByText(/aprovado/i)).toBeInTheDocument();
    });
  });

  it("deve exibir loading enquanto carrega dados", async () => {
    service.getListaDeAnalises.mockImplementation(() => new Promise(() => {}));

    renderComponent();

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("deve chamar filtros ao submeter", async () => {
    renderComponent();

    await waitFor(() => {
      expect(service.getListaDeAnalises).toHaveBeenCalled();
    });

    const botaoFiltrar = screen.getByRole("button", { name: /filtrar/i });

    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(service.getListaDeAnalisesFiltros).toHaveBeenCalled();
    });
  });

  it("deve limpar filtros e recarregar lista original", async () => {
    renderComponent();

    await waitFor(() => {
      expect(service.getListaDeAnalises).toHaveBeenCalledTimes(1);
    });

    const botaoLimpar = screen.getByRole("button", { name: /limpar/i });

    fireEvent.click(botaoLimpar);

    await waitFor(() => {
      expect(service.getListaDeAnalises).toHaveBeenCalledTimes(2);
    });
  });

  it("deve navegar ao clicar no botão visualizar", async () => {
    renderComponent();

    await screen.findByText(/aprovado/i);

    const botoes = screen.getAllByRole("img", { hidden: true });
    fireEvent.click(botoes[0]);

    expect(meapcservice.limpaAnaliseDreUsuarioLogado).toHaveBeenCalledWith(
      "usuario-logado",
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/consulta-detalhamento-analise-da-dre/uuid-1",
      expect.objectContaining({
        state: expect.any(Object),
      }),
    );
  });
});
