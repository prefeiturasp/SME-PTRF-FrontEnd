import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PaaBase from "../index";
import { ASSOCIACAO_UUID } from "../../../../../../services/auth.service";
import { PaaContext } from "../../PaaContext";

jest.mock("../../../../../../services/auth.service", () => ({
  ASSOCIACAO_UUID: "UUID",
}));

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
  PaginasContainer: ({ children }) => (
    <div data-testid="paginas-container">{children}</div>
  ),
}));

jest.mock("../ConteudoBase", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="conteudo-base" data-props={JSON.stringify(props)}>
      ConteudoBase
    </div>
  ),
}));

const ASSOCIACAO_UUID_VALUE = "assoc-uuid-123";

const renderPaaBase = (paaOverride = null, extraProps = {}) => {
  const paa = paaOverride;

  return render(
    <MemoryRouter>
      <PaaContext.Provider value={{ paa, refetch: jest.fn() }}>
        <PaaBase {...extraProps} />
      </PaaContext.Provider>
    </MemoryRouter>,
  );
};

describe("PaaBase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem(ASSOCIACAO_UUID, ASSOCIACAO_UUID_VALUE);
  });

  describe("Renderização básica", () => {
    it("renderiza PaginasContainer", () => {
      renderPaaBase({ associacao: ASSOCIACAO_UUID_VALUE, uuid: "paa-uuid" });

      expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    });

    it("renderiza ConteudoBase quando paa existe e associacao coincide com localStorage", () => {
      renderPaaBase({ associacao: ASSOCIACAO_UUID_VALUE, uuid: "paa-uuid" });

      expect(screen.getByTestId("conteudo-base")).toBeInTheDocument();
    });

    it("não renderiza ConteudoBase quando paa é null", () => {
      renderPaaBase(null);

      expect(screen.queryByTestId("conteudo-base")).not.toBeInTheDocument();
    });

    it("não renderiza ConteudoBase quando paa.associacao não coincide com UUID do localStorage", () => {
      renderPaaBase({ associacao: "outro-uuid", uuid: "paa-uuid" });

      expect(screen.queryByTestId("conteudo-base")).not.toBeInTheDocument();
    });
  });

  describe("Passagem de props para ConteudoBase", () => {
    it("repassa props extras para ConteudoBase via spread", () => {
      const itemsBreadCrumb = [{ label: "Início" }, { label: "PAA" }];
      renderPaaBase({ associacao: ASSOCIACAO_UUID_VALUE, uuid: "paa-uuid" }, { itemsBreadCrumb });

      const conteudo = screen.getByTestId("conteudo-base");
      const receivedProps = JSON.parse(conteudo.getAttribute("data-props"));
      expect(receivedProps.itemsBreadCrumb).toEqual(itemsBreadCrumb);
    });
  });

  describe("Validação da associacao", () => {
    it("renderiza ConteudoBase quando associacao do paa coincide exatamente com localStorage", () => {
      localStorage.setItem(ASSOCIACAO_UUID, "uuid-especifico");
      renderPaaBase({ associacao: "uuid-especifico", uuid: "paa-uuid" });

      expect(screen.getByTestId("conteudo-base")).toBeInTheDocument();
    });

    it("não renderiza ConteudoBase quando localStorage não tem UUID da associacao", () => {
      localStorage.removeItem(ASSOCIACAO_UUID);
      renderPaaBase({ associacao: ASSOCIACAO_UUID_VALUE, uuid: "paa-uuid" });

      expect(screen.queryByTestId("conteudo-base")).not.toBeInTheDocument();
    });

    it("não renderiza ConteudoBase quando paa é undefined", () => {
      renderPaaBase(undefined);

      expect(screen.queryByTestId("conteudo-base")).not.toBeInTheDocument();
    });
  });
});
