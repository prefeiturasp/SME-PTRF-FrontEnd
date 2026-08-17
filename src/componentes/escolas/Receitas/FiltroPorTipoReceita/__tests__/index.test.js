import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { FiltroPorTipoReceita } from "../index";
import {
  getTabelasReceitaReceita,
  filtrosAvancadosReceitas,
} from "../../../../../services/escolas/Receitas.service";
import { visoesService } from "../../../../../services/visoes.service";
import { mantemEstadoFiltrosUnidade } from "../../../../../services/mantemEstadoFiltrosUnidade.service";

jest.mock("../../../../../services/escolas/Receitas.service", () => ({
  getTabelasReceitaReceita: jest.fn(),
  filtrosAvancadosReceitas: jest.fn(),
}));

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getUsuarioLogin: jest.fn(),
  },
}));

jest.mock(
  "../../../../../services/mantemEstadoFiltrosUnidade.service",
  () => ({
    mantemEstadoFiltrosUnidade: {
      getEstadoReceitasFiltrosUnidades: jest.fn(),
      setEstadoFiltrosUnidadesUsuario: jest.fn(),
    },
  }),
);

describe("FiltroPorTipoReceita", () => {
  const defaultProps = {
    setBuscaUtilizandoFiltro: jest.fn(),
    setLista: jest.fn(),
    buscaTotaisReceitas: jest.fn(),
    setLoadingLista: jest.fn(),
    previousPath: "",
    state: {
      filtrar_por_termo: "",
      tipo_receita: "",
      acao_associacao: "",
      conta_associacao: "",
      data_inicio: "",
      data_fim: "",
    },
    setState: jest.fn(),
    pageSize: 10,
    setTotalRegistros: jest.fn(),
    setPaginacaoAtual: jest.fn(),
  };

  const renderComponent = (props = {}) =>
    render(<FiltroPorTipoReceita {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();

    getTabelasReceitaReceita.mockResolvedValue({
      tipos_receita: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    filtrosAvancadosReceitas.mockResolvedValue({
      results: [],
      count: 0,
    });

    visoesService.getUsuarioLogin.mockReturnValue("usuario-teste");

    mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades.mockReturnValue(
      {},
    );
  });

  it("deve renderizar o campo de tipo de receita e o botão Filtrar", () => {
    renderComponent();

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Selecionar um tipo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Filtrar" }),
    ).toBeInTheDocument();
  });

  it("deve carregar e exibir os tipos de receita retornados pela API", async () => {
    getTabelasReceitaReceita.mockResolvedValue({
      tipos_receita: [
        {
          id: 1,
          nome: "Receita de Aplicação",
        },
        {
          id: 2,
          nome: "Receita de Doação",
        },
      ],
      acoes_associacao: [],
      contas_associacao: [],
    });

    renderComponent();

    expect(
      await screen.findByRole("option", { name: "Receita de Aplicação" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Receita de Doação" }),
    ).toBeInTheDocument();

    expect(getTabelasReceitaReceita).toHaveBeenCalledTimes(1);
  });

  it("não deve renderizar opções de tipos quando a lista estiver vazia", async () => {
    getTabelasReceitaReceita.mockResolvedValue({
      tipos_receita: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    renderComponent();

    await waitFor(() => {
      expect(getTabelasReceitaReceita).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByRole("option", { name: "Selecionar um tipo" }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("deve renderizar somente a opção padrão quando tipos_receita for undefined", async () => {
    getTabelasReceitaReceita.mockResolvedValue({
      acoes_associacao: [],
      contas_associacao: [],
    });

    renderComponent();

    await waitFor(() => {
      expect(getTabelasReceitaReceita).toHaveBeenCalledTimes(1);
    });

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(
      screen.getByRole("option", { name: "Selecionar um tipo" }),
    ).toBeInTheDocument();
  });


  it("deve restaurar os filtros salvos quando previousPath for de edição de receita", async () => {
    const filtrosSalvos = {
      filtrar_por_termo: "teste",
      tipo_receita: "1",
      acao_associacao: "2",
      conta_associacao: "3",
      data_inicio: "2026-01-01",
      data_fim: "2026-01-31",
    };

    mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades.mockReturnValue(
      filtrosSalvos,
    );

    const setState = jest.fn();

    renderComponent({
      previousPath: "/edicao-de-receita/123",
      setState,
    });

    await waitFor(() => {
      expect(
        mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades,
      ).toHaveBeenCalledTimes(1);
    });

    expect(setState).toHaveBeenCalledWith(filtrosSalvos);
  });

  it("não deve restaurar filtros quando previousPath não for informado", async () => {
    renderComponent({
      previousPath: "",
    });

    await waitFor(() => {
      expect(getTabelasReceitaReceita).toHaveBeenCalledTimes(1);
    });

    expect(
      mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades,
    ).not.toHaveBeenCalled();
  });

  it("não deve restaurar filtros quando previousPath não for de edição de receita", async () => {
    renderComponent({
      previousPath: "/receitas",
    });

    await waitFor(() => {
      expect(getTabelasReceitaReceita).toHaveBeenCalledTimes(1);
    });

    expect(
      mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades,
    ).not.toHaveBeenCalled();
  });

  it("deve utilizar lista vazia e zero registros quando a API não retornar results ou count", async () => {
    filtrosAvancadosReceitas.mockResolvedValue({});

    renderComponent({
      state: {
        ...defaultProps.state,
        tipo_receita: "1",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => {
      expect(filtrosAvancadosReceitas).toHaveBeenCalled();
    });

    expect(defaultProps.setLista).toHaveBeenCalledWith([]);
    expect(defaultProps.setTotalRegistros).toHaveBeenCalledWith(0);
    expect(defaultProps.setPaginacaoAtual).toHaveBeenCalledWith(1);
    expect(defaultProps.setBuscaUtilizandoFiltro).toHaveBeenCalledWith(true);
  });

  it("deve salvar os filtros utilizados após realizar a busca", async () => {
    const state = {
      filtrar_por_termo: "teste",
      tipo_receita: "10",
      acao_associacao: "20",
      conta_associacao: "30",
      data_inicio: "2026-03-15",
      data_fim: "2026-03-20",
    };

    renderComponent({ state });

    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => {
      expect(
        mantemEstadoFiltrosUnidade.setEstadoFiltrosUnidadesUsuario,
      ).toHaveBeenCalledWith("usuario-teste", {
        filtros_receitas: {
          filtrar_por_termo: "teste",
          tipo_receita: "10",
          acao_associacao: "20",
          conta_associacao: "30",
          data_inicio: "2026-03-15",
          data_fim: "2026-03-20",
        },
      });
    });
  });

  it("deve salvar null para as datas quando elas não forem informadas", async () => {
    const state = {
      filtrar_por_termo: "",
      tipo_receita: "1",
      acao_associacao: "",
      conta_associacao: "",
      data_inicio: "",
      data_fim: "",
    };

    renderComponent({ state });

    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => {
      expect(
        mantemEstadoFiltrosUnidade.setEstadoFiltrosUnidadesUsuario,
      ).toHaveBeenCalledWith("usuario-teste", {
        filtros_receitas: {
          filtrar_por_termo: "",
          tipo_receita: "1",
          acao_associacao: "",
          conta_associacao: "",
          data_inicio: null,
          data_fim: null,
        },
      });
    });
  });

  it("deve formatar as datas antes de salvar os filtros", async () => {
    const state = {
      filtrar_por_termo: "",
      tipo_receita: "1",
      acao_associacao: "",
      conta_associacao: "",
      data_inicio: "2026-04-05",
      data_fim: "2026-04-25",
    };

    renderComponent({ state });

    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => {
      expect(
        mantemEstadoFiltrosUnidade.setEstadoFiltrosUnidadesUsuario,
      ).toHaveBeenCalledWith("usuario-teste", {
        filtros_receitas: {
          filtrar_por_termo: "",
          tipo_receita: "1",
          acao_associacao: "",
          conta_associacao: "",
          data_inicio: "2026-04-05",
          data_fim: "2026-04-25",
        },
      });
    });
  });

  it("deve impedir o comportamento padrão do submit ao clicar em Filtrar", async () => {
    const preventDefault = jest.fn();

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }), {
      preventDefault,
    });

    await waitFor(() => {
      expect(filtrosAvancadosReceitas).toHaveBeenCalled();
    });
  });

  it("deve manter o botão Filtrar habilitado durante a renderização", () => {
    renderComponent();

    expect(
      screen.getByRole("button", { name: "Filtrar" }),
    ).toBeEnabled();
  });
});
