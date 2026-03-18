import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

import { ListaDeReceitas } from "../index";
import {
  getListaReceitas,
  getTotaisReceitas,
  filtrosAvancadosReceitas,
} from "../../../../../services/escolas/Receitas.service";
import { mantemEstadoFiltrosUnidade } from "../../../../../services/mantemEstadoFiltrosUnidade.service";
import { visoesService } from "../../../../../services/visoes.service";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

jest.mock("../../../../../services/escolas/Receitas.service", () => ({
  getListaReceitas: jest.fn(),
  getTotaisReceitas: jest.fn(),
  filtrosAvancadosReceitas: jest.fn(),
}));

jest.mock("../../../../../services/mantemEstadoFiltrosUnidade.service", () => ({
  mantemEstadoFiltrosUnidade: {
    getEstadoReceitasFiltrosUnidades: jest.fn(),
  },
}));

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

jest.mock("../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../../FormFiltrosAvancados", () => ({
  FormFiltrosAvancados: (props) => (
    <div data-testid="form-filtros-avancados" onClick={props.iniciaLista} />
  ),
}));

jest.mock("../../FiltroPorTipoReceita", () => ({
  FiltroPorTipoReceita: () => (
    <div data-testid="filtro-tipo-receita" />
  ),
}));

jest.mock("../../SomaDosCreditos", () => ({
  SomaDosCreditos: () => (
    <div data-testid="soma-dos-creditos" />
  ),
}));

jest.mock("../../../../../utils/Loading", () => () => (
  <div data-testid="loading-receitas" />
));

jest.mock(
  "../../../../Globais/Mensagens/MsgImgLadoDireito",
  () => ({
    MsgImgLadoDireito: (props) => (
      <div data-testid="msg-lado-direito">{props.texto}</div>
    ),
  })
);

jest.mock(
  "../../../../Globais/Mensagens/MsgImgCentralizada",
  () => ({
    MsgImgCentralizada: (props) => (
      <div data-testid="msg-centralizada">{props.texto}</div>
    ),
  })
);

const renderComponent = () =>
  render(
    <MemoryRouter>
      <ListaDeReceitas />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();

  useRecursoSelecionadoContext.mockReturnValue({
    recursoSelecionado: { legado: true },
  });

  visoesService.getPermissoes.mockReturnValue(true);

  getListaReceitas.mockResolvedValue([]);
  getTotaisReceitas.mockResolvedValue({});
  filtrosAvancadosReceitas.mockResolvedValue([]);

  sessionStorage.clear();
});

describe("ListaDeReceitas", () => {
  it("exibe loading inicialmente e em seguida mensagem padrão de nenhum crédito", async () => {
    renderComponent();

    expect(
      screen.getByTestId("loading-receitas")
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("Filtrar por")).toBeInTheDocument()
    );

    expect(
      screen.getByTestId("msg-lado-direito")
    ).toHaveTextContent(
      'A sua escola ainda não possui créditos cadastrados, clique no botão "Cadastrar crédito" para começar.'
    );
  });

  it("carrega lista de receitas e totais quando não vem de edição", async () => {
    renderComponent();

    await waitFor(() =>
      expect(getListaReceitas).toHaveBeenCalled()
    );
    expect(getTotaisReceitas).toHaveBeenCalled();
  });

  it("quando previousPath contém /edicao-de-receita usa filtros salvos no serviço", async () => {
    sessionStorage.setItem("previousPath", "/edicao-de-receita/uuid");
    mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades.mockReturnValue(
      {
        filtrar_por_termo: "termo",
        tipo_receita: "tipo",
        acao_associacao: "acao",
        conta_associacao: "conta",
        data_inicio: "2025-01-01",
        data_fim: "2025-12-31",
      }
    );
    filtrosAvancadosReceitas.mockResolvedValue([
      { uuid: "r1", valor: "100.00", data: "2025-01-01" },
    ]);
    getTotaisReceitas.mockResolvedValue({
      total: "100.00",
    });

    renderComponent();

    await waitFor(() =>
      expect(
        mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades
      ).toHaveBeenCalled()
    );
    expect(filtrosAvancadosReceitas).toHaveBeenCalled();
    expect(getTotaisReceitas).toHaveBeenCalled();
  });

  it("exibe botões de cadastrar crédito e valores reprogramados habilitados quando tem permissão", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByText("Filtrar por")).toBeInTheDocument()
    );

    const btnCadastrar = screen.getByRole("button", {
      name: /Cadastrar crédito/i,
    });
    const btnReprogramados = screen.getByRole("button", {
      name: /Valores reprogramados/i,
    });

    expect(btnCadastrar).toBeEnabled();
    expect(btnReprogramados).toBeEnabled();
  });
});

