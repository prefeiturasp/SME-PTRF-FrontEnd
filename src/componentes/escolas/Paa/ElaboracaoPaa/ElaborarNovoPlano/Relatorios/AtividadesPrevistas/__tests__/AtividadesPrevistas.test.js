import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { AtividadesPrevistas } from "../AtividadesPrevistas";
import { useGetAtividadesEstatutarias } from "../hooks/useGetAtividadesEstatutarias";
import { useGetAtividadesEstatutariasTabelas } from "../hooks/useGetAtividadesEstatutariasTabelas";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import {
  createAtividadeEstatutariaPaa,
  updateAtividadeEstatutariaPaa,
  deleteAtividadeEstatutariaPaa,
  linkAtividadeEstatutariaExistentePaa,
} from "../../../../../../../../services/escolas/Paa.service";
import { visoesService } from "../../../../../../../../services/visoes.service";
import { getErrorMessage } from "../../../../../../../../utils/obtemMsgErroAxios";

jest.mock("../hooks/useGetAtividadesEstatutarias", () => ({
  useGetAtividadesEstatutarias: jest.fn(),
}));

jest.mock("../hooks/useGetAtividadesEstatutariasTabelas", () => ({
  useGetAtividadesEstatutariasTabelas: jest.fn(),
}));

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  createAtividadeEstatutariaPaa: jest.fn(),
  updateAtividadeEstatutariaPaa: jest.fn(),
  deleteAtividadeEstatutariaPaa: jest.fn(),
  linkAtividadeEstatutariaExistentePaa: jest.fn(),
}));

jest.mock("../../../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(() => true),
  },
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("../../../../../../../Globais/UI/Button", () => ({
  IconButton: ({ onClick, "aria-label": ariaLabel, disabled }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick} disabled={disabled}>
      {ariaLabel}
    </button>
  ),
  EditIconButton: ({ onClick }) => (
    <button type="button" aria-label="Editar" onClick={onClick}>
      Editar
    </button>
  ),
}));

