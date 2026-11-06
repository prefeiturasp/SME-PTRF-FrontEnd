import React, { useState } from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lista } from "../components/Lista";
import { ModalForm } from "../components/ModalForm";
import { RepassesContext } from "../context/Repasse";
import { useGetRepasses } from "../hooks/useGetRepasses";
import { usePostRepasse } from "../hooks/usePostRepasse";
import { usePatchRepasse } from "../hooks/usePatchRepasse";
import { useDeleteRepasse } from "../hooks/useDeleteRepasse";
import { useGetTabelasRepasse } from "../hooks/useGetTabelasRepasse";
import { useGetTabelasPorAssociacao } from "../hooks/useGetTabelasPorAssociacao";
import { mockRepasses } from "../__fixtures__/mockData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { getAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

const queryClient = new QueryClient();

// Mock das hooks
jest.mock("../hooks/useGetRepasses");
jest.mock("../hooks/usePostRepasse");
jest.mock("../hooks/usePatchRepasse");
jest.mock("../hooks/useDeleteRepasse");
jest.mock("../hooks/useGetTabelasRepasse");
jest.mock("../hooks/useGetTabelasPorAssociacao");
jest.mock("../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext", () => ({
  useAbasPorRecursoContext: jest.fn(() => ({ selectedRecurso: null })),
}));

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => {
  const actual = jest.requireActual("../../../../../../services/sme/Parametrizacoes.service");
  return {
    ...actual,
    getAssociacoes: jest.fn().mockResolvedValue([]),
  };
});

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(() => true),
}));

jest.mock("../../../../../../assets/img/spinner.gif", () => "spinner.gif");


const mockSetStateFormModal = jest.fn();
const mockSetShowModalForm = jest.fn();
const mockSetBloquearBtnSalvarForm = jest.fn();
const mockHandleExcluir = jest.fn();

const stateFormCreate = {
    uuid: '',
    associacao: '',
    valor_capital: 0,
    valor_custeio: 0,
    valor_livre: 0,
    conta_associacao: '',
    acao_associacao: '',
    periodo: '',
    status: 'PENDENTE',
    realizado_capital: '',
    realizado_custeio: '',
    realizado_livre: '',
    nome_unidade: '',
    carga_origem: '',
    id_linha_carga: '',
    id: '',
    campos_editaveis: {
        campos_de_realizacao: false
    }
}

const context = {
    setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
    setShowModalForm: mockSetShowModalForm,
    stateFormModal: stateFormCreate,
    setStateFormModal: mockSetStateFormModal,
    handleExcluir: mockHandleExcluir,
    filter: { recurso_uuid: 'test-uuid' },
    showModalForm: false,
    bloquearBtnSalvarForm: false,
    setShowModalConfirmacaoExclusao: jest.fn(),
}

const mockMutationPost = { mutate: jest.fn() };
const mockMutationPatch = { mutate: jest.fn() };
const mockMutationDelete = { mutate: jest.fn() };

describe("Lista", () => {
    beforeEach(() => {
        useGetRepasses.mockReturnValue({
            isLoading: false,
            refetch: jest.fn(),
            data: mockRepasses
        });

        usePostRepasse.mockReturnValue({ mutationPost: mockMutationPost});
        usePatchRepasse.mockReturnValue({ mutationPatch: mockMutationPatch });
        useDeleteRepasse.mockReturnValue({ mutationDelete: mockMutationDelete });
        useGetTabelasRepasse.mockReturnValue({ data: { results: [] }, isLoading: false, isError: false, refetch: jest.fn() });
        useGetTabelasPorAssociacao.mockReturnValue({ data: { results: [] }, isFetching: false, isError: false, refetch: jest.fn() });
        useRecursoSelecionadoContext.mockReturnValue({ recursos: [] });
        useAbasPorRecursoContext.mockReturnValue({ selectedRecurso: null });
        getAssociacoes.mockResolvedValue([]);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RepassesContext.Provider value={context}>
          <Lista />
          <ModalForm handleSubmitFormModal={jest.fn()} />
        </RepassesContext.Provider>
      </QueryClientProvider>
    );
  };

  it("deve renderizar a tabela com dados", () => {
    renderComponent();

    // Verifica se os dois primeiros registros da lista aparecem
    expect(screen.getByText("EMEI 25 DE JANEIRO")).toBeInTheDocument();
    expect(screen.getByText("CEI DIRET JARDIM SAO LUIZ I")).toBeInTheDocument();
    expect(useGetRepasses).toHaveBeenCalled();

  });

  it("Valida quando nenhum registro foi carregado", () => {
    useGetRepasses.mockReturnValue({ data: { results: [] } });
    renderComponent();
    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição quando clicar no botão editar", async () => {
    const item = mockRepasses.results[0]
    useGetRepasses.mockReturnValue({ data: { results: [item] } });
    renderComponent();

    const botaoEditar = screen.getByRole("button", { name: "Editar" });
    fireEvent.click(botaoEditar);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });

});

