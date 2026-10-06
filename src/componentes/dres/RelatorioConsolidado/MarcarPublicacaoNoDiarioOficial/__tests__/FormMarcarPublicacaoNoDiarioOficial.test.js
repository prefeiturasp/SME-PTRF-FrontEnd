import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FormMarcarPublicacaoNoDiarioOficial from "../FormMarcarPublicacaoNoDiarioOficial";
import {
  postDesmarcarComoPublicadoNoDiarioOficial,
  postMarcarComoPublicadoNoDiarioOficial,
} from "../../../../../services/dres/RelatorioConsolidado.service";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

jest.mock("../../../../../services/dres/RelatorioConsolidado.service", () => ({
  postMarcarComoPublicadoNoDiarioOficial: jest.fn(),
  postDesmarcarComoPublicadoNoDiarioOficial: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

jest.mock("../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../../../../Globais/DatePickerField", () => ({
  DatePickerField: (props) => (
    <input
      aria-label="Data da publicação"
      value={props.value || ""}
      onChange={(e) => props.onChange(props.name, e.target.value)}
    />
  ),
}));

jest.mock("../../ModalConfirmDesmarcarPublicacaoNoDiarioOficial", () => (props) =>
  props.show ? (
    <div data-testid="modal-confirmar-remocao">
      <span>{props.titulo}</span>
      <span>{props.texto}</span>
      <button onClick={props.segundoBotaoOnclick}>Confirmar remoção</button>
      <button onClick={props.handleClose}>Cancelar remoção</button>
    </div>
  ) : null
);

describe("FormMarcarPublicacaoNoDiarioOficial Component", () => {
  const mockConsolidadoDre = {
    uuid: "consolidado-uuid-1",
    data_publicacao: "2025-03-10",
    pagina_publicacao: "42",
    status_sme: "PUBLICADO",
    permite_excluir_data_e_pagina_publicacao: true,
  };

  const mockHandleClose = jest.fn();
  const mockCarregaConsolidados = jest.fn();

  const mockContexto = (habilitaLauda = false) => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { habilita_exibicao_de_lauda: habilitaLauda },
    });
  };

  const renderComponente = (consolidadoDre = mockConsolidadoDre) =>
    render(
      <FormMarcarPublicacaoNoDiarioOficial
        consolidadoDre={consolidadoDre}
        carregaConsolidadosDreJaPublicadosProximaPublicacao={mockCarregaConsolidados}
        handleClose={mockHandleClose}
        textoMsg="Mensagem de sucesso"
        textoBotaoSalvar="Informar"
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockContexto();
    postMarcarComoPublicadoNoDiarioOficial.mockResolvedValue({});
    postDesmarcarComoPublicadoNoDiarioOficial.mockResolvedValue({});
    mockCarregaConsolidados.mockResolvedValue(undefined);
  });

  describe("Modos do formulário", () => {
    const renderComModo = (consolidadoDre, textoBotaoSalvar) =>
      render(
        <FormMarcarPublicacaoNoDiarioOficial
          consolidadoDre={consolidadoDre}
          carregaConsolidadosDreJaPublicadosProximaPublicacao={mockCarregaConsolidados}
          handleClose={mockHandleClose}
          textoMsg="Mensagem de sucesso"
          textoBotaoSalvar={textoBotaoSalvar}
        />
      );

    it("deve abrir em modo inclusão com campos vazios, botão Informar e sem permitir remover", () => {
      mockContexto(true);

      renderComModo(
        {
          uuid: "consolidado-uuid-1",
          data_publicacao: null,
          pagina_publicacao: "",
          status_sme: "NAO_PUBLICADO",
          permite_excluir_data_e_pagina_publicacao: false,
        },
        "Informar"
      );

      expect(screen.getByLabelText("Data da publicação")).toHaveValue("");
      expect(
        screen.getByLabelText("Informar página da lauda no Diário Oficial")
      ).toHaveValue("");
      expect(screen.getByRole("button", { name: "Informar" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Salvar" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Remover" })).toBeDisabled();
    });

    it("deve abrir em modo edição com os dados preenchidos, botão Salvar e permitindo remover", () => {
      mockContexto(true);

      renderComModo(mockConsolidadoDre, "Salvar");

      expect(screen.getByLabelText("Data da publicação")).toHaveValue("2025-03-10");
      expect(
        screen.getByLabelText("Informar página da lauda no Diário Oficial")
      ).toHaveValue("42");
      expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Remover" })).toBeEnabled();
    });

    it("deve salvar a edição da data com o texto do modo edição", async () => {
      renderComModo(mockConsolidadoDre, "Salvar");

      fireEvent.change(screen.getByLabelText("Data da publicação"), {
        target: { value: "2025-05-20" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(postMarcarComoPublicadoNoDiarioOficial).toHaveBeenCalledWith({
          consolidado_dre: "consolidado-uuid-1",
          data_publicacao: "2025-05-20",
          pagina_publicacao: "42",
        });
      });
    });
  });

  describe("Renderização dos campos", () => {
    it("deve exibir o texto de envio externo e esconder o campo de página quando a lauda não estiver habilitada", () => {
      renderComponente();

      expect(
        screen.getByText("Selecione a data do envio externo da documentação")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Data da publicação")).toHaveValue("2025-03-10");
      expect(
        screen.queryByLabelText("Informar página da lauda no Diário Oficial")
      ).not.toBeInTheDocument();
    });

    it("deve exibir o texto de publicação e o campo de página quando a lauda estiver habilitada", () => {
      mockContexto(true);

      renderComponente();

      expect(
        screen.getByText(
          "Selecione a data e a página da publicação no Diário Oficial da Cidade"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Informar página da lauda no Diário Oficial")
      ).toHaveValue("42");
    });

    it("deve exibir o texto do botão salvar recebido por props", () => {
      renderComponente();

      expect(screen.getByRole("button", { name: "Informar" })).toBeInTheDocument();
    });

    it("deve chamar handleClose ao clicar em Cancelar", () => {
      renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Marcar como publicado", () => {
    it("deve enviar a data de publicação, fechar o modal, exibir o toast e recarregar os consolidados", async () => {
      renderComponente({ ...mockConsolidadoDre, data_publicacao: null });

      fireEvent.change(screen.getByLabelText("Data da publicação"), {
        target: { value: "2025-04-15" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Informar" }));

      await waitFor(() => {
        expect(postMarcarComoPublicadoNoDiarioOficial).toHaveBeenCalledWith({
          consolidado_dre: "consolidado-uuid-1",
          data_publicacao: "2025-04-15",
          pagina_publicacao: "42",
        });
      });
      await waitFor(() => {
        expect(mockCarregaConsolidados).toHaveBeenCalledTimes(1);
      });
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Data aplicada com sucesso.",
        "Mensagem de sucesso"
      );
    });

    it("deve enviar a página da publicação quando a lauda estiver habilitada", async () => {
      mockContexto(true);

      renderComponente();

      fireEvent.change(
        screen.getByLabelText("Informar página da lauda no Diário Oficial"),
        { target: { value: "99" } }
      );
      fireEvent.click(screen.getByRole("button", { name: "Informar" }));

      await waitFor(() => {
        expect(postMarcarComoPublicadoNoDiarioOficial).toHaveBeenCalledWith({
          consolidado_dre: "consolidado-uuid-1",
          data_publicacao: "2025-03-10",
          pagina_publicacao: "99",
        });
      });
      await waitFor(() => {
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
          "Data e página da publicação aplicadas com sucesso.",
          "Mensagem de sucesso"
        );
      });
    });

    it("deve exibir erro de validação e não enviar quando a data não for informada", async () => {
      renderComponente({ ...mockConsolidadoDre, data_publicacao: null });

      fireEvent.click(screen.getByRole("button", { name: "Informar" }));

      expect(await screen.findByText("Campo data é obrigatório")).toBeInTheDocument();
      expect(postMarcarComoPublicadoNoDiarioOficial).not.toHaveBeenCalled();
    });

    it("deve exibir erro de validação quando a lauda estiver habilitada e a página não for informada", async () => {
      mockContexto(true);

      renderComponente({ ...mockConsolidadoDre, pagina_publicacao: "" });

      fireEvent.click(screen.getByRole("button", { name: "Informar" }));

      expect(
        await screen.findByText("Campo página da publicação é obrigatório")
      ).toBeInTheDocument();
      expect(postMarcarComoPublicadoNoDiarioOficial).not.toHaveBeenCalled();
    });

    it("deve fechar o modal sem exibir toast nem recarregar quando a API falhar", async () => {
      postMarcarComoPublicadoNoDiarioOficial.mockRejectedValue(new Error("Erro"));

      renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Informar" }));

      await waitFor(() => {
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
      });
      expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
      expect(mockCarregaConsolidados).not.toHaveBeenCalled();
    });
  });

  describe("Botão Remover", () => {
    it("deve estar habilitado quando houver data, o status não for EM_ANALISE e a exclusão for permitida", () => {
      renderComponente();

      expect(screen.getByRole("button", { name: "Remover" })).toBeEnabled();
    });

    it.each([
      ["não houver data de publicação", { data_publicacao: null }],
      ["o status SME for EM_ANALISE", { status_sme: "EM_ANALISE" }],
      [
        "a exclusão não for permitida",
        { permite_excluir_data_e_pagina_publicacao: false },
      ],
    ])("deve estar desabilitado quando %s", (_, alteracao) => {
      renderComponente({ ...mockConsolidadoDre, ...alteracao });

      expect(screen.getByRole("button", { name: "Remover" })).toBeDisabled();
    });

    it("deve estar desabilitado quando a lauda estiver habilitada e não houver página da publicação", () => {
      mockContexto(true);

      renderComponente({ ...mockConsolidadoDre, pagina_publicacao: "" });

      expect(screen.getByRole("button", { name: "Remover" })).toBeDisabled();
    });
  });

  describe("Remover publicação", () => {
    it("deve abrir o modal de confirmação com os textos de envio externo", () => {
      renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Remover" }));

      expect(screen.getByTestId("modal-confirmar-remocao")).toBeInTheDocument();
      expect(
        screen.getByText("Remover envio externo da documentação")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "<p>Deseja remover a data do envio externo da documentação?</p>"
        )
      ).toBeInTheDocument();
    });

    it("deve fechar o modal de confirmação ao cancelar", () => {
      renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Remover" }));
      fireEvent.click(screen.getByRole("button", { name: "Cancelar remoção" }));

      expect(screen.queryByTestId("modal-confirmar-remocao")).not.toBeInTheDocument();
      expect(postDesmarcarComoPublicadoNoDiarioOficial).not.toHaveBeenCalled();
    });

    it("deve remover a publicação, fechar os modais, exibir o toast e recarregar os consolidados", async () => {
      renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Remover" }));
      fireEvent.click(screen.getByRole("button", { name: "Confirmar remoção" }));

      await waitFor(() => {
        expect(postDesmarcarComoPublicadoNoDiarioOficial).toHaveBeenCalledWith({
          consolidado_dre: "consolidado-uuid-1",
        });
      });
      await waitFor(() => {
        expect(screen.queryByTestId("modal-confirmar-remocao")).not.toBeInTheDocument();
      });
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Informação do relatório removida com sucesso.",
        "Data com sucesso."
      );
      await waitFor(() => {
        expect(mockCarregaConsolidados).toHaveBeenCalledTimes(1);
      });
    });

    it("deve usar os textos de publicação na remoção quando a lauda estiver habilitada", async () => {
      mockContexto(true);

      renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Remover" }));

      expect(screen.getByText("Remover publicação")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Confirmar remoção" }));

      await waitFor(() => {
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
          "Informação da publicação removida com sucesso.",
          "Data e página da publicação removidas com sucesso."
        );
      });
    });

    it("deve fechar os modais sem exibir toast nem recarregar quando a API falhar", async () => {
      postDesmarcarComoPublicadoNoDiarioOficial.mockRejectedValue(new Error("Erro"));

      renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Remover" }));
      fireEvent.click(screen.getByRole("button", { name: "Confirmar remoção" }));

      await waitFor(() => {
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByTestId("modal-confirmar-remocao")).not.toBeInTheDocument();
      expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
      expect(mockCarregaConsolidados).not.toHaveBeenCalled();
    });
  });
});
