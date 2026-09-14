import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VinculoUnidades } from "./../index";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

let capturedUnidadesVinculadasProps = null;
let capturedVincularUnidadesProps = null;

jest.mock("../UnidadesVinculadas", () => ({
    UnidadesVinculadas: (props) => {
        capturedUnidadesVinculadasProps = props;
        return (
            <div data-testid="mock-unidades-vinculadas">
                {props.header}
            </div>
        );
    },
}));

jest.mock("../VincularUnidades", () => ({
    VincularUnidades: (props) => {
        capturedVincularUnidadesProps = props;
        return (
            <div data-testid="mock-vincular-unidades">
                {props.header}
            </div>
        );
    },
}));

export const renderWithQueryClient = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

const baseProps = {
  instanceUUID: "uuid-123",
  instanceLabel: "Recurso X",

  apiServiceGetUnidadesVinculadas: jest.fn(),
  apiServiceDesvincularUnidade: jest.fn(),
  apiServiceDesvincularUnidadeEmLote: jest.fn(),

  apiServiceGetUnidadesNaoVinculadas: jest.fn(),
  apiServiceVincularUnidade: jest.fn(),
  apiServiceVincularUnidadeEmLote: jest.fn(),
  apiServiceVincularTodasUnidades: jest.fn(),

  headerUnidadesVinculadas: <div data-testid="header-unidades-vinculadas" />,
  headerVincularUnidades: <div data-testid="header-vincular-unidades" />,

  onDesvincular: jest.fn(),
  onVincular: jest.fn(),
};

