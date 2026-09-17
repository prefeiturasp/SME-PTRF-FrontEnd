import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Atribuicoes } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(() => ({ tecnico_uuid: undefined })),
}));

jest.mock("../../../../Globais/MenuInterno", () => ({
  MenuInterno: () => <div>MenuInterno</div>,
}));

jest.mock("../FormFiltros", () => ({
  Filtros: ({ enviarFiltrosAssociacao, limparFiltros, mudancasFiltros }) => (
    <div>
      <button onClick={enviarFiltrosAssociacao}>Filtrar</button>
      <button onClick={limparFiltros}>Limpar</button>
      <button onClick={() => mudancasFiltros("filtrar_por_termo", "abc")}>
        Mudar filtro
      </button>
    </div>
  ),
}));

jest.mock("../Modais", () => ({
  ModalAtribuir: ({ show, primeiroBotaoOnclick, onHide, tecnico, tecnicosList, selecionarTecnico }) =>
    show ? (
      <div>
        <select
          data-testid="select-tecnico"
          value={tecnico}
          onChange={(e) => selecionarTecnico(e.target.value)}
        >
          <option value="">Selecione</option>
          {tecnicosList.map((t) => (
            <option key={t.uuid} value={t.uuid}>
              {t.nome}
            </option>
          ))}
        </select>
        <button onClick={primeiroBotaoOnclick}>Confirmar atribuição</button>
        <button onClick={onHide}>Fechar modal atribuir</button>
      </div>
    ) : null,
  ModalConfirmarRetiradaAtribuicoes: ({ show, primeiroBotaoOnclick, onHide }) =>
    show ? (
      <div>
        <button onClick={primeiroBotaoOnclick}>Confirmar retirada</button>
        <button onClick={onHide}>Fechar modal retirada</button>
      </div>
    ) : null,
  ModalInformativoCopiaPeriodo: ({ show, onHide }) =>
    show ? (
      <div>
        Modal cópia
        <button onClick={onHide}>Fechar modal cópia</button>
      </div>
    ) : null,
}));

jest.mock("../../../../../utils/Loading", () => () => <div>Loading...</div>);

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(() => true),
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

const { useParams } = require("react-router-dom");

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
const { visoesService } = require("../../../../../services/visoes.service");

const setup = async () => {
  render(<Atribuicoes />);
  await screen.findByText("Unidade A");
};

