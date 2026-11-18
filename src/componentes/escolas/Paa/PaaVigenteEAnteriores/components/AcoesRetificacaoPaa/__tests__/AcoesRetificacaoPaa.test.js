import React from "react";
import { render, screen } from "@testing-library/react";
import { AcoesRetificacaoPaa } from "../index";

let mockFlagRetificacao = true;

jest.mock("../../../../../../../services/visoes.service", () => ({
  visoesService: {
    featureFlagAtiva: (nome) => (nome === "paa-retificacao" ? mockFlagRetificacao : false),
    getPermissoes: () => true,
  },
}));

jest.mock("../../BotaoRetificarPaa/BotaoRetificarPaa", () => ({
  BotaoRetificarPaa: ({ paa, statusDocumento }) => (
    <button
      type="button"
      data-testid="retificar"
      data-uuid={paa.uuid}
      data-status={paa.status}
      data-mensagem={statusDocumento ? statusDocumento.mensagem : "sem-status"}
    />
  ),
}));

jest.mock("../../../../componentes/CancelarRetificacao", () => ({
  __esModule: true,
  default: ({ paa, outlined }) => (
    <button type="button" data-testid="cancelar" data-uuid={paa.uuid} data-status={paa.status} data-outlined={String(outlined)} />
  ),
}));

const dados = (sobrescrever = {}) => ({
  uuid: "paa-1",
  pode_retificar: true,
  esta_em_retificacao: false,
  ciclo_retificacao_sem_documento: false,
  original: { documento: { status: { mensagem: "Documento gerado" } } },
  ...sobrescrever,
});

describe("AcoesRetificacaoPaa", () => {
  beforeEach(() => {
    mockFlagRetificacao = true;
  });

  it("não renderiza nada sem dados", () => {
    const { container } = render(<AcoesRetificacaoPaa />);

    expect(container).toBeEmptyDOMElement();
  });

  it("não renderiza nada quando o PAA não pode ser retificado", () => {
    const { container } = render(<AcoesRetificacaoPaa dados={dados({ pode_retificar: false })} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("não renderiza nada com a flag de retificação desligada", () => {
    mockFlagRetificacao = false;
    const { container } = render(<AcoesRetificacaoPaa dados={dados()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("PAA retificável: trata como GERADO e repassa uuid e mensagem do documento", () => {
    render(<AcoesRetificacaoPaa dados={dados()} />);

    const botao = screen.getByTestId("retificar");
    expect(botao).toHaveAttribute("data-uuid", "paa-1");
    expect(botao).toHaveAttribute("data-status", "GERADO");
    expect(botao).toHaveAttribute("data-mensagem", "Documento gerado");
  });

  it("renderiza o cancelamento no modo outlined com o mesmo PAA", () => {
    render(<AcoesRetificacaoPaa dados={dados()} />);

    const cancelar = screen.getByTestId("cancelar");
    expect(cancelar).toHaveAttribute("data-uuid", "paa-1");
    expect(cancelar).toHaveAttribute("data-outlined", "true");
  });

  it("em retificação com ciclo sem documento: trata como EM_RETIFICACAO", () => {
    render(
      <AcoesRetificacaoPaa
        dados={dados({ pode_retificar: false, esta_em_retificacao: true, ciclo_retificacao_sem_documento: true })}
      />
    );

    expect(screen.getByTestId("retificar")).toHaveAttribute("data-status", "EM_RETIFICACAO");
    expect(screen.getByTestId("cancelar")).toHaveAttribute("data-status", "EM_RETIFICACAO");
  });

  it("em retificação com documento do ciclo já gerado e sem pode_retificar: não renderiza", () => {
    const { container } = render(
      <AcoesRetificacaoPaa
        dados={dados({ pode_retificar: false, esta_em_retificacao: true, ciclo_retificacao_sem_documento: false })}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("sem status do documento original, não repassa statusDocumento", () => {
    render(<AcoesRetificacaoPaa dados={dados({ original: { documento: {} } })} />);

    expect(screen.getByTestId("retificar")).toHaveAttribute("data-mensagem", "sem-status");
  });
});