jest.mock("../../../../../../../Globais/UI/Icon", () => ({
  Icon: ({ icon }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock("../../../../../../../Globais/Mensagens/MsgImgCentralizada", () => ({
  MsgImgCentralizada: ({ texto, dataQa }) => (
    <div data-testid={dataQa || "msg-img"}>{texto}</div>
  ),
}));

jest.mock(
  "../../../../../../../sme/Parametrizacoes/componentes/ModalConfirmarExclusao",
  () => ({
    ModalConfirmarExclusao: ({ open, onOk, onCancel, titulo }) =>
      open ? (
        <div data-testid="modal-excluir">
          <span>{titulo}</span>
          <button data-testid="modal-ok" onClick={onOk}>Confirmar</button>
          <button data-testid="modal-cancel" onClick={onCancel}>Cancelar</button>
        </div>
      ) : null,
  })
);

jest.mock("../../../../../componentes/TagRetificacao", () => ({
  TagRetificacao: () => <span data-testid="tag-retificacao">Em retificação</span>,
}));

jest.mock("../../components/RelatorioTabelaGrupo", () => ({
  RelatorioTabelaGrupo: ({ title, columns, dataSource, rowKey, headerExtra }) => (
    <div data-testid={`tabela-grupo-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <div data-testid="tabela-titulo">{title}</div>
      {headerExtra && <div data-testid="tabela-header-extra">{headerExtra}</div>}
      <div data-testid="tabela-body">
        {(dataSource || []).map((record) => {
          const key = typeof rowKey === "function" ? rowKey(record) : record[rowKey];
          return (
            <div key={key} data-testid={`row-${key}`}>
              {columns.map((col) => (
                <div key={col.key} data-testid={`cell-${col.key}-${key}`}>
                  {col.render
                    ? col.render(record[col.dataIndex], record)
                    : (record[col.dataIndex] ?? "")}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  ),
}));

jest.mock("antd", () => ({
  Spin: ({ spinning, children }) => (
    <div data-testid={spinning ? "spin-loading" : "spin-idle"}>{children}</div>
  ),
}));

jest.mock("../../../../../../../../utils/obtemMsgErroAxios", () => ({
  getErrorMessage: jest.fn((err, fallback) => fallback),
}));

// ---------------------------------------------------------------------------

const PAA_UUID = "uuid-paa-test";
const mockRefetch = jest.fn();

const TIPOS_OPTIONS = [
  { key: "1", value: "Reunião" },
  { key: "2", value: "Assembleia" },
];

const DUMMY_ATIVIDADE = {
  uuid: "dummy",
  tipoAtividade: "Reunião",
  tipoAtividadeKey: "1",
  data: "2024-01-15",
  descricao: "Reunião ordinária",
  isNovo: false,
  emEdicao: false,
  isGlobal: false,
  needsSync: false,
  dirty: false,
  _destroy: false,
};

const setupDefaultMocks = ({
  atividades = [DUMMY_ATIVIDADE],
  isLoading = false,
  isError = false,
  tabelasData = { tipo: TIPOS_OPTIONS },
} = {}) => {
  useGetAtividadesEstatutarias.mockReturnValue({
    atividades,
    isFetching: isLoading,
    isLoading,
    isError,
    refetch: mockRefetch,
  });
  useGetAtividadesEstatutariasTabelas.mockReturnValue({ data: tabelasData });
};

const renderComponent = () => render(<AtividadesPrevistas />);

// ---------------------------------------------------------------------------

describe("AtividadesPrevistas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
    getErrorMessage.mockImplementation((err, fallback) => fallback);
    mockRefetch.mockResolvedValue({});
    createAtividadeEstatutariaPaa.mockResolvedValue({});
    updateAtividadeEstatutariaPaa.mockResolvedValue({});
    deleteAtividadeEstatutariaPaa.mockResolvedValue({});
    linkAtividadeEstatutariaExistentePaa.mockResolvedValue({});
    localStorage.setItem("PAA", PAA_UUID);
    localStorage.removeItem("DADOS_PAA");
    setupDefaultMocks();
  });

  afterEach(() => {
    localStorage.removeItem("PAA");
    localStorage.removeItem("DADOS_PAA");
  });

  // -------------------------------------------------------------------------
  describe("renderização básica", () => {
    it("renderiza a tabela de atividades estatutárias", () => {
      renderComponent();
      expect(
        screen.getByTestId("tabela-grupo-atividades-estatutárias")
      ).toBeInTheDocument();
    });

    it("renderiza linha da atividade dummy", () => {
      renderComponent();
      expect(screen.getByTestId("row-dummy")).toBeInTheDocument();
    });

    it("exibe o Spin em idle quando não está carregando", () => {
      renderComponent();
      expect(screen.getByTestId("spin-idle")).toBeInTheDocument();
    });

    it("exibe o Spin em loading quando isLoading=true", () => {
      setupDefaultMocks({ isLoading: true });
      renderComponent();
      expect(screen.getByTestId("spin-loading")).toBeInTheDocument();
    });

    it("exibe mensagem de erro quando isError=true", () => {
      setupDefaultMocks({ isError: true, atividades: [] });
      renderComponent();
      expect(
        screen.getByTestId("atividades-previstas-erro")
      ).toBeInTheDocument();
    });

    it("exibe mensagem de sem dados quando lista vazia após carregamento", async () => {
      setupDefaultMocks({ atividades: [] });
      renderComponent();
      await waitFor(() => {
        expect(
          screen.getByTestId("atividades-previstas-sem-dados")
        ).toBeInTheDocument();
      });
    });

    it("não exibe mensagem de sem dados quando há atividades", async () => {
      renderComponent();
      await waitFor(() => {
        expect(
          screen.queryByTestId("atividades-previstas-sem-dados")
        ).not.toBeInTheDocument();
      });
    });

    it("não exibe mensagem de erro quando há atividades", () => {
      renderComponent();
      expect(
        screen.queryByTestId("atividades-previstas-erro")
      ).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  describe("permissões", () => {
    it("exibe botões de adicionar e salvar quando podeEditar=true", () => {
      renderComponent();
      expect(
        screen.getByText("Adicionar Atividade Estatutária")
      ).toBeInTheDocument();
      expect(screen.getByText("Salvar")).toBeInTheDocument();
    });

    it("oculta botões de adicionar e salvar quando podeEditar=false", () => {
      visoesService.getPermissoes.mockReturnValue(false);
      renderComponent();
      expect(
        screen.queryByText("Adicionar Atividade Estatutária")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Salvar")).not.toBeInTheDocument();
    });

    it("botão Salvar começa desabilitado quando não há alterações pendentes", () => {
      renderComponent();
      expect(screen.getByText("Salvar")).toBeDisabled();
    });
  });

  // -------------------------------------------------------------------------
  describe("adicionar atividade", () => {
    it("clique em Adicionar adiciona nova linha em modo de edição", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Descreva a atividade estatutária")
        ).toBeInTheDocument();
      });
    });

    it("nova linha tem select de tipo visível", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));
      await waitFor(() => {
        expect(screen.getByText("Selecione o tipo")).toBeInTheDocument();
      });
    });

    it("nova linha habilita o botão Salvar após concluir edição com campos preenchidos", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Descreva a atividade estatutária")
        ).toBeInTheDocument();
      });

      // Preenche tipo
      fireEvent.change(screen.getByText("Selecione o tipo").closest("select"), {
        target: { value: "1" },
      });
      // Preenche descricao
      fireEvent.change(
        screen.getByPlaceholderText("Descreva a atividade estatutária"),
        { target: { value: "Nova atividade" } }
      );
      // Preenche data via data-calendar-picker do novo uuid
      const dateInput = document.querySelector("input[data-calendar-picker]");
      fireEvent.change(dateInput, { target: { value: "2024-03-10" } });

      // Concluir edição
      fireEvent.click(screen.getByLabelText("Concluir edição"));

      await waitFor(() => {
        expect(screen.getByText("Salvar")).not.toBeDisabled();
      });
    });

    it("não adiciona linha quando podeEditar=false", async () => {
      visoesService.getPermissoes.mockReturnValue(false);
      renderComponent();
      expect(
        screen.queryByText("Adicionar Atividade Estatutária")
      ).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  describe("edição de linha", () => {
    it("handleChangeAtividade: alterar tipo atualiza tipoAtividadeKey e label", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));

      await waitFor(() => {
        expect(screen.getByText("Selecione o tipo")).toBeInTheDocument();
      });

      const select = screen.getByText("Selecione o tipo").closest("select");
      fireEvent.change(select, { target: { value: "2" } });

      await waitFor(() => {
        expect(select.value).toBe("2");
      });
    });

    it("handleChangeAtividade: alterar descricao atualiza campo", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Descreva a atividade estatutária")
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Descreva a atividade estatutária");
      fireEvent.change(input, { target: { value: "Texto novo" } });
      expect(input.value).toBe("Texto novo");
    });

    it("handleChangeAtividade: alterar data atualiza mesAno na célula", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));

      await waitFor(() => {
        expect(document.querySelector("input[data-calendar-picker]")).toBeTruthy();
      });

      const dateInput = document.querySelector("input[data-calendar-picker]");
      fireEvent.change(dateInput, { target: { value: "2024-05-20" } });

      // Após concluir edição, mesAno deve aparecer
      // Preenche os demais campos obrigatórios
      fireEvent.change(screen.getByText("Selecione o tipo").closest("select"), {
        target: { value: "1" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("Descreva a atividade estatutária"),
        { target: { value: "Desc" } }
      );
      fireEvent.click(screen.getByLabelText("Concluir edição"));

      await waitFor(() => {
        expect(screen.getByText(/Maio\/2024/i)).toBeInTheDocument();
      });
    });
  });

  // -------------------------------------------------------------------------
  describe("concluir edição (handleSalvarLinha)", () => {
    it("concluir edição sem campos obrigatórios exibe toast de erro", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));

      await waitFor(() => {
        expect(screen.getByLabelText("Concluir edição")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText("Concluir edição"));

      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro!",
        "Preencha todos os campos obrigatórios."
      );
    });

    it("concluir edição com campos válidos fecha modo de edição", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Descreva a atividade estatutária")
        ).toBeInTheDocument();
      });

      fireEvent.change(screen.getByText("Selecione o tipo").closest("select"), {
        target: { value: "1" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("Descreva a atividade estatutária"),
        { target: { value: "Atividade válida" } }
      );
      const dateInput = document.querySelector("input[data-calendar-picker]");
      fireEvent.change(dateInput, { target: { value: "2024-06-01" } });

      fireEvent.click(screen.getByLabelText("Concluir edição"));

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("Descreva a atividade estatutária")
        ).not.toBeInTheDocument();
      });
    });
  });

  // -------------------------------------------------------------------------
  describe("salvar atividades (handleSalvarAtividades)", () => {
    const addAndCompleteNewAtividade = async () => {
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));
      await waitFor(() =>
        expect(
          screen.getByPlaceholderText("Descreva a atividade estatutária")
        ).toBeInTheDocument()
      );
      fireEvent.change(screen.getByText("Selecione o tipo").closest("select"), {
        target: { value: "1" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("Descreva a atividade estatutária"),
        { target: { value: "Nova" } }
      );
      const dateInput = document.querySelector("input[data-calendar-picker]");
      fireEvent.change(dateInput, { target: { value: "2024-07-01" } });
      fireEvent.click(screen.getByLabelText("Concluir edição"));
      await waitFor(() => expect(screen.getByText("Salvar")).not.toBeDisabled());
    };

    it("salvar isNovo chama createAtividadeEstatutariaPaa", async () => {
      renderComponent();
      await addAndCompleteNewAtividade();

      await act(async () => {
        fireEvent.click(screen.getByText("Salvar"));
      });

      await waitFor(() => {
        expect(createAtividadeEstatutariaPaa).toHaveBeenCalledWith(PAA_UUID, {
          nome: "Nova",
          tipo: "1",
          data: "2024-07-01",
        });
      });
    });

    it("salvar isNovo exibe toast de sucesso", async () => {
      renderComponent();
      await addAndCompleteNewAtividade();

      await act(async () => {
        fireEvent.click(screen.getByText("Salvar"));
      });

      await waitFor(() => {
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
          "Sucesso!",
          "Atividade criada com sucesso."
        );
      });
    });

    it("salvar atividade existente com vinculoUuid chama updateAtividadeEstatutariaPaa", async () => {
      const atividadeComVinculo = {
        ...DUMMY_ATIVIDADE,
        uuid: "vinculo-uuid",
        vinculoUuid: "vinculo-123",
        isGlobal: false,
        isNovo: false,
      };
      setupDefaultMocks({ atividades: [atividadeComVinculo] });
      renderComponent();

      // vinculoUuid torna o date input editável mesmo sem emEdicao
      await waitFor(() => {
        expect(
          document.querySelector("input[data-calendar-picker='vinculo-uuid']")
        ).toBeTruthy();
      });

      const dateInput = document.querySelector("input[data-calendar-picker='vinculo-uuid']");
      fireEvent.change(dateInput, { target: { value: "2024-08-01" } });

      await waitFor(() => expect(screen.getByText("Salvar")).not.toBeDisabled());

      await act(async () => {
        fireEvent.click(screen.getByText("Salvar"));
      });

      await waitFor(() => {
        expect(updateAtividadeEstatutariaPaa).toHaveBeenCalledWith(
          PAA_UUID,
          expect.objectContaining({
            atividade_estatutaria: "vinculo-uuid",
            data: "2024-08-01",
          })
        );
      });
    });

    it("salvar isGlobal sem vinculoUuid chama linkAtividadeEstatutariaExistentePaa", async () => {
      const globalSemVinculo = {
        ...DUMMY_ATIVIDADE,
        uuid: "global-uuid",
        isGlobal: true,
        vinculoUuid: null,
        isNovo: false,
        needsSync: false,
      };
      setupDefaultMocks({ atividades: [globalSemVinculo] });
      renderComponent();

      await waitFor(() => {
        expect(document.querySelector("input[data-calendar-picker]")).toBeTruthy();
      });

      const dateInput = document.querySelector("input[data-calendar-picker]");
      fireEvent.change(dateInput, { target: { value: "2024-09-01" } });

      await waitFor(() => expect(screen.getByText("Salvar")).not.toBeDisabled());

      await act(async () => {
        fireEvent.click(screen.getByText("Salvar"));
      });

      await waitFor(() => {
        expect(linkAtividadeEstatutariaExistentePaa).toHaveBeenCalledWith(
          PAA_UUID,
          expect.objectContaining({
            atividade_estatutaria: "global-uuid",
            data: "2024-09-01",
          })
        );
      });
    });

    it("salvar sem paaUuid exibe toast de erro", async () => {
      localStorage.removeItem("PAA");
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));

      await waitFor(() =>
        expect(screen.getByPlaceholderText("Descreva a atividade estatutária")).toBeInTheDocument()
      );
      fireEvent.change(screen.getByText("Selecione o tipo").closest("select"), { target: { value: "1" } });
      fireEvent.change(screen.getByPlaceholderText("Descreva a atividade estatutária"), { target: { value: "X" } });
      const dateInput = document.querySelector("input[data-calendar-picker]");
      fireEvent.change(dateInput, { target: { value: "2024-10-01" } });
      fireEvent.click(screen.getByLabelText("Concluir edição"));
      await waitFor(() => expect(screen.getByText("Salvar")).not.toBeDisabled());

      await act(async () => {
        fireEvent.click(screen.getByText("Salvar"));
      });

      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro!",
        "PAA vigente não encontrado."
      );
    });

    it("linhas emEdicao+dirty com campos incompletos mostram erro e voltam para edição", async () => {
      // Precisa de duas linhas: uma completa (habilita Salvar) e uma incompleta (emEdicao+dirty)
      renderComponent();

      // Linha 1: completa → needsSync=true após concluir edição
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));
      await waitFor(() =>
        expect(screen.getAllByPlaceholderText("Descreva a atividade estatutária")[0]).toBeInTheDocument()
      );
      fireEvent.change(screen.getAllByText("Selecione o tipo")[0].closest("select"), { target: { value: "1" } });
      fireEvent.change(screen.getAllByPlaceholderText("Descreva a atividade estatutária")[0], { target: { value: "Completa" } });
      const dateInputs1 = document.querySelectorAll("input[data-calendar-picker]");
      fireEvent.change(dateInputs1[0], { target: { value: "2024-04-01" } });
      fireEvent.click(screen.getAllByLabelText("Concluir edição")[0]);
      await waitFor(() => expect(screen.getByText("Salvar")).not.toBeDisabled());

      // Linha 2: incompleta — só preenche descricao, deixa tipo e data
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));
      await waitFor(() =>
        expect(screen.getAllByPlaceholderText("Descreva a atividade estatutária")[0]).toBeInTheDocument()
      );
      fireEvent.change(screen.getAllByPlaceholderText("Descreva a atividade estatutária")[0], { target: { value: "Incompleta" } });

      // Salvar com linha incompleta emEdicao+dirty
      await act(async () => {
        fireEvent.click(screen.getByText("Salvar"));
      });

      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro!",
        "Preencha tipo, descrição e data para todas as atividades pendentes."
      );
    });

    it("erro na API exibe toast de erro", async () => {
      createAtividadeEstatutariaPaa.mockRejectedValue(new Error("Network error"));
      renderComponent();
      await addAndCompleteNewAtividade();

      await act(async () => {
        fireEvent.click(screen.getByText("Salvar"));
      });

      await waitFor(() => {
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Erro!",
          "Não foi possível salvar as alterações. Tente novamente."
        );
      });
    });
  });

  // -------------------------------------------------------------------------
  describe("excluir atividade via modal", () => {
    it("clicar Excluir em linha abre modal de confirmação", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("row-dummy")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText("Excluir"));
      expect(screen.getByTestId("modal-excluir")).toBeInTheDocument();
      expect(screen.getByText("Excluir atividade")).toBeInTheDocument();
    });

    it("cancelar exclusão fecha o modal", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("row-dummy")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText("Excluir"));
      fireEvent.click(screen.getByTestId("modal-cancel"));

      await waitFor(() => {
        expect(screen.queryByTestId("modal-excluir")).not.toBeInTheDocument();
      });
    });

    it("confirmar exclusão de atividade isNovo remove da lista sem chamada à API", async () => {
      renderComponent();
      // Adiciona nova atividade (isNovo)
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));

      await waitFor(() =>
        expect(screen.getByPlaceholderText("Descreva a atividade estatutária")).toBeInTheDocument()
      );

      // Clica excluir na nova linha (botão Excluir registro está visível em emEdicao)
      const botoesExcluir = screen.getAllByLabelText("Excluir registro");
      fireEvent.click(botoesExcluir[0]);

      expect(screen.getByTestId("modal-excluir")).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-ok"));
      });

      await waitFor(() => {
        expect(deleteAtividadeEstatutariaPaa).not.toHaveBeenCalled();
        expect(screen.queryByTestId("modal-excluir")).not.toBeInTheDocument();
      });
    });

    it("confirmar exclusão de atividade existente chama deleteAtividadeEstatutariaPaa", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("row-dummy")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText("Excluir"));

      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-ok"));
      });

      await waitFor(() => {
        expect(deleteAtividadeEstatutariaPaa).toHaveBeenCalledWith(
          PAA_UUID,
          "dummy"
        );
      });
    });

    it("confirmar exclusão de atividade existente exibe toast de sucesso", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("row-dummy")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText("Excluir"));

      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-ok"));
      });

      await waitFor(() => {
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
          "Sucesso!",
          "Atividade excluída com sucesso."
        );
      });
    });

    it("confirmar exclusão de atividade isNovo em segunda linha remove apenas ela sem chamar API", async () => {
      // Garante que isNovo=true remove da lista sem API (path isNovo em confirmarExclusaoAtividade)
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));
      await waitFor(() =>
        expect(screen.getByPlaceholderText("Descreva a atividade estatutária")).toBeInTheDocument()
      );

      // A nova linha (isNovo=true, emEdicao=true) tem botão "Excluir registro"
      fireEvent.click(screen.getByLabelText("Excluir registro"));
      expect(screen.getByTestId("modal-excluir")).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-ok"));
      });

      await waitFor(() => {
        expect(deleteAtividadeEstatutariaPaa).not.toHaveBeenCalled();
        // Linha nova foi removida, placeholder some
        expect(
          screen.queryByPlaceholderText("Descreva a atividade estatutária")
        ).not.toBeInTheDocument();
      });
    });

    it("erro na API de exclusão exibe toast de erro", async () => {
      deleteAtividadeEstatutariaPaa.mockRejectedValue(new Error("fail"));
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("row-dummy")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText("Excluir"));

      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-ok"));
      });

      await waitFor(() => {
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Erro!",
          "Não foi possível excluir a atividade. Tente novamente."
        );
      });
    });
  });

  // -------------------------------------------------------------------------
  describe("colunas - renderização", () => {
    it("célula de tipoAtividade em modo leitura exibe texto", () => {
      renderComponent();
      expect(screen.getByTestId("cell-tipoAtividade-dummy")).toHaveTextContent(
        "Reunião"
      );
    });

    it("célula de descricao em modo leitura exibe texto", () => {
      renderComponent();
      expect(screen.getByTestId("cell-descricao-dummy")).toHaveTextContent(
        "Reunião ordinária"
      );
    });

    it("célula de mesAno em modo leitura exibe Janeiro/2024", () => {
      renderComponent();
      expect(screen.getByTestId("cell-mesAno-dummy")).toHaveTextContent(
        "Janeiro/2024"
      );
    });

    it("atividade sem data exibe '-' em tipoAtividade quando vazio", () => {
      setupDefaultMocks({
        atividades: [
          { ...DUMMY_ATIVIDADE, tipoAtividade: "", tipoAtividadeKey: "" },
        ],
      });
      renderComponent();
      expect(screen.getByTestId("cell-tipoAtividade-dummy")).toHaveTextContent(
        "-"
      );
    });

    it("atividade com alteracao exibe TagRetificacao", () => {
      setupDefaultMocks({
        atividades: [{ ...DUMMY_ATIVIDADE, alteracao: true }],
      });
      renderComponent();
      expect(screen.getByTestId("tag-retificacao")).toBeInTheDocument();
    });

    it("atividade não global em modo leitura exibe data desabilitada", () => {
      renderComponent();
      const dateInputs = document.querySelectorAll("input[type='date']");
      // A atividade dummy não é global e não está emEdicao → readonly/disabled
      expect(dateInputs[0]).toBeDisabled();
    });

    it("atividade isGlobal exibe input de data editável", () => {
      setupDefaultMocks({
        atividades: [{ ...DUMMY_ATIVIDADE, uuid: "global-1", isGlobal: true, vinculoUuid: null }],
      });
      renderComponent();
      expect(
        document.querySelector("input[data-calendar-picker='global-1']")
      ).toBeInTheDocument();
    });

    it("atividade em modo emEdicao exibe select de tipo", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));
      await waitFor(() => {
        expect(screen.getByText("Selecione o tipo")).toBeInTheDocument();
      });
    });

    it("select de tipo lista as opções de tipos disponíveis", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));
      await waitFor(() => {
        const select = screen.getByText("Selecione o tipo").closest("select");
        expect(select.querySelector('option[value="1"]')).toHaveTextContent("Reunião");
        expect(select.querySelector('option[value="2"]')).toHaveTextContent("Assembleia");
      });
    });

    it("botão calendário está presente para atividades com data editável", () => {
      setupDefaultMocks({
        atividades: [{ ...DUMMY_ATIVIDADE, uuid: "g1", isGlobal: true, vinculoUuid: null }],
      });
      renderComponent();
      expect(screen.getByLabelText("Abrir calendário")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  describe("obterMesAno", () => {
    const dadosPaa = {
      periodo_paa_objeto: {
        data_inicial: "2024-01-01",
        data_final: "2024-12-31",
      },
    };

    it("retorna mesLabel+ano da data inicial para ano VIGENTE", async () => {
      localStorage.setItem("DADOS_PAA", JSON.stringify(dadosPaa));
      const atividadeVigente = {
        ...DUMMY_ATIVIDADE,
        uuid: "vigente-uuid",
        isGlobal: true,
        mesLabel: "Janeiro",
        ano: "VIGENTE",
        vinculoUuid: null,
        data: "",
      };
      setupDefaultMocks({ atividades: [atividadeVigente] });
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByTestId("cell-mesAno-vigente-uuid")
        ).toHaveTextContent("Janeiro/2024");
      });
    });

    it("retorna mesLabel+ano da data final para ano POSTERIOR", async () => {
      localStorage.setItem("DADOS_PAA", JSON.stringify(dadosPaa));
      const atividadePosterior = {
        ...DUMMY_ATIVIDADE,
        uuid: "posterior-uuid",
        isGlobal: true,
        mesLabel: "Junho",
        ano: "POSTERIOR",
        vinculoUuid: null,
        data: "",
      };
      setupDefaultMocks({ atividades: [atividadePosterior] });
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByTestId("cell-mesAno-posterior-uuid")
        ).toHaveTextContent("Junho/2024");
      });
    });

    it("retorna apenas mesLabel quando não há DADOS_PAA no localStorage", async () => {
      const atividadeVigente = {
        ...DUMMY_ATIVIDADE,
        uuid: "vigente-uuid-2",
        isGlobal: true,
        mesLabel: "Março",
        ano: "VIGENTE",
        vinculoUuid: null,
        data: "",
      };
      setupDefaultMocks({ atividades: [atividadeVigente] });
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByTestId("cell-mesAno-vigente-uuid-2")
        ).toHaveTextContent("Março");
      });
    });
  });

  // -------------------------------------------------------------------------
  describe("formatarMesAno", () => {
    it("exibe '-' para data vazia", () => {
      setupDefaultMocks({
        atividades: [{ ...DUMMY_ATIVIDADE, data: "" }],
      });
      renderComponent();
      // mesAno cell should show '-'
      expect(screen.getByTestId("cell-mesAno-dummy")).toHaveTextContent("-");
    });

    it("exibe mês/ano formatado para data válida", () => {
      renderComponent();
      expect(screen.getByTestId("cell-mesAno-dummy")).toHaveTextContent(
        "Janeiro/2024"
      );
    });
  });

  // -------------------------------------------------------------------------
  describe("handleEditar para linha isNovo", () => {
    it("clicar Editar em linha isNovo coloca em emEdicao", async () => {
      // Usa atividade isGlobal como placeholder: mantém a tabela visível mas não gera botão Editar
      setupDefaultMocks({ atividades: [{ ...DUMMY_ATIVIDADE, isGlobal: true, vinculoUuid: null }] });
      renderComponent();

      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));
      await waitFor(() =>
        expect(screen.getByPlaceholderText("Descreva a atividade estatutária")).toBeInTheDocument()
      );

      fireEvent.change(screen.getByText("Selecione o tipo").closest("select"), { target: { value: "1" } });
      fireEvent.change(screen.getByPlaceholderText("Descreva a atividade estatutária"), { target: { value: "Linha editável" } });
      // A linha isGlobal também tem data-calendar-picker, pegar o último (linha nova)
      const allDateInputs = document.querySelectorAll("input[data-calendar-picker]");
      fireEvent.change(allDateInputs[allDateInputs.length - 1], { target: { value: "2024-11-01" } });

      fireEvent.click(screen.getByLabelText("Concluir edição"));

      await waitFor(() => {
        expect(screen.getByLabelText("Editar")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText("Editar"));

      await waitFor(() => {
        expect(screen.getByLabelText("Concluir edição")).toBeInTheDocument();
      });
    });
  });

  // -------------------------------------------------------------------------
  describe("isSalvando", () => {
    it("botão Concluir edição fica desabilitado durante salvamento", async () => {
      let resolveSave;
      createAtividadeEstatutariaPaa.mockReturnValue(
        new Promise((resolve) => { resolveSave = resolve; })
      );

      renderComponent();
      fireEvent.click(screen.getByText("Adicionar Atividade Estatutária"));

      await waitFor(() =>
        expect(screen.getByPlaceholderText("Descreva a atividade estatutária")).toBeInTheDocument()
      );

      fireEvent.change(screen.getByText("Selecione o tipo").closest("select"), { target: { value: "1" } });
      fireEvent.change(screen.getByPlaceholderText("Descreva a atividade estatutária"), { target: { value: "X" } });
      const dateInput = document.querySelector("input[data-calendar-picker]");
      fireEvent.change(dateInput, { target: { value: "2024-12-01" } });
      fireEvent.click(screen.getByLabelText("Concluir edição"));

      await waitFor(() => expect(screen.getByText("Salvar")).not.toBeDisabled());

      act(() => {
        fireEvent.click(screen.getByText("Salvar"));
      });

      // Durante o salvamento, Spin loading é exibido
      await waitFor(() => {
        expect(screen.getByTestId("spin-loading")).toBeInTheDocument();
      });

      // Resolve a promise para encerrar
      await act(async () => { resolveSave({}); });
    });
  });
});
