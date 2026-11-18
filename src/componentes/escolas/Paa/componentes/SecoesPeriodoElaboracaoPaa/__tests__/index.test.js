import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SecoesPeriodoElaboracaoPaa } from "..";

const botaoHabilitado = { acao: "ELABORAR_NOVO", visivel: true, habilitado: true, rotulo: "Elaborar novo PAA", mensagem: "" };
const botaoBloqueado = {
  acao: "CONTINUAR", visivel: true, habilitado: false, rotulo: "Continuar elaboração", mensagem: "Motivo do bloqueio",
};

const secao = (vigencia, botao) => ({
  periodoUuid: `periodo-${vigencia}`,
  referencia: "2027",
  vigencia,
  dataInicial: "2027-05-01",
  dataFinal: "2028-04-30",
  botao,
});

describe("SecoesPeriodoElaboracaoPaa", () => {
  it("não renderiza sem estado", () => {
    expect(render(<SecoesPeriodoElaboracaoPaa estado={null} />).container).toBeEmptyDOMElement();
  });

  it("mostra a mensagem geral quando não há seções", () => {
    render(<SecoesPeriodoElaboracaoPaa estado={{ secoesPeriodos: [], mensagem: "Sem período" }} />);

    expect(screen.getByTestId("sem-periodo-elaboracao")).toHaveTextContent("Sem período");
  });

  it("renderiza uma seção por período, cada uma com o próprio botão", () => {
    const onAcao = jest.fn();
    const estado = {
      secoesPeriodos: [secao("VIGENTE", botaoHabilitado), secao("PROXIMA_VIGENCIA", botaoBloqueado)],
      mensagem: "",
    };
    render(<SecoesPeriodoElaboracaoPaa estado={estado} processando={false} onAcao={onAcao} />);

    fireEvent.click(within(screen.getByTestId("secaoPeriodo-VIGENTE")).getByTestId("elaborar-paa-button"));

    expect(onAcao).toHaveBeenCalledTimes(1);
    expect(onAcao).toHaveBeenCalledWith(expect.objectContaining({ acao: "ELABORAR_NOVO" }));
    expect(within(screen.getByTestId("secaoPeriodo-PROXIMA_VIGENCIA")).getByTestId("elaborar-paa-button")).toBeDisabled();
  });

  it("mantém a ordem recebida", () => {
    const estado = {
      secoesPeriodos: [
        secao("ENCERRADO", botaoBloqueado), secao("VIGENTE", botaoHabilitado), secao("PROXIMA_VIGENCIA", botaoBloqueado),
      ],
      mensagem: "",
    };
    render(<SecoesPeriodoElaboracaoPaa estado={estado} onAcao={jest.fn()} />);

    const ordem = screen.getAllByTestId("vigencia-elaboracao").map((elemento) => elemento.textContent);

    expect(ordem).toEqual(["PAA Período encerrado", "PAA Vigente", "PAA Próxima vigência"]);
  });
});