const tabelasFormulario = {
  periodos: [
    {
      uuid: "d9bc43e3-cfd5-4969-bada-af78d96e8faf",
      referencia: "2025.1",
    },
  ],
  status: [
    { id: "PENDENTE", nome: "Previsto" },
    { id: "REALIZADO", nome: "Realizado" },
  ],
};

const moeda = (valor) =>
  Number(valor)
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    .replace(/\u00a0/g, " ");

const textoMoeda = (valor) => (texto) =>
  texto.replace(/\u00a0/g, " ") === moeda(valor);

const FormularioControlado = ({ initialShow = false, initialState = stateFormCreate, children }) => {
  const [showModalForm, setShowModalForm] = useState(initialShow);
  const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(false);
  const [stateFormModal, setStateFormModal] = useState(initialState);
  const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <RepassesContext.Provider
        value={{
          setBloquearBtnSalvarForm,
          setShowModalForm,
          stateFormModal,
          setStateFormModal,
          filter: {
            recurso_uuid: "test-uuid",
            associacao: stateFormModal.associacao,
          },
          showModalForm,
          bloquearBtnSalvarForm,
          showModalConfirmacaoExclusao,
          setShowModalConfirmacaoExclusao,
          tabelas: tabelasFormulario,
        }}
      >
        {children}
      </RepassesContext.Provider>
    </QueryClientProvider>
  );
};

