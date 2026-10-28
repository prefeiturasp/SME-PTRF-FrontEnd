import React from "react";
import { render, screen } from "@testing-library/react";
import { BarraDeStatus } from "../BarraDeStatus";

describe("BarraDeStatus", () => {
  it("renderiza texto e classe de cor", () => {
    const { container } = render(<BarraDeStatus statusBarraDeStatus={{ cor_idx: 3, status_txt: "Em análise" }} />);
    expect(screen.getByText("Em análise")).toBeInTheDocument();
    expect(container.querySelector(".barra-status-legenda-cor-3")).toBeInTheDocument();
  });

  it("renderiza texto vazio quando não há status_txt", () => {
    const { container } = render(<BarraDeStatus statusBarraDeStatus={{ cor_idx: 1 }} />);
    expect(container.querySelector("p.titulo-status").textContent).toBe("");
  });
});
