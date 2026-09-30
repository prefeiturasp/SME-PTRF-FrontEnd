import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { InfoAssociacoesEmAnalise } from "../InfoAssociacoesEmAnalise";

describe("InfoAssociacoesEmAnalise Component", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = { assign: jest.fn() };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("não deve renderizar nada quando não houver associações em análise", () => {
    const { container } = render(
      <InfoAssociacoesEmAnalise totalEmAnalise={0} periodoUuid="periodo-1" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("deve exibir a mensagem no singular quando houver uma associação em análise", () => {
    render(<InfoAssociacoesEmAnalise totalEmAnalise={1} periodoUuid="periodo-1" />);

    expect(
      screen.getByText("Associações com pendências nas prestações de contas")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Existe 1 associação\s+ainda em análise nas prestações de contas/)
    ).toBeInTheDocument();
  });

  it("deve exibir a mensagem no plural quando houver mais de uma associação em análise", () => {
    render(<InfoAssociacoesEmAnalise totalEmAnalise={3} periodoUuid="periodo-1" />);

    expect(
      screen.getByText(/Existem 3 associações\s+ainda em análise nas prestações de contas/)
    ).toBeInTheDocument();
  });

  it("deve redirecionar para o painel de acompanhamento filtrado por EM_ANALISE", () => {
    render(<InfoAssociacoesEmAnalise totalEmAnalise={2} periodoUuid="periodo-1" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Ir para painel de acompanhamento" })
    );

    expect(window.location.assign).toHaveBeenCalledWith(
      "/dre-lista-prestacao-de-contas/periodo-1/EM_ANALISE"
    );
  });
});