describe("Lista de repasses previstos", () => {
  const repasse = {
    ...mockRepasses.results[0],
    valor_capital: "1500.50",
    valor_custeio: "11260.00",
    valor_livre: null,
    status: "REALIZADO",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    usePostRepasse.mockReturnValue({ mutationPost: mockMutationPost });
    usePatchRepasse.mockReturnValue({ mutationPatch: mockMutationPatch });
    useDeleteRepasse.mockReturnValue({ mutationDelete: mockMutationDelete });
    useGetTabelasRepasse.mockReturnValue({
      data: { results: [] },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    useGetTabelasPorAssociacao.mockReturnValue({
      data: {
        contas_associacao: [
          { uuid: repasse.conta_associacao.uuid, nome: repasse.conta_associacao.nome },
        ],
        acoes_associacao: [
          { uuid: repasse.acao_associacao.uuid, nome: repasse.acao_associacao.nome },
        ],
      },
      isFetching: false,
    });
    useRecursoSelecionadoContext.mockReturnValue({
      recursos: [{ uuid: repasse.recurso.uuid, nome: "PTRF" }],
    });
    useAbasPorRecursoContext.mockReturnValue({ selectedRecurso: null });
    getAssociacoes.mockResolvedValue([]);
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  const renderLista = (data = { results: [repasse], count: 1 }, isLoading = false) => {
    useGetRepasses.mockReturnValue({
      isLoading,
      data,
      count: data.count,
    });

    return render(
      <FormularioControlado>
        <Lista />
      </FormularioControlado>
    );
  };

  it("deve exibir o carregamento da lista", () => {
    renderLista({ results: [], count: 0 }, true);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum resultado encontrado.")
    ).not.toBeInTheDocument();
  });

  it("deve exibir a quantidade, os valores e o status realizado", () => {
    renderLista();

    expect(screen.getByText(/Exibindo/)).toHaveTextContent(
      "Exibindo 1 repasse(s)"
    );
    expect(screen.getByText(textoMoeda("1500.50"))).toBeInTheDocument();
    expect(screen.getByText(textoMoeda("11260.00"))).toBeInTheDocument();
    expect(screen.getByText("Realizado")).toBeInTheDocument();
    expect(screen.queryByText("Previsto")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editar" })).toBeInTheDocument();
  });

  it("deve exibir o status previsto", () => {
    renderLista({
      results: [{ ...repasse, status: "PENDENTE" }],
      count: 1,
    });

    expect(screen.getByText("Previsto")).toBeInTheDocument();
  });

  it("deve manter o estado vazio sem ação de edição", () => {
    renderLista({ results: [], count: 0 });

    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Editar" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Exibindo/)).not.toBeInTheDocument();
  });

  it("deve abrir a edição com os dados do repasse e salvar as alterações", async () => {
    const user = userEvent.setup();
    renderLista();

    await user.click(screen.getByRole("button", { name: "Editar" }));

    expect(await screen.findByText("Editar repasse previsto")).toBeInTheDocument();
    expect(screen.getByLabelText("Unidade Educacional *")).toHaveValue(
      "EMEI 25 DE JANEIRO"
    );
    expect(screen.getByLabelText("Recurso *")).toHaveValue(repasse.recurso.uuid);
    expect(screen.getByLabelText("Conta *")).toHaveValue(repasse.conta_associacao.uuid);
    expect(screen.getByLabelText("Ação *")).toHaveValue(repasse.acao_associacao.uuid);
    expect(screen.getByLabelText("Período *")).toHaveValue(repasse.periodo.uuid);
    expect(screen.getByLabelText("Valor custeio *").value.replace(/\u00a0/g, " ")).toContain(
      "11.260,00"
    );

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(mockMutationPatch.mutate).toHaveBeenCalled();
    });

    expect(mockMutationPatch.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid_repasse: repasse.uuid,
        payload: expect.objectContaining({
          associacao: repasse.associacao.uuid,
          conta_associacao: repasse.conta_associacao.uuid,
          acao_associacao: repasse.acao_associacao.uuid,
          periodo: repasse.periodo.uuid,
          recurso: repasse.recurso.uuid,
          status: "REALIZADO",
          valor_capital: 1500.5,
          valor_custeio: 11260,
          valor_livre: 0,
        }),
      })
    );
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("deve impedir o salvamento e informar os campos obrigatórios", async () => {
    const user = userEvent.setup();
    useGetRepasses.mockReturnValue({
      isLoading: false,
      data: { results: [], count: 0 },
      count: 0,
    });

    render(
      <FormularioControlado initialShow>
        <Lista />
      </FormularioControlado>
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(await screen.findByText("Unidade é obrigatório.")).toBeInTheDocument();
    expect(screen.getByText("Conta é obrigatório.")).toBeInTheDocument();
    expect(screen.getByText("Ação é obrigatório.")).toBeInTheDocument();
    expect(screen.getByText("Período é obrigatório.")).toBeInTheDocument();
    expect(mockMutationPost.mutate).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeEnabled();
    expect(screen.getByText("Adicionar repasse previsto")).toBeInTheDocument();
  });

  it("deve adicionar um repasse quando o formulário é enviado", async () => {
    const user = userEvent.setup();
    useGetRepasses.mockReturnValue({
      isLoading: false,
      data: { results: [], count: 0 },
      count: 0,
    });
    useGetTabelasPorAssociacao.mockReturnValue({
      data: {
        contas_associacao: [
          { uuid: "conta-nova", nome: "Cheque" },
        ],
        acoes_associacao: [
          { uuid: "acao-nova", nome: "PTRF Básico" },
        ],
      },
      isFetching: false,
    });

    render(
      <FormularioControlado
        initialShow
        initialState={{
          ...stateFormCreate,
          associacao: "associacao-nova",
          campos_editaveis: {
            campos_identificacao: true,
            valor_capital: true,
            valor_custeio: true,
            valor_livre: true,
            campos_de_realizacao: true,
          },
        }}
      >
        <Lista />
      </FormularioControlado>
    );

    await user.selectOptions(screen.getByLabelText("Conta *"), "conta-nova");
    await user.selectOptions(screen.getByLabelText("Ação *"), "acao-nova");
    await user.selectOptions(
      screen.getByLabelText("Período *"),
      "d9bc43e3-cfd5-4969-bada-af78d96e8faf"
    );
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await waitFor(() => {
      expect(mockMutationPost.mutate).toHaveBeenCalled();
    });

    expect(mockMutationPost.mutate).toHaveBeenCalledWith({
      payload: expect.objectContaining({
        associacao: "associacao-nova",
        conta_associacao: "conta-nova",
        acao_associacao: "acao-nova",
        periodo: "d9bc43e3-cfd5-4969-bada-af78d96e8faf",
        valor_capital: 0,
        valor_custeio: 0,
        valor_livre: 0,
        status: "PENDENTE",
      }),
    });
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
  });

  it("deve confirmar a exclusão do repasse em edição", async () => {
    const user = userEvent.setup();
    renderLista();

    await user.click(screen.getByRole("button", { name: "Editar" }));
    await user.click(await screen.findByRole("button", { name: "Excluir" }));

    const confirmacao = (
      await screen.findByText("Deseja realmente excluir esse repasse?")
    ).closest('[role="dialog"]');

    await user.click(within(confirmacao).getByRole("button", { name: "Excluir" }));

    expect(mockMutationDelete.mutate).toHaveBeenCalledWith(repasse.uuid);
    expect(
      screen
        .getByText("Deseja realmente excluir esse repasse?", { hidden: true })
        .closest('[role="dialog"]')
    ).not.toBeVisible();
    expect(screen.getByText("Editar repasse previsto")).toBeInTheDocument();
  });

  it("deve manter o repasse ao cancelar a exclusão", async () => {
    const user = userEvent.setup();
    renderLista();

    await user.click(screen.getByRole("button", { name: "Editar" }));
    await user.click(screen.getByRole("button", { name: "Excluir" }));

    const confirmacao = (
      await screen.findByText("Deseja realmente excluir esse repasse?")
    ).closest('[role="dialog"]');
    await user.click(within(confirmacao).getByRole("button", { name: "Cancelar" }));

    expect(mockMutationDelete.mutate).not.toHaveBeenCalled();
    expect(
      screen
        .getByText("Deseja realmente excluir esse repasse?", { hidden: true })
        .closest('[role="dialog"]')
    ).not.toBeVisible();
    expect(screen.getByText("Editar repasse previsto")).toBeInTheDocument();
  });

  it("deve carregar as unidades do recurso selecionado", async () => {
    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: "recurso-selecionado", nome: "PTRF" },
    });
    let concluir;
    getAssociacoes.mockImplementation(
      () =>
        new Promise((resolve) => {
          concluir = resolve;
        })
    );
    useGetRepasses.mockReturnValue({
      isLoading: false,
      data: { results: [], count: 0 },
      count: 0,
    });

    render(
      <FormularioControlado initialShow>
        <Lista />
      </FormularioControlado>
    );

    expect(screen.getByPlaceholderText("Carregando unidades")).toBeDisabled();

    concluir([
      {
        uuid: "associacao-1",
        encerrada: false,
        unidade: { nome_com_tipo: "EMEF Alfa", codigo_eol: "100001" },
      },
    ]);

    expect(getAssociacoes).toHaveBeenCalledWith("recurso-selecionado");
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Carregando unidades")
      ).not.toBeInTheDocument();
    });
  });
});
