import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Formik } from "formik";
import { MemoryRouter } from "react-router-dom";
import { RateiosSection } from "../RateiosSection";
import { DespesaFormPipelineProvider } from "../../context/DespesaFormPipelineContext";
import * as visoesServiceModule from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service");


jest.mock("../../../../../../services/auth.service", () => ({
  ASSOCIACAO_UUID: "associacao_uuid",
}));

jest.mock("../../../Tags", () => ({
  Tags: () => <div data-testid="tags" />,
}));

jest.mock("../../rateios/RateioCusteio", () => ({
  RateioCusteio: () => <div data-testid="rateio-custeio" />,
}));

jest.mock("../../rateios/RateioCapital", () => ({
  RateioCapital: () => <div data-testid="rateio-capital" />,
}));

jest.mock("../../modals/ModalDeletarRateioComEstorno", () => ({
  ModalDeletarRateioComEstorno: () => <div data-testid="modal-deletar-rateio-com-estorno" />,
}));

jest.mock("../../modals/ExibeMotivosPagamentoAntecipadoNoForm", () => () => (
  <div data-testid="exibe-motivos-pagamento-antecipado" />
));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="font-awesome-icon" />,
}));

jest.mock("@fortawesome/free-solid-svg-icons", () => ({
  faTimesCircle: { iconName: "times-circle" },
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(visoesServiceModule.visoesService, "getPermissoes").mockReturnValue(true);
  jest.spyOn(visoesServiceModule.visoesService, "featureFlagAtiva").mockReturnValue(false);
});

const createMockAux = (overrides = {}) => ({
  origemAnaliseLancamento: jest.fn(() => false),
  setaValoresCusteioCapital: jest.fn(),
  limpaTipoDespesaCusteio: jest.fn(),
  limpaCamposExclusivosAplicacaoRecurso: jest.fn(),
  handleAvisoCapital: jest.fn(),
  ...overrides,
});

const mockInitialValues = () => ({
  mais_de_um_tipo_despesa: "nao",
  despesa_anterior_ao_uso_do_sistema_editavel: true,
  rateios: [
    {
      aplicacao_recurso: "CUSTEIO",
      quantidade_itens_capital: "",
      valor_item_capital: "",
    },
  ],
});

const renderComponent = ({ aux = createMockAux(), initialValues = mockInitialValues() } = {}) => {
  const tabelas = {
    despesaContext: { verboHttp: "POST" },
    despesasTabelas: {
      tipos_aplicacao_recurso: [
        { id: "CUSTEIO", nome: "Custeio" },
        { id: "CAPITAL", nome: "Capital" },
      ],
    },
    aux,
    parametroLocation: {},
    veioDeSituacaoPatrimonial: false,
  };

  const ui = {
    readOnlyCampos: false,
    setShowAvisoCapital: jest.fn(),
    showDeletarRateioComEstorno: false,
    setShowDeletarRateioComEstorno: jest.fn(),
    bloqueiaLinkCadastrarEstorno: jest.fn(() => false),
    bloqueiaRateioEstornado: jest.fn(() => false),
    bloqueiaCamposDespesa: jest.fn(() => false),
  };

  const fluxo = {
    removeRateio: jest.fn(),
  };

  return render(
    <MemoryRouter>
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <DespesaFormPipelineProvider tabelas={tabelas} ui={ui} fluxo={fluxo}>
          <RateiosSection />
        </DespesaFormPipelineProvider>
      </Formik>
    </MemoryRouter>
  );
};

describe("RateiosSection - limpaCamposExclusivosAplicacaoRecurso", () => {
  it("chama limpaCamposExclusivosAplicacaoRecurso com o novo valor ao alterar o tipo de aplicação do recurso", () => {
    const mockAux = createMockAux();
    renderComponent({ aux: mockAux });

    const select = screen.getByLabelText("Tipo de aplicação do recurso");
    fireEvent.change(select, { target: { value: "CAPITAL" } });

    expect(mockAux.limpaCamposExclusivosAplicacaoRecurso).toHaveBeenCalledWith(
      expect.any(Function),
      0,
      "CAPITAL"
    );
  });

  it("também aciona limpaTipoDespesaCusteio e handleAvisoCapital na mesma troca", () => {
    const mockAux = createMockAux();
    renderComponent({ aux: mockAux });

    const select = screen.getByLabelText("Tipo de aplicação do recurso");
    fireEvent.change(select, { target: { value: "CUSTEIO" } });

    expect(mockAux.limpaTipoDespesaCusteio).toHaveBeenCalled();
    expect(mockAux.handleAvisoCapital).toHaveBeenCalledWith("CUSTEIO", expect.any(Function));
  });
});
