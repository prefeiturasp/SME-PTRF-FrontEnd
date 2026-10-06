import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LegendaInformacao } from "../LegendaInformacao";

jest.mock("../ModalLegendaInformacao", () => ({
  ModalLegendaInformacao: ({ show, titulo, primeiroBotaoTexto, primeiroBotaoOnclick, excludedTags, entidadeDasTags }) =>
    show ? (
      <div>
        <p>{titulo}</p>
        <p>entidade {entidadeDasTags}</p>
        <p>excluidas {excludedTags.join(",")}</p>
        <button type="button" onClick={primeiroBotaoOnclick}>{primeiroBotaoTexto}</button>
      </div>
    ) : null,
}));

describe("LegendaInformacao", () => {
  it("deve abrir e fechar a legenda das informações", async () => {
    const user = userEvent.setup();
    const setShowModalLegendaInformacao = jest.fn();

    const { rerender } = render(
      <LegendaInformacao
        showModalLegendaInformacao={false}
        setShowModalLegendaInformacao={setShowModalLegendaInformacao}
        excludedTags={["ENCERRADA"]}
        entidadeDasTags="associacao"
      />
    );

    expect(screen.queryByText("Legenda Informação")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Legenda informação" }));
    expect(setShowModalLegendaInformacao).toHaveBeenCalledWith(true);

    rerender(
      <LegendaInformacao
        showModalLegendaInformacao
        setShowModalLegendaInformacao={setShowModalLegendaInformacao}
        excludedTags={["ENCERRADA"]}
        entidadeDasTags="associacao"
      />
    );

    expect(screen.getByText("Legenda Informação")).toBeInTheDocument();
    expect(screen.getByText("entidade associacao")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(setShowModalLegendaInformacao).toHaveBeenCalledWith(false);
  });
});
