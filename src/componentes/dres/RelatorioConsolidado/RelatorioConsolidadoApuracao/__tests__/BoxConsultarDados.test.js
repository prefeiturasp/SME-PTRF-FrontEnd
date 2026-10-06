import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BoxConsultarDados } from "../BoxConsultarDados";

describe("BoxConsultarDados Component", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = { assign: jest.fn() };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("deve renderizar o título e o botão Consultar", () => {
    render(
      <BoxConsultarDados periodo_uuid="periodo-1" conta_uuid="conta-1" jaPublicado={false} />
    );

    expect(
      screen.getByText("Consulte os dados de todas as unidades educacionais")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Consultar" })).toBeInTheDocument();
  });

  it.each([false, true])(
    "deve redirecionar para os dados das UEs com jaPublicado=%p",
    (jaPublicado) => {
      render(
        <BoxConsultarDados
          periodo_uuid="periodo-1"
          conta_uuid="conta-1"
          jaPublicado={jaPublicado}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "Consultar" }));

      expect(window.location.assign).toHaveBeenCalledWith(
        `/dre-relatorio-consolidado-dados-das-ues/periodo-1/conta-1/${jaPublicado}`
      );
    }
  );
});
