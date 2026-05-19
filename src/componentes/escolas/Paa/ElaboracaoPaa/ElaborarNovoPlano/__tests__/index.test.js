import { render, screen } from "@testing-library/react";
import { ElaborarNovoPlano } from "../index";
import { MemoryRouter } from "react-router-dom";
import { useGetPaa } from "../../../componentes/hooks/useGetPaa";

jest.mock("../../../componentes/hooks/useGetPaa", () => ({
  useGetPaa: jest.fn(),
}));

jest.mock("../../../componentes/PaaBase", () => {
  const { usePaaContext } = require("../../../componentes/PaaContext");
  return {
    __esModule: true,
    default: function MockPaaBase({ itemsBreadCrumb }) {
      const { paa, isFetching } = usePaaContext();
      return (
        <div
          data-testid="paa-base"
          data-paa-uuid={paa?.uuid}
          data-is-fetching={String(isFetching)}
          data-breadcrumb={JSON.stringify(itemsBreadCrumb)}
        />
      );
    },
  };
});

const defaultPaa = {
  uuid: "paa-uuid-123",
  status: "EM_ELABORACAO",
  associacao: "assoc-uuid-123",
};

const mockRefetch = jest.fn();

describe("ElaborarNovoPlano", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("PAA", "paa-uuid-123");
    localStorage.setItem("UUID", "assoc-uuid-123");
    useGetPaa.mockReturnValue({
      data: defaultPaa,
      refetch: mockRefetch,
      isFetching: false,
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <ElaborarNovoPlano />
      </MemoryRouter>,
    );

  describe("Chamada ao useGetPaa", () => {
    it("chama useGetPaa com o uuid do PAA do localStorage", () => {
      renderComponent();
      expect(useGetPaa).toHaveBeenCalledWith("paa-uuid-123");
    });

    it("chama useGetPaa com null quando PAA não está no localStorage", () => {
      localStorage.removeItem("PAA");
      renderComponent();
      expect(useGetPaa).toHaveBeenCalledWith(null);
    });
  });

  describe("Renderização condicional", () => {
    it("não renderiza PaaBase quando paa é null", () => {
      useGetPaa.mockReturnValue({ data: null, refetch: mockRefetch, isFetching: false });
      renderComponent();
      expect(screen.queryByTestId("paa-base")).not.toBeInTheDocument();
    });

    it("não renderiza PaaBase quando paa é undefined", () => {
      useGetPaa.mockReturnValue({ data: undefined, refetch: mockRefetch, isFetching: false });
      renderComponent();
      expect(screen.queryByTestId("paa-base")).not.toBeInTheDocument();
    });

    it("renderiza PaaBase quando paa está disponível", () => {
      renderComponent();
      expect(screen.getByTestId("paa-base")).toBeInTheDocument();
    });
  });

  describe("itemsBreadCrumb passados ao PaaBase", () => {
    it("passa os dois itens corretos de breadcrumb ao PaaBase", () => {
      renderComponent();
      const breadcrumb = JSON.parse(
        screen.getByTestId("paa-base").dataset.breadcrumb,
      );
      expect(breadcrumb).toEqual([
        { label: "Plano Anual de Atividades", url: "/paa" },
        { label: "Elaborar novo plano", active: true },
      ]);
    });
  });

  describe("PaaContext fornecido ao PaaBase", () => {
    it("fornece o paa correto no contexto", () => {
      renderComponent();
      expect(screen.getByTestId("paa-base")).toHaveAttribute(
        "data-paa-uuid",
        "paa-uuid-123",
      );
    });

    it("fornece isFetching=false no contexto quando não está carregando", () => {
      renderComponent();
      expect(screen.getByTestId("paa-base")).toHaveAttribute(
        "data-is-fetching",
        "false",
      );
    });

    it("fornece isFetching=true no contexto quando está carregando", () => {
      useGetPaa.mockReturnValue({ data: defaultPaa, refetch: mockRefetch, isFetching: true });
      renderComponent();
      expect(screen.getByTestId("paa-base")).toHaveAttribute(
        "data-is-fetching",
        "true",
      );
    });
  });
});
