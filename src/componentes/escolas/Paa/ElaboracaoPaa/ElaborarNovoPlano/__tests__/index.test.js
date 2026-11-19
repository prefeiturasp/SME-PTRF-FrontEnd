import { render, screen } from "@testing-library/react";
import { ElaborarNovoPlanoNovo as ElaborarNovoPlano } from "../index_novo";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { getPaaAtivoUuid } from "../../../../../../utils/paaAtivoStorage";

import { useGetPaa } from "../../../componentes/hooks/useGetPaa";
import { visoesService } from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: { featureFlagAtiva: jest.fn() },
}));

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
    sessionStorage.clear();
    visoesService.featureFlagAtiva.mockReturnValue(true);
    useGetPaa.mockReturnValue({ data: defaultPaa, refetch: mockRefetch, isFetching: false });
  });

  const renderComponent = (uuid = "paa-uuid-123") =>
    render(
      <MemoryRouter initialEntries={[`/elaborar-novo-paa/${uuid}`]}>
        <Routes>
          <Route path="/elaborar-novo-paa/:uuid_paa" element={<ElaborarNovoPlano />} />
        <Route path="/paa" element={<div data-testid="escolha-do-paa" />} />
        </Routes>
      </MemoryRouter>,
    );

  describe("PAA da rota", () => {
    it("carrega o PAA pelo uuid da rota", () => {
      renderComponent("paa-uuid-123");
      expect(useGetPaa).toHaveBeenCalledWith("paa-uuid-123");
    });

    it("torna o PAA da rota o ativo da aba antes de exibir as telas", () => {
      sessionStorage.setItem("PAA", "outro-paa");
      renderComponent();
      expect(getPaaAtivoUuid()).toBe("paa-uuid-123");
      expect(screen.getByTestId("paa-base")).toBeInTheDocument();
    });

    it("não exibe o PAA anterior ainda em cache enquanto o da rota carrega", () => {
      useGetPaa.mockReturnValue({ data: { ...defaultPaa, uuid: "outro-paa" }, refetch: mockRefetch, isFetching: true });
      sessionStorage.setItem("PAA", "outro-paa");
      renderComponent("paa-uuid-123");
      expect(screen.queryByTestId("paa-base")).not.toBeInTheDocument();
      expect(getPaaAtivoUuid()).toBe("outro-paa");
    });
  });

  describe("PAA inexistente ou sem acesso", () => {
    it("volta para a escolha do PAA quando o carregamento falha", () => {
      useGetPaa.mockReturnValue({ data: undefined, isError: true, refetch: mockRefetch, isFetching: false });
      renderComponent("uuid-inexistente");
      expect(screen.getByTestId("escolha-do-paa")).toBeInTheDocument();
      expect(screen.queryByTestId("paa-base")).not.toBeInTheDocument();
    });

    it("não redireciona quando o PAA carrega", () => {
      renderComponent();
      expect(screen.queryByTestId("escolha-do-paa")).not.toBeInTheDocument();
    });
  });

  describe("Renderização condicional", () => {
    it.each([[null], [undefined]])("não renderiza PaaBase quando paa é %s", (data) => {
      useGetPaa.mockReturnValue({ data, refetch: mockRefetch, isFetching: false });
      renderComponent();
      expect(screen.queryByTestId("paa-base")).not.toBeInTheDocument();
    });

    it("renderiza PaaBase quando o paa da rota está disponível", () => {
      renderComponent();
      expect(screen.getByTestId("paa-base")).toBeInTheDocument();
    });
  });

  describe("itemsBreadCrumb passados ao PaaBase", () => {
    it("passa os dois itens corretos de breadcrumb ao PaaBase", () => {
      renderComponent();
      const breadcrumb = JSON.parse(screen.getByTestId("paa-base").dataset.breadcrumb);
      expect(breadcrumb).toEqual([
        { label: "Plano Anual de Atividades", url: "/paa" },
        { label: "Elaborar novo plano", active: true },
      ]);
    });
  });

  describe("PaaContext fornecido ao PaaBase", () => {
    it("fornece o paa correto no contexto", () => {
      renderComponent();
      expect(screen.getByTestId("paa-base")).toHaveAttribute("data-paa-uuid", "paa-uuid-123");
    });

    it.each([[false], [true]])("fornece isFetching=%s no contexto", (isFetching) => {
      useGetPaa.mockReturnValue({ data: defaultPaa, refetch: mockRefetch, isFetching });
      renderComponent();
      expect(screen.getByTestId("paa-base")).toHaveAttribute("data-is-fetching", String(isFetching));
    });
  });
});
