import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RetificacoesAnteriores from "../RetificacoesAnteriores";

const retificacoes = [
  {
    secao_titulo: "Retificação 1",
    documento: { mensagem: "Plano gerado em 01/01/2026", cor_mensagem: "green" },
    ata: { mensagem: "Ata não gerada", cor_mensagem: "red", resumo_assembleia: "Resumo da retificação 1" },
  },
  {
    secao_titulo: "Retificação 2",
    documento: { mensagem: "Plano em processamento", cor_mensagem: "orange" },
    ata: { mensagem: "Ata gerada", cor_mensagem: "cor-desconhecida", resumo_assembleia: "Resumo da retificação 2" },
  },
];

describe("RetificacoesAnteriores", () => {
  it("não renderiza nada sem retificações", () => {
    const { container } = render(<RetificacoesAnteriores retificacoesAnteriores={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("não renderiza nada quando a prop é omitida ou nula", () => {
    const { container, rerender } = render(<RetificacoesAnteriores />);
    expect(container).toBeEmptyDOMElement();

    rerender(<RetificacoesAnteriores retificacoesAnteriores={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("mostra a barra de título recolhida por padrão", () => {
    render(<RetificacoesAnteriores retificacoesAnteriores={retificacoes} />);

    expect(screen.getByText("PAA Retificações anteriores")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Retificação 1")).not.toBeInTheDocument();
  });

  it("expande e recolhe a lista ao acionar o botão", async () => {
    render(<RetificacoesAnteriores retificacoesAnteriores={retificacoes} />);

    await userEvent.click(screen.getByRole("button", { name: "Abrir" }));

    expect(screen.getByText("Retificação 1")).toBeInTheDocument();
    expect(screen.getByText("Retificação 2")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(screen.queryByText("Retificação 1")).not.toBeInTheDocument();
  });

  it("exibe mensagens do plano, da ata e o resumo de cada retificação", async () => {
    render(<RetificacoesAnteriores retificacoesAnteriores={retificacoes} />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir" }));

    expect(screen.getAllByText("Plano Anual")).toHaveLength(2);
    expect(screen.getAllByText("Ata de retificaçao do PAA")).toHaveLength(2);
    expect(screen.getByText("Plano gerado em 01/01/2026")).toBeInTheDocument();
    expect(screen.getByText("Ata não gerada")).toBeInTheDocument();
    expect(screen.getByText("Resumo da retificação 1")).toBeInTheDocument();
    expect(screen.getByText("Resumo da retificação 2")).toBeInTheDocument();
  });

  it("aplica a cor conforme o mapa e usa cinza para cor desconhecida", async () => {
    render(<RetificacoesAnteriores retificacoesAnteriores={retificacoes} />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir" }));

    expect(screen.getByText("Plano gerado em 01/01/2026")).toHaveStyle({ color: "#0F7A6C" });
    expect(screen.getByText("Ata não gerada")).toHaveStyle({ color: "#C22D2D" });
    expect(screen.getByText("Plano em processamento")).toHaveStyle({ color: "#D06D12" });
    expect(screen.getByText("Ata gerada")).toHaveStyle({ color: "#60686A" });
  });

  it("tolera retificação sem documento e sem ata", async () => {
    render(<RetificacoesAnteriores retificacoesAnteriores={[{ secao_titulo: "Retificação vazia" }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir" }));

    expect(screen.getByText("Retificação vazia")).toBeInTheDocument();
  });
});