describe("VinculoUnidades", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedUnidadesVinculadasProps = null;
        capturedVincularUnidadesProps = null;
        window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));
    });

    it("renderiza UnidadesVinculadas e VincularUnidades", () => {
        renderWithQueryClient(<VinculoUnidades {...baseProps} />);

        expect(screen.getByTestId("header-unidades-vinculadas")).toBeInTheDocument();
        expect(screen.getByTestId("header-vincular-unidades")).toBeInTheDocument();
    });

    it("repassa os services, filtros extras e callbacks para os componentes filhos", () => {
        renderWithQueryClient(<VinculoUnidades {...baseProps} />);

        expect(capturedUnidadesVinculadasProps.apiServiceGetUnidadesVinculadas).toBe(baseProps.apiServiceGetUnidadesVinculadas);
        expect(capturedUnidadesVinculadasProps.apiServiceDesvincularUnidade).toBe(baseProps.apiServiceDesvincularUnidade);
        expect(capturedUnidadesVinculadasProps.apiServiceDesvincularUnidadeEmLote).toBe(baseProps.apiServiceDesvincularUnidadeEmLote);
        expect(capturedUnidadesVinculadasProps.apiServiceVincularTodasUnidades).toBe(baseProps.apiServiceVincularTodasUnidades);
        expect(capturedUnidadesVinculadasProps.exibirUnidadesVinculadas).toBe(true);
        expect(capturedUnidadesVinculadasProps.onDesvincular).toBe(baseProps.onDesvincular);

        expect(capturedVincularUnidadesProps.apiServiceGetUnidadesNaoVinculadas).toBe(baseProps.apiServiceGetUnidadesNaoVinculadas);
        expect(capturedVincularUnidadesProps.apiServiceVincularUnidade).toBe(baseProps.apiServiceVincularUnidade);
        expect(capturedVincularUnidadesProps.apiServiceVincularUnidadeEmLote).toBe(baseProps.apiServiceVincularUnidadeEmLote);
        expect(capturedVincularUnidadesProps.onVincular).toBe(baseProps.onVincular);
    });

    it("usa valores padrão quando filtros extras, headers e callbacks não são informados", () => {
        const {
            extraUnidadesVinculadasButtonFilters,
            extraVincularUnidadesButtonFilters,
            headerUnidadesVinculadas,
            headerVincularUnidades,
            onDesvincular,
            onVincular,
            ...propsSemOpcionais
        } = baseProps;

        renderWithQueryClient(<VinculoUnidades {...propsSemOpcionais} />);

        expect(capturedUnidadesVinculadasProps.extraButtonFilters).toBeNull();
        expect(capturedUnidadesVinculadasProps.header).toBeNull();
        expect(capturedVincularUnidadesProps.extraButtonFilters).toBeNull();
        expect(capturedVincularUnidadesProps.header).toBeNull();

        expect(() => capturedUnidadesVinculadasProps.onDesvincular()).not.toThrow();
        expect(() => capturedVincularUnidadesProps.onVincular()).not.toThrow();
    });

    it("lança erro se instanceUUID não for informado", () => {
        expect(() =>
          render(
              <VinculoUnidades
              {...baseProps}
              instanceUUID={null}
              />
          )
        ).toThrow("VinculoUnidades: instanceUUID não informado");
    });

    it("lança erro se instanceLabel não for informado", () => {
        expect(() =>
          renderWithQueryClient(
              <VinculoUnidades
              {...baseProps}
              instanceLabel=""
              />
          )
        ).toThrow("VinculoUnidades: instanceLabel não informado");
    });

    it("lança erro se apiServiceGetUnidadesVinculadas não for informado", () => {
        expect(() =>
          renderWithQueryClient(
              <VinculoUnidades
                  {...baseProps}
                  apiServiceGetUnidadesVinculadas={null}
              />
          )
        ).toThrow(
        "VinculoUnidades: Service API apiServiceGetUnidadesVinculadas não informado"
        );
    });

    it("lança erro se apiServiceDesvincularUnidade não for informado", () => {
        expect(() =>
          renderWithQueryClient(
              <VinculoUnidades
                  {...baseProps}
                  apiServiceDesvincularUnidade={null}
              />
          )
        ).toThrow(
        "VinculoUnidades: Service API apiServiceDesvincularUnidade não informado"
        );
    });

    it("lança erro se apiServiceDesvincularUnidadeEmLote não for informado", () => {
        expect(() =>
          renderWithQueryClient(
              <VinculoUnidades
                  {...baseProps}
                  apiServiceDesvincularUnidadeEmLote={null}
              />
          )
        ).toThrow(
        "VinculoUnidades: Service API apiServiceDesvincularUnidadeEmLote não informado"
        );
    });

    it("lança erro se apiServiceGetUnidadesNaoVinculadas não for informado", () => {
        expect(() =>
          renderWithQueryClient(
              <VinculoUnidades
                  {...baseProps}
                  apiServiceGetUnidadesNaoVinculadas={null}
              />
          )
        ).toThrow(
        "VinculoUnidades: Service API apiServiceGetUnidadesNaoVinculadas não informado"
        );
    });

    it("lança erro se apiServiceVincularUnidade não for informado", () => {
        expect(() =>
          renderWithQueryClient(
              <VinculoUnidades
                  {...baseProps}
                  apiServiceVincularUnidade={null}
              />
          )
        ).toThrow(
        "VinculoUnidades: Service API apiServiceVincularUnidade não informado"
        );
    });

    it("lança erro se apiServiceVincularUnidadeEmLote não for informado", () => {
        expect(() =>
          renderWithQueryClient(
              <VinculoUnidades
                  {...baseProps}
                  apiServiceVincularUnidadeEmLote={null}
              />
          )
        ).toThrow(
        "VinculoUnidades: Service API apiServiceVincularUnidadeEmLote não informado"
        );
    });

    it("lança erro se apiServiceVincularTodasUnidades não for informado", () => {
        expect(() =>
          renderWithQueryClient(
              <VinculoUnidades
                  {...baseProps}
                  apiServiceVincularTodasUnidades={null}
              />
          )
        ).toThrow(
        "VinculoUnidades: Service API apiServiceVincularTodasUnidades não informado"
        );
    });

});
