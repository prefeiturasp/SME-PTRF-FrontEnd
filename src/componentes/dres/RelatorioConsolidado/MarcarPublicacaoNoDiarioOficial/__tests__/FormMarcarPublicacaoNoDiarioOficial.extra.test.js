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
      <button onClick={props.onHide}>Fechar via onHide</button>
    </div>
  ) : null
);

describe("FormMarcarPublicacaoNoDiarioOficial - complementar", () => {
  beforeEach(() => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { habilita_exibicao_de_lauda: false },
    });
  });

  it("fecha o modal de confirmação de remoção pelo onHide sem chamar a API", () => {
    render(
      <FormMarcarPublicacaoNoDiarioOficial
        consolidadoDre={{
          uuid: "c1",
          data_publicacao: "2025-03-10",
          pagina_publicacao: "1",
          status_sme: "PUBLICADO",
          permite_excluir_data_e_pagina_publicacao: true,
        }}
        carregaConsolidadosDreJaPublicadosProximaPublicacao={jest.fn()}
        handleClose={jest.fn()}
        textoMsg="msg"
        textoBotaoSalvar="Informar"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Remover" }));
    expect(screen.getByTestId("modal-confirmar-remocao")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Fechar via onHide"));
    expect(screen.queryByTestId("modal-confirmar-remocao")).not.toBeInTheDocument();
    expect(postDesmarcarComoPublicadoNoDiarioOficial).not.toHaveBeenCalled();
  });
});
