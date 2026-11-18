import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RedirecionarParaPaaAtivo } from "..";
import { visoesService } from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: { featureFlagAtiva: jest.fn() },
}));

const renderiza = () =>
  render(
    <MemoryRouter initialEntries={["/elaborar-novo-paa"]}>
      <Routes>
        <Route path="/elaborar-novo-paa" element={<RedirecionarParaPaaAtivo />} />
        <Route path="/elaborar-novo-paa/:uuid_paa" element={<div>elaboracao do PAA</div>} />
        <Route path="/paa" element={<div>escolha do PAA</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("RedirecionarParaPaaAtivo", () => {
  beforeEach(() => {
    sessionStorage.clear();
    visoesService.featureFlagAtiva.mockReturnValue(true);
  });

  it("leva ao PAA ativo da aba", () => {
    sessionStorage.setItem("PAA", "paa-1");
    renderiza();
    expect(screen.getByText("elaboracao do PAA")).toBeInTheDocument();
  });

  it("sem PAA ativo, leva à escolha do PAA", () => {
    renderiza();
    expect(screen.getByText("escolha do PAA")).toBeInTheDocument();
  });
});
