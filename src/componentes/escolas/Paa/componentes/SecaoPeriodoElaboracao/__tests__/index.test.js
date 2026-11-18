import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SecaoPeriodoElaboracaoPaa } from "..";

const botao = (sobrescrever = {}) => ({
  visivel: true, habilitado: true, rotulo: "Elaborar novo PAA", mensagem: "", ...sobrescrever,
});

const secao = (vigencia, botaoDaSecao = botao()) => ({
  periodoUuid: `periodo-${vigencia}`,
  referencia: "2027",
  vigencia,
  dataInicial: "2027-05-01",
  dataFinal: "2028-04-30",
  botao: botaoDaSecao,
});

describe("SecaoPeriodoElaboracaoPaa", () => {
  it.each([
    ["VIGENTE", "Vigente"],
    ["PROXIMA_VIGENCIA", "Próxima vigência"],
    ["ENCERRADO", "Período encerrado"],
  ])("rotula a seção da vigência %s", (vigencia, rotulo) => {
    render(<SecaoPeriodoElaboracaoPaa secaoPeriodo={secao(vigencia)} onAcao={jest.fn()} />);

    expect(screen.getByTestId(`secaoPeriodo-${vigencia}`)).toBeInTheDocument();
    expect(screen.getByTestId("vigencia-elaboracao")).toHaveTextContent(`PAA ${rotulo}`);
  });

  it("acrescenta o intervalo do período ao rótulo do botão", () => {
    render(<SecaoPeriodoElaboracaoPaa secaoPeriodo={secao("VIGENTE")} onAcao={jest.fn()} />);

    expect(screen.getByTestId("elaborar-paa-button")).toHaveTextContent("Elaborar novo PAA 2027/2028");
  });

  it("dispara a ação com o botão da seção", () => {
    const onAcao = jest.fn();
    const comAcao = botao({ acao: "ELABORAR_NOVO", periodoUuid: "periodo-VIGENTE" });
    render(<SecaoPeriodoElaboracaoPaa secaoPeriodo={secao("VIGENTE", comAcao)} onAcao={onAcao} />);

    fireEvent.click(screen.getByTestId("elaborar-paa-button"));

    expect(onAcao).toHaveBeenCalledWith(
      expect.objectContaining({ acao: "ELABORAR_NOVO", periodoUuid: "periodo-VIGENTE", habilitado: true }));
  });

  it("botão bloqueado fica desabilitado com o motivo no title", () => {
    const bloqueado = botao({ habilitado: false, mensagem: "Motivo do bloqueio" });
    render(<SecaoPeriodoElaboracaoPaa secaoPeriodo={secao("VIGENTE", bloqueado)} onAcao={jest.fn()} />);

    expect(screen.getByTestId("elaborar-paa-button")).toBeDisabled();
    expect(screen.getByTestId("elaborar-paa-button")).toHaveAttribute("title", "Motivo do bloqueio");
  });

  it("botão oculto não exibe a seção do período", () => {
    render(<SecaoPeriodoElaboracaoPaa secaoPeriodo={secao("PROXIMA_VIGENCIA", botao({ visivel: false }))} onAcao={jest.fn()} />);

    expect(screen.queryByTestId("secaoPeriodo-PROXIMA_VIGENCIA")).not.toBeInTheDocument();
    expect(screen.queryByTestId("vigencia-elaboracao")).not.toBeInTheDocument();
    expect(screen.queryByTestId("elaborar-paa-button")).not.toBeInTheDocument();
  });

  it("desabilita o botão enquanto processa", () => {
    render(<SecaoPeriodoElaboracaoPaa secaoPeriodo={secao("VIGENTE")} processando onAcao={jest.fn()} />);

    expect(screen.getByTestId("elaborar-paa-button")).toBeDisabled();
  });
});
