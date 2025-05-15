import { render, screen } from "@testing-library/react";
import { Steps } from "../../components/Steps";

describe("Steps component", () => {
  const stepList = [{ label: "Início" }, { label: "Meio" }, { label: "Fim" }];

  it("exibe todos os rótulos dos passos", () => {
    render(<Steps currentStep={2} stepList={stepList} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Meio")).toBeInTheDocument();
    expect(screen.getByText("Fim")).toBeInTheDocument();
  });

  it("destaca a etapa atual com a classe 'circulo-ativo'", () => {
    render(<Steps currentStep={2} stepList={stepList} />);

    const currentStepCircle = screen.getByText("2");
    expect(currentStepCircle).toHaveClass("circulo-ativo");
  });

  it("marca as etapas futuras como inativas", () => {
    render(<Steps currentStep={1} stepList={stepList} />);

    const futureStepLabel = screen.getByText("Meio");
    const paragrafo = futureStepLabel.closest("p");
    expect(paragrafo).toHaveClass("texto-inativo");

    const futureStepLabel2 = screen.getByText("Fim");
    const paragrafo2 = futureStepLabel2.closest("p");
    expect(paragrafo2).toHaveClass("texto-inativo");
  });

  it("não marca etapas anteriores como inativas", () => {
    render(<Steps currentStep={3} stepList={stepList} />);

    const previousStepLabel = screen.getByText("Meio");
    expect(previousStepLabel).not.toHaveClass("texto-inativo");
  });
});
