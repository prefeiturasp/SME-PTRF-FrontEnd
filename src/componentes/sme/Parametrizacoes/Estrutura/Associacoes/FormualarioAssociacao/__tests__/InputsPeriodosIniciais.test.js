import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { InputsPeriodosIniciais } from "../InputsPeriodosIniciais";
import { useAssociacoesFormularioContext } from "../../hooks/useAssociacoesFormularioContext";
import { useRecursoSelecionadoContext } from "../../../../../../../context/RecursoSelecionado";
import { getPeriodos } from "../../../../../../../services/sme/DashboardSme.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";



jest.mock("../../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../../hooks/useAssociacoesFormularioContext", () => ({
  useAssociacoesFormularioContext: jest.fn(),
}));

jest.mock("../../../../../../../services/sme/DashboardSme.service", () => ({
  getPeriodos: jest.fn(),
}));

jest.mock("../../../../../../../utils/ValidacoesAdicionaisFormularios", () => ({
  exibeDataPT_BR: (data) => data,
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("../../../../../../Globais/UI/Button", () => ({
  IconButton: ({ label, title, "aria-label": ariaLabel, onClick, disabled, children, ...rest }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || label || title || "icon-button"}
      title={title || label}
      {...rest}
    >
      {children || label || title || "icon-button"}
    </button>
  ),
}));

jest.mock("antd", () => ({
  Divider: () => <hr data-testid="divider" />,
}));

jest.mock("react-tooltip", () => ({
  Tooltip: () => <div data-testid="react-tooltip" />,
}));

describe("Componente InputsPeriodosIniciais", () => {
  const mockSetFieldValue = jest.fn();
  const mockPodeEditarDadosAssociacao = jest.fn().mockReturnValue(true);

  const mockRecursos = [
    { uuid: "rec-1", nome: "Recurso 1" },
    { uuid: "rec-2", nome: "Recurso 2" },
  ];

  const mockPeriodosDisponiveis = [
    {
      uuid: "per-1",
      referencia: "2023/1",
      data_inicio_realizacao_despesas: "2023-01-01",
      data_fim_realizacao_despesas: "2023-06-30",
    },
  ];

  const defaultPropsValues = {
    uuid: "assoc-123",
    pode_editar_periodo_inicial: {
      pode_editar_periodo_inicial: true,
      mensagem_pode_editar_periodo_inicial: [],
    },
    periodos_iniciais: [
      {
        uuid: "pi-1",
        recurso: "rec-1",
        periodo_inicial: "per-1",
        status_valores_reprogramados: "APROVADO",
        periodos_disponiveis: mockPeriodosDisponiveis,
      },
    ],
  };

  const defaultContextValue = {
    getRecursosParaSelectFormulario: jest.fn(() => mockRecursos),
    dataStatusValoresReprogramados: [
      { key: "APROVADO", value: "Aprovado" },
      { key: "PENDENTE", value: "Pendente" },
    ],
    initialItemPeriodoInicial: {
      recurso: "",
      periodo_inicial: "",
      status_valores_reprogramados: "",
      periodos_disponiveis: [],
    },
    errosPeriodosIniciais: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRecursoSelecionadoContext).mockReturnValue({
      recursos: mockRecursos,
    });

    (useAssociacoesFormularioContext).mockReturnValue({
      ...defaultContextValue,
      getRecursosParaSelectFormulario: jest.fn().mockReturnValue(mockRecursos),
    });
  });

  it("deve renderizar o título e os selects do primeiro recurso corretamente", () => {
    render(
      <InputsPeriodosIniciais
        props={{ values: defaultPropsValues }}
        setFieldValue={mockSetFieldValue}
        podeEditarDadosAssociacao={mockPodeEditarDadosAssociacao}
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES={true}
      />
    );

    expect(screen.getByText("Recurso(s) vinculado(s) à Associação")).toBeInTheDocument();
    
    // Busca especifica do título <h6>
    expect(screen.getByRole("heading", { name: "Recurso 1" })).toBeInTheDocument();

    expect(screen.getByLabelText("Recurso*")).toHaveValue("rec-1");
    expect(screen.getByLabelText("Período inicial*")).toHaveValue("per-1");
    expect(screen.getByLabelText("Status dos valores reprogramados*")).toHaveValue("APROVADO");
  });

  it("deve buscar e atualizar os períodos ao mudar a seleção do recurso", async () => {
    const periodosNovos = [{ uuid: "per-2", referencia: "2023/2" }];
    (getPeriodos).mockResolvedValue(periodosNovos);

    render(
      <InputsPeriodosIniciais
        props={{ values: defaultPropsValues }}
        setFieldValue={mockSetFieldValue}
        podeEditarDadosAssociacao={mockPodeEditarDadosAssociacao}
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES={true}
      />
    );

    const selectRecurso = screen.getByLabelText("Recurso*");
    fireEvent.change(selectRecurso, { target: { value: "rec-2" } });

    expect(getPeriodos).toHaveBeenCalledWith({ recurso_uuid: "rec-2" });

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledWith("periodos_iniciais", [
        {
          ...defaultPropsValues.periodos_iniciais[0],
          recurso: "rec-2",
          periodo_inicial: "",
          periodos_disponiveis: periodosNovos,
        },
      ]);
    });
  });

  it("deve exibir toast de erro se a busca por períodos falhar ao trocar recurso", async () => {
    (getPeriodos).mockRejectedValue(new Error("Erro API"));

    render(
      <InputsPeriodosIniciais
        props={{ values: defaultPropsValues }}
        setFieldValue={mockSetFieldValue}
        podeEditarDadosAssociacao={mockPodeEditarDadosAssociacao}
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES={true}
      />
    );

    const selectRecurso = screen.getByLabelText("Recurso*");
    fireEvent.change(selectRecurso, { target: { value: "rec-2" } });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao buscar os períodos");
    });
  });

  it("deve permitir adicionar um novo recurso quando abaixo do limite", () => {
    render(
      <InputsPeriodosIniciais
        props={{ values: defaultPropsValues }}
        setFieldValue={mockSetFieldValue}
        podeEditarDadosAssociacao={mockPodeEditarDadosAssociacao}
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES={true}
      />
    );

    const btnAdicionar = screen.getByRole("button", {
      name: /Adicionar outro Recurso da Associação/i,
    });
    expect(btnAdicionar).not.toBeDisabled();

    fireEvent.click(btnAdicionar);

    expect(mockSetFieldValue).toHaveBeenCalledWith("periodos_iniciais", [
      defaultPropsValues.periodos_iniciais[0],
      {
        recurso: "",
        periodo_inicial: "",
        status_valores_reprogramados: "",
        periodos_disponiveis: [],
      },
    ]);
  });

  it("deve desabilitar o botão de adicionar recurso se a lista for igual ao total de recursos", () => {
    const valuesComLimiteAtingido = {
      ...defaultPropsValues,
      periodos_iniciais: [
        defaultPropsValues.periodos_iniciais[0],
        { ...defaultPropsValues.periodos_iniciais[0], uuid: "pi-2" },
      ],
    };

    render(
      <InputsPeriodosIniciais
        props={{ values: valuesComLimiteAtingido }}
        setFieldValue={mockSetFieldValue}
        podeEditarDadosAssociacao={mockPodeEditarDadosAssociacao}
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES={true}
      />
    );

    const btnAdicionar = screen.getByRole("button", {
      name: /Adicionar outro Recurso da Associação/i,
    });
    expect(btnAdicionar).toBeDisabled();
  });

  it("deve renderizar e permitir remover um recurso (índice > 0)", () => {
    // Garante que podeEditarDadosAssociacao SEMPRE retorne true, independente dos parâmetros recebidos
    const mockPodeEditarSempreTrue = jest.fn().mockImplementation(() => true);

    const valuesComDoisRecursos = {
      ...defaultPropsValues,
      periodos_iniciais: [
        defaultPropsValues.periodos_iniciais[0],
        {
          uuid: "pi-2",
          recurso: "rec-2",
          periodo_inicial: "per-1",
          status_valores_reprogramados: "APROVADO",
          periodos_disponiveis: [],
        },
      ],
    };

    render(
      <InputsPeriodosIniciais
        props={{ values: valuesComDoisRecursos }}
        setFieldValue={mockSetFieldValue}
        podeEditarDadosAssociacao={mockPodeEditarSempreTrue}
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES={true}
      />
    );

    // Obtém todos os botões renderizados no DOM
    const botoes = screen.getAllByRole("button");

    // Localiza o botão que NÃO é o de adicionar outro recurso
    const btnRemover = botoes.find(
      (btn) => !btn.textContent?.includes("Adicionar outro Recurso")
    );

    expect(btnRemover).toBeDefined();
    expect(btnRemover).toBeInTheDocument();

    fireEvent.click(btnRemover);

    expect(mockSetFieldValue).toHaveBeenCalledWith("periodos_iniciais", [
      defaultPropsValues.periodos_iniciais[0],
    ]);
  });

  it("deve desabilitar os campos quando o usuário NÃO possuir permissão de edição", () => {
    render(
      <InputsPeriodosIniciais
        props={{ values: defaultPropsValues }}
        setFieldValue={mockSetFieldValue}
        podeEditarDadosAssociacao={mockPodeEditarDadosAssociacao}
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES={false}
      />
    );

    expect(screen.getByLabelText("Recurso*")).toBeDisabled();
    expect(screen.getByLabelText("Período inicial*")).toBeDisabled();
    expect(screen.getByLabelText("Status dos valores reprogramados*")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Adicionar outro Recurso da Associação/i })
    ).toBeDisabled();
  });

  it("deve exibir mensagens de erro do errosPeriodosIniciais nos campos correspondentes", () => {
    (useAssociacoesFormularioContext).mockReturnValue({
      ...defaultContextValue,
      getRecursosParaSelectFormulario: jest.fn().mockReturnValue(mockRecursos),
      errosPeriodosIniciais: [
        {
          recurso: "Campo recurso é obrigatório",
          periodo_inicial: "Selecione o período",
          status_valores_reprogramados: "Status inválido",
        },
      ],
    });

    render(
      <InputsPeriodosIniciais
        props={{ values: defaultPropsValues }}
        setFieldValue={mockSetFieldValue}
        podeEditarDadosAssociacao={mockPodeEditarDadosAssociacao}
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES={true}
      />
    );

    expect(screen.getByText("Campo recurso é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Selecione o período")).toBeInTheDocument();
    expect(screen.getByText("Status inválido")).toBeInTheDocument();
  });
});