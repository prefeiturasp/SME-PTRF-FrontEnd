import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabelaTextosPaa from "../TabelaTextosPaa";

describe("TabelaTextosPaa", () => {
  it("deve listar os textos do PAA e disponibilizar a edição de cada um", async () => {
    const user = userEvent.setup();
    const acoesTemplate = jest.fn((campo) => (
      <button type="button" onClick={() => {}}>Editar {campo}</button>
    ));

    render(<TabelaTextosPaa acoesTemplate={acoesTemplate} />);

    expect(screen.getByRole("columnheader", { name: "Textos do PAA" })).toBeInTheDocument();
    expect(screen.getByText("Explicação sobre o PAA")).toBeInTheDocument();
    expect(screen.getByText("Atividades previstas")).toBeInTheDocument();
    expect(screen.getByText("Levantamento de prioridades")).toBeInTheDocument();
    expect(screen.getByText("Informe de bloqueio de prioridades")).toBeInTheDocument();
    expect(screen.getByText("Introdução 1:")).toBeInTheDocument();
    expect(screen.getByText("Conclusão 2:")).toBeInTheDocument();

    expect(acoesTemplate).toHaveBeenCalledWith("texto_pagina_paa_ue");
    expect(acoesTemplate).toHaveBeenCalledWith("introducao_do_paa_ue_1");
    expect(acoesTemplate).toHaveBeenCalledWith("conclusao_do_paa_ue_2");

    await user.click(screen.getByRole("button", { name: "Editar texto_atividades_previstas" }));
    expect(screen.getByRole("button", { name: "Editar texto_atividades_previstas" })).toBeInTheDocument();
  });
});
