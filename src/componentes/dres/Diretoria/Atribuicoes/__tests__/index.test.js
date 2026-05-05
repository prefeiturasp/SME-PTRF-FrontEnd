import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Atribuicoes } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ tecnico_uuid: undefined }),
}));

jest.mock("../../../../Globais/MenuInterno", () => ({
  MenuInterno: () => <div>MenuInterno</div>,
}));

jest.mock("../FormFiltros", () => ({
  Filtros: ({ enviarFiltrosAssociacao, limparFiltros }) => (
    <div>
      <button onClick={enviarFiltrosAssociacao}>Filtrar</button>
      <button onClick={limparFiltros}>Limpar</button>
    </div>
  ),
}));

jest.mock("../Modais", () => ({
  ModalAtribuir: ({ show, primeiroBotaoOnclick }) =>
    show ? (
      <div>
        <button onClick={primeiroBotaoOnclick}>Confirmar atribuição</button>
      </div>
    ) : null,
  ModalConfirmarRetiradaAtribuicoes: ({ show, primeiroBotaoOnclick }) =>
    show ? (
      <div>
        <button onClick={primeiroBotaoOnclick}>Confirmar retirada</button>
      </div>
    ) : null,
  ModalInformativoCopiaPeriodo: ({ show }) =>
    show ? <div>Modal cópia</div> : null,
}));

jest.mock("../../../../../utils/Loading", () => () => <div>Loading...</div>);

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: () => true,
  },
}));

jest.mock("../../../../../services/dres/Unidades.service", () => ({
  getUnidade: jest.fn(),
}));

jest.mock("../../../../../services/escolas/PrestacaoDeContas.service", () => ({
  getPeriodosNaoFuturos: jest.fn(),
}));

jest.mock("../../../../../services/dres/Atribuicoes.service", () => ({
  getUnidadesParaAtribuir: jest.fn(),
  filtrosUnidadesParaAtribuir: jest.fn(),
  atribuirTecnicos: jest.fn(),
  retirarAtribuicoes: jest.fn(),
  copiarPeriodo: jest.fn(),
}));

jest.mock("../../../../../services/dres/Associacoes.service", () => ({
  getTabelaAssociacoes: jest.fn(),
}));

jest.mock("../../../../../services/dres/TecnicosDre.service", () => ({
  getTecnicosDre: jest.fn(),
}));

const mockUnidades = [
  {
    uuid: "1",
    codigo_eol: "001",
    nome: "Unidade A",
    atribuicao: { id: "", tecnico: {} },
  },
  {
    uuid: "2",
    codigo_eol: "002",
    nome: "Unidade B",
    atribuicao: { id: "123", tecnico: { uuid: "tec1" } },
  },
];

const serviceAtribuicoes = require("../../../../../services/dres/Atribuicoes.service");
const serviceUnidades = require("../../../../../services/dres/Unidades.service");
const servicePeriodos = require("../../../../../services/escolas/PrestacaoDeContas.service");
const serviceAssociacoes = require("../../../../../services/dres/Associacoes.service");
const serviceTecnicos = require("../../../../../services/dres/TecnicosDre.service");

const setup = async () => {
  render(<Atribuicoes />);
  await screen.findByText("Unidade A");
};

beforeEach(() => {
  jest.clearAllMocks();

  serviceUnidades.getUnidade.mockResolvedValue({
    uuid: "dre1",
    nome: "DRE Teste",
  });

  servicePeriodos.getPeriodosNaoFuturos.mockResolvedValue([
    { uuid: "p1", referencia: "2024" },
    { uuid: "p2", referencia: "2023" },
  ]);

  serviceAtribuicoes.getUnidadesParaAtribuir.mockResolvedValue(mockUnidades);
  serviceAtribuicoes.filtrosUnidadesParaAtribuir.mockResolvedValue(mockUnidades);
  serviceAtribuicoes.atribuirTecnicos.mockResolvedValue({});
  serviceAtribuicoes.retirarAtribuicoes.mockResolvedValue({});
  serviceAtribuicoes.copiarPeriodo.mockResolvedValue({});

  serviceAssociacoes.getTabelaAssociacoes.mockResolvedValue({});
  serviceTecnicos.getTecnicosDre.mockResolvedValue([
    { uuid: "tec1", nome: "João Silva" },
  ]);
});

describe("Atribuicoes", () => {
  it("deve exibir loading enquanto carrega e não exibir após carregar", async () => {
    let resolvePromise;
    const promise = new Promise((res) => {
      resolvePromise = res;
    });

    serviceUnidades.getUnidade.mockReturnValue(promise);

    render(<Atribuicoes />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    resolvePromise({ uuid: "dre1", nome: "DRE Teste" });

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it("deve renderizar dados após carregamento", async () => {
    await setup();

    expect(screen.getByText(/Atribuições por unidade escolar/i)).toBeInTheDocument();
    expect(screen.getByText("Unidade A")).toBeInTheDocument();
    expect(screen.getByText("Unidade B")).toBeInTheDocument();
  });

  it("deve exibir quantidade de unidades", async () => {
    await setup();

    expect(screen.getByText(/Exibindo/i)).toHaveTextContent("2 unidades");
  });

  it("deve aplicar filtros", async () => {
    await setup();

    fireEvent.click(screen.getByText(/Filtrar/i));

    await waitFor(() => {
      expect(serviceAtribuicoes.filtrosUnidadesParaAtribuir).toHaveBeenCalled();
    });
  });

  it("deve limpar filtros", async () => {
    await setup();

    fireEvent.click(screen.getByText(/Limpar/i));

    await waitFor(() => {
      expect(serviceAtribuicoes.getUnidadesParaAtribuir).toHaveBeenCalled();
    });
  });

  it("deve exibir mensagem quando não há unidades", async () => {
    serviceAtribuicoes.getUnidadesParaAtribuir.mockResolvedValueOnce([]);

    render(<Atribuicoes />);

    await waitFor(() => {
      expect(
        screen.getByText(/Não encontramos nenhuma Unidade/i)
      ).toBeInTheDocument();
    });
  });
});