beforeEach(() => {
  jest.clearAllMocks();
  useParams.mockReturnValue({ tecnico_uuid: undefined });
  visoesService.getPermissoes.mockReturnValue(true);

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
    { uuid: "tec2", nome: "Maria" },
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

  it("deve aplicar filtro pelo técnico da URL ao montar a página", async () => {
    useParams.mockReturnValue({ tecnico_uuid: "tec1" });
    serviceAtribuicoes.filtrosUnidadesParaAtribuir.mockResolvedValue([mockUnidades[1]]);

    render(<Atribuicoes />);

    await waitFor(() => {
      expect(serviceAtribuicoes.filtrosUnidadesParaAtribuir).toHaveBeenCalledWith(
        "dre1",
        "p1",
        "",
        "",
        "",
        "tec1"
      );
    });

    expect(await screen.findByText("Unidade B")).toBeInTheDocument();
  });

  it("deve chamar mudancasFiltros ao alterar um filtro", async () => {
    await setup();

    fireEvent.click(screen.getByText("Mudar filtro"));

    fireEvent.click(screen.getByText(/Filtrar/i));

    await waitFor(() => {
      expect(serviceAtribuicoes.filtrosUnidadesParaAtribuir).toHaveBeenCalledWith(
        "dre1",
        "p1",
        "",
        "abc",
        "",
        ""
      );
    });
  });

  it("deve buscar novas unidades ao trocar o período selecionado", async () => {
    await setup();

    fireEvent.change(screen.getByLabelText ? document.getElementById("periodo") : document.getElementById("periodo"), {
      target: { value: "p2" },
    });

    await waitFor(() => {
      expect(serviceAtribuicoes.getUnidadesParaAtribuir).toHaveBeenCalledWith("dre1", "p2");
    });
  });

  it("deve exibir e ocultar o formulário de cópia de período ao alternar sim/não", async () => {
    await setup();

    fireEvent.click(document.getElementById("sim"));
    expect(document.getElementById("periodoacopiar")).toBeInTheDocument();

    fireEvent.click(document.getElementById("nao"));
    expect(document.getElementById("periodoacopiar")).not.toBeInTheDocument();
  });

  it("deve alterar o período a copiar selecionado", async () => {
    await setup();

    fireEvent.click(document.getElementById("sim"));
    const selectPeriodoACopiar = document.getElementById("periodoacopiar");

    fireEvent.change(selectPeriodoACopiar, { target: { value: "p2" } });

    expect(selectPeriodoACopiar.value).toBe("p2");
  });

  it("deve copiar as atribuições do período com sucesso e exibir o modal informativo", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await setup();

    fireEvent.click(document.getElementById("sim"));
    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(serviceAtribuicoes.copiarPeriodo).toHaveBeenCalledWith({
        periodo_atual: "p1",
        periodo_copiado: "p2",
        dre_uuid: "dre1",
      });
    });

    expect(await screen.findByText("Modal cópia")).toBeInTheDocument();
    expect(consoleLogSpy).toHaveBeenCalledWith("Período copiado com sucesso!");

    fireEvent.click(screen.getByText("Fechar modal cópia"));
    expect(screen.queryByText("Modal cópia")).not.toBeInTheDocument();

    consoleLogSpy.mockRestore();
  });

  it("deve logar o erro quando a cópia de período falhar", async () => {
    const erro = new Error("Falha ao copiar");
    serviceAtribuicoes.copiarPeriodo.mockRejectedValue(erro);
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await setup();

    fireEvent.click(document.getElementById("sim"));
    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith("Erro ao copiar período");
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(erro);

    consoleLogSpy.mockRestore();
  });

  it("deve selecionar e desmarcar todas as unidades pelo menu do cabeçalho", async () => {
    await setup();

    fireEvent.click(document.getElementById("dropdown-basic"));
    fireEvent.click(screen.getByText("Selecionar todos"));

    expect(screen.getByText(/unidades selecionadas/i)).toHaveTextContent("2 unidades selecionadas");

    fireEvent.click(document.getElementById("dropdown-basic"));
    fireEvent.click(screen.getByText("Desmarcar todos"));

    expect(screen.getByText(/Exibindo/i)).toHaveTextContent("2 unidades");
  });

  it("deve selecionar apenas as unidades sem atribuição pelo menu do cabeçalho", async () => {
    await setup();

    fireEvent.click(document.getElementById("dropdown-basic"));
    fireEvent.click(screen.getByText("Selecionar apenas UEs sem atribuição"));

    expect(screen.getByText(/unidade selecionada/i)).toHaveTextContent("1 unidade selecionada");
  });

  it("deve marcar e desmarcar uma unidade individualmente pelo checkbox da linha", async () => {
    await setup();

    const checkboxes = document.querySelectorAll('input[name="checkAtribuido"]');
    fireEvent.click(checkboxes[0]);

    expect(screen.getByText(/unidade selecionada/i)).toHaveTextContent("1 unidade selecionada");
    expect(checkboxes[0]).toBeChecked();

    fireEvent.click(checkboxes[0]);
    expect(screen.getByText(/Exibindo/i)).toHaveTextContent("2 unidades");
  });

  it("deve exibir alerta e não alterar seleção quando o toast de desfazer está aberto", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    await setup();

    fireEvent.click(document.querySelectorAll('input[name="checkAtribuido"]')[0]);

    fireEvent.click(screen.getByText("Atribuir a um técnico"));
    fireEvent.change(screen.getByTestId("select-tecnico"), { target: { value: "tec1" } });
    fireEvent.click(screen.getByText("Confirmar atribuição"));

    await screen.findByText(/Unidades escolares atribuidas/i);

    const checkboxesAposAtribuir = document.querySelectorAll('input[name="checkAtribuido"]');
    fireEvent.click(checkboxesAposAtribuir[1]);

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining("Desfazer")
    );

    alertSpy.mockRestore();
  });

  it("não propaga o evento de clique no checkbox do cabeçalho do dropdown", async () => {
    await setup();

    expect(() =>
      fireEvent.click(document.getElementById("checkHeader"))
    ).not.toThrow();
  });

  it("deve fechar o toast de atribuição ao clicar no botão de fechar", async () => {
    await setup();

    fireEvent.click(document.querySelectorAll('input[name="checkAtribuido"]')[0]);
    fireEvent.click(screen.getByText("Atribuir a um técnico"));
    fireEvent.change(screen.getByTestId("select-tecnico"), { target: { value: "tec1" } });
    fireEvent.click(screen.getByText("Confirmar atribuição"));

    await screen.findByText(/Unidades escolares atribuidas/i);

    fireEvent.click(screen.getByLabelText("Close"));

    await waitFor(() => {
      expect(screen.queryByText(/Unidades escolares atribuidas/i)).not.toBeInTheDocument();
    });
  });

  it("deve atribuir um técnico com sucesso, exibir o toast e permitir desfazer", async () => {
    await setup();

    fireEvent.click(document.getElementById("dropdown-basic"));
    fireEvent.click(screen.getByText("Selecionar todos"));

    fireEvent.click(screen.getByText("Atribuir a um técnico"));
    fireEvent.change(screen.getByTestId("select-tecnico"), { target: { value: "tec1" } });
    fireEvent.click(screen.getByText("Confirmar atribuição"));

    await waitFor(() => {
      expect(serviceAtribuicoes.atribuirTecnicos).toHaveBeenCalledWith({
        periodo: "p1",
        tecnico: "tec1",
        unidades: [{ uuid: "1" }, { uuid: "2" }],
      });
    });

    expect(
      await screen.findByText(/Unidades escolares atribuidas para "João Silva"/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Desfazer"));

    await waitFor(() => {
      expect(serviceAtribuicoes.atribuirTecnicos).toHaveBeenCalledWith({
        periodo: "p1",
        tecnico: "tec1",
        unidades: [{ uuid: "2" }],
      });
    });

    await waitFor(() => {
      expect(serviceAtribuicoes.retirarAtribuicoes).toHaveBeenCalledWith({
        periodo: "p1",
        unidades: [{ uuid: "1" }],
      });
    });
  });

  it("deve exibir o nome completo do técnico de nome único no toast", async () => {
    await setup();

    const checkboxes = document.querySelectorAll('input[name="checkAtribuido"]');
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByText("Atribuir a um técnico"));
    fireEvent.change(screen.getByTestId("select-tecnico"), { target: { value: "tec2" } });
    fireEvent.click(screen.getByText("Confirmar atribuição"));

    expect(
      await screen.findByText(/Unidades escolares atribuidas para "Maria"/i)
    ).toBeInTheDocument();
  });

  it("deve fechar o modal de atribuir ao clicar em fechar", async () => {
    await setup();

    fireEvent.click(document.querySelectorAll('input[name="checkAtribuido"]')[0]);
    fireEvent.click(screen.getByText("Atribuir a um técnico"));
    expect(screen.getByText("Confirmar atribuição")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Fechar modal atribuir"));
    expect(screen.queryByText("Confirmar atribuição")).not.toBeInTheDocument();
  });

  it("deve logar o erro quando atribuir técnico falhar", async () => {
    const erro = new Error("Falha ao atribuir");
    serviceAtribuicoes.atribuirTecnicos.mockRejectedValue(erro);
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await setup();

    const checkboxes = document.querySelectorAll('input[name="checkAtribuido"]');
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByText("Atribuir a um técnico"));
    fireEvent.change(screen.getByTestId("select-tecnico"), { target: { value: "tec1" } });
    fireEvent.click(screen.getByText("Confirmar atribuição"));

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith("erro ao atribuir");
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(erro);

    consoleLogSpy.mockRestore();
  });

  it("deve retirar atribuições com sucesso pelo modal de confirmação", async () => {
    await setup();

    const checkboxes = document.querySelectorAll('input[name="checkAtribuido"]');
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByText("Retirar Atribuições"));
    expect(screen.getByText("Confirmar retirada")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirmar retirada"));

    await waitFor(() => {
      expect(serviceAtribuicoes.retirarAtribuicoes).toHaveBeenCalledWith({
        periodo: "p1",
        unidades: [{ uuid: "1" }],
      });
    });

    expect(screen.queryByText("Confirmar retirada")).not.toBeInTheDocument();
  });

  it("deve fechar o modal de retirada ao clicar em fechar", async () => {
    await setup();

    const checkboxes = document.querySelectorAll('input[name="checkAtribuido"]');
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByText("Retirar Atribuições"));
    fireEvent.click(screen.getByText("Fechar modal retirada"));

    expect(screen.queryByText("Confirmar retirada")).not.toBeInTheDocument();
  });

  it("deve logar o erro quando retirar atribuições falhar", async () => {
    const erro = new Error("Falha ao retirar");
    serviceAtribuicoes.retirarAtribuicoes.mockRejectedValue(erro);
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await setup();

    const checkboxes = document.querySelectorAll('input[name="checkAtribuido"]');
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByText("Retirar Atribuições"));
    fireEvent.click(screen.getByText("Confirmar retirada"));

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith("erro ao retirar atribuições");
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(erro);

    consoleLogSpy.mockRestore();
  });

  it("deve cancelar a seleção pelo botão Cancelar da barra de montagem", async () => {
    await setup();

    const checkboxes = document.querySelectorAll('input[name="checkAtribuido"]');
    fireEvent.click(checkboxes[0]);
    expect(screen.getByText(/unidade selecionada/i)).toHaveTextContent("1 unidade selecionada");

    fireEvent.click(screen.getByText("Cancelar"));

    expect(screen.getByText(/Exibindo/i)).toHaveTextContent("2 unidades");
  });

  it("deve desabilitar os controles quando o usuário não possui permissão", async () => {
    visoesService.getPermissoes.mockReturnValue(false);
    await setup();

    const checkboxes = document.querySelectorAll('input[name="checkAtribuido"]');
    checkboxes.forEach((checkbox) => expect(checkbox).toBeDisabled());
    expect(document.getElementById("dropdown-basic")).toBeDisabled();
    expect(document.getElementById("sim")).toBeDisabled();
    expect(document.getElementById("nao")).toBeDisabled();
  });
});
