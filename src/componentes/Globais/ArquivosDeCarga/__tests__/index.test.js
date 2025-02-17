import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import ArquivosDeCarga from "../index";
import {
  getTabelaArquivosDeCarga,
  getArquivosDeCargaFiltros,
  postProcessarArquivoDeCarga,
  postCreateArquivoDeCarga,
  patchAlterarArquivoDeCarga,
  deleteArquivoDeCarga,
  getDownloadArquivoDeCarga,
  getDownloadModeloArquivoDeCarga,
  getTiposContas
} from "../../../../services/sme/Parametrizacoes.service";
import { visoesService as vs } from "../../../../services/visoes.service";
import * as services from "../../../../services/sme/Parametrizacoes.service";
import {
  mockTabelaArquivos as tabelaArquivos,
  mockListaArquivos as listaArquivos, 
  mockTipoContas as tiposContas,
  mockPeriodos as listaPeriodos } from "../__fixtures__/mockData";
import { useParams } from "react-router-dom";
import { getPeriodos } from "../../../../services/dres/Dashboard.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

// Mockando useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../../services/dres/Dashboard.service", () => ({
  getPeriodos: jest.fn(),
}));

jest.mock("../../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));
// jest.mock("../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios", () => ({
//   RetornaSeTemPermissaoEdicaoGestaoUsuarios: jest.fn(),
// }));

jest.mock("../../../../services/sme/Parametrizacoes.service", () => ({
  getTabelaArquivosDeCarga: jest.fn(),
  getArquivosDeCargaFiltros: jest.fn(),
  getDownloadArquivoDeCarga: jest.fn(),
  postProcessarArquivoDeCarga: jest.fn(),
  getDownloadModeloArquivoDeCarga: jest.fn(),
  postCreateArquivoDeCarga: jest.fn(),
  patchAlterarArquivoDeCarga: jest.fn(),
  deleteArquivoDeCarga: jest.fn(),
  getTiposContas: jest.fn(),
}));

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  }
}));

describe("Renderiza Tipos de Carga existentes", () => {
  
  it("renderiza CARGA_ASSOCIACOES", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    expect(await screen.findByText("Associações")).toBeInTheDocument();
  });

  it("renderiza CARGA_CONTAS_ASSOCIACOES", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    getArquivosDeCargaFiltros.mockReturnValue(listaArquivos);
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    const elementos = await screen.findAllByText("Contas de Associações");
    expect(elementos[0]).toBeInTheDocument();
    expect(elementos[1]).toBeInTheDocument();
  });

  it("renderiza CARGA_USUARIOS", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_USUARIOS" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_USUARIOS"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    expect(await screen.findByText("Usuários")).toBeInTheDocument();
  });

  it("renderiza CARGA_USUARIOS V2", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_USUARIOS", versao: "V2" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_USUARIOS/V2"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga/:versao?">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    expect(await screen.findByText("Usuários")).toBeInTheDocument();
  });

  it("renderiza CARGA_MATERIAIS_SERVICOS", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_MATERIAIS_SERVICOS" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_MATERIAIS_SERVICOS"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    expect(await screen.findByText("Especificações de Materiais e Serviços")).toBeInTheDocument();
  });

  it("renderiza REPASSE_PREVISTO", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "REPASSE_PREVISTO" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/REPASSE_PREVISTO"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    expect(await screen.findByText("Cargas de repasses previstos")).toBeInTheDocument();
  });

  it("renderiza REPASSE_REALIZADO", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "REPASSE_REALIZADO" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/REPASSE_REALIZADO"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    expect(await screen.findByText("Cargas de repasses realizados")).toBeInTheDocument();
  });

});

describe("ArquivosDeCarga Componente", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("Carrega os elementos na página", async () => {
    getArquivosDeCargaFiltros.mockResolvedValue(tabelaArquivos);
    getTabelaArquivosDeCarga.mockResolvedValue(listaArquivos);
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      const table = screen.getByRole("grid");
      expect(table).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Filtrar por identificador/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar por status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de execução/i)).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
    expect(screen.getByText("Limpar")).toBeInTheDocument();
    expect(screen.getByText(/Adicionar carga/i)).toBeInTheDocument();
    expect(screen.getByText(/Baixar modelo de planilha/i)).toBeInTheDocument();
    expect(getTabelaArquivosDeCarga).toHaveBeenCalledTimes(1);
    expect(getArquivosDeCargaFiltros).toHaveBeenCalledTimes(1);
  });

  test("Upload de arquivo para processamento", async () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    getTabelaArquivosDeCarga.mockReturnValue(tabelaArquivos);
    getArquivosDeCargaFiltros.mockReturnValue(listaArquivos);
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      const table = screen.getByRole("grid");
      expect(table).toBeInTheDocument();

      const botaoAdicionarCarga = screen.getByText(/Adicionar carga/i);
      expect(botaoAdicionarCarga).toBeInTheDocument();
      expect(botaoAdicionarCarga).toBeEnabled();
      fireEvent.click(botaoAdicionarCarga);
    })

    const dialogModal = screen.getByRole("dialog")
    expect(dialogModal).toBeInTheDocument();

    const campoIdentificador = screen.getByLabelText("Identificador *");
    expect(campoIdentificador).toBeInTheDocument();
    fireEvent.change(campoIdentificador, { target: { value: "teste-contas-associacoes" } });

    const campoArquivo = screen.getByLabelText("Conteúdo *");
    const arquivo = new File(["file content"], "file.csv", { type: "text/csv" });
    expect(campoArquivo).toBeInTheDocument();
    fireEvent.change(campoArquivo, { target: { files: [arquivo] } });

    const campoTipoDelimitador = screen.getByLabelText("Tipo delimitador *");
    fireEvent.change(campoTipoDelimitador, { target: { value: "DELIMITADOR_PONTO_VIRGULA" } });

    const botaoSalvar = screen.getByText("Salvar e enviar");
    expect(botaoSalvar).toBeInTheDocument();
    expect(botaoSalvar).toBeEnabled();
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(getArquivosDeCargaFiltros).toHaveBeenCalledTimes(2);
      expect(postCreateArquivoDeCarga).toHaveBeenCalled();
   })
  });

  test("Upload de arquivo para processamento REPASSE_PREVISTO", async () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useParams.mockReturnValue({ tipo_de_carga: "REPASSE_PREVISTO" });

    getTiposContas.mockReturnValue(tiposContas);
    getTabelaArquivosDeCarga.mockReturnValue(tabelaArquivos);
    getArquivosDeCargaFiltros.mockReturnValue(listaArquivos);
    getPeriodos.mockReturnValue(listaPeriodos);
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/REPASSE_PREVISTO"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      const table = screen.getByRole("grid");
      expect(table).toBeInTheDocument();

      const botaoAdicionarCarga = screen.getByText(/Adicionar carga/i);
      fireEvent.click(botaoAdicionarCarga);
    })
    const dialogModal = screen.getByRole("dialog")
    const campoIdentificador = screen.getByLabelText("Identificador *");
    expect(campoIdentificador).toBeInTheDocument();
    fireEvent.change(campoIdentificador, { target: { value: "teste-repasse-previsto" } });

    const campoArquivo = screen.getByLabelText("Conteúdo *");
    const arquivo = new File(["file content"], "file.csv", { type: "text/csv" });
    expect(campoArquivo).toBeInTheDocument();
    fireEvent.change(campoArquivo, { target: { files: [arquivo] } });

    const campoTipoDelimitador = screen.getByLabelText("Tipo delimitador *");
    fireEvent.change(campoTipoDelimitador, { target: { value: "DELIMITADOR_PONTO_VIRGULA" } });

    const campoPeriodo = screen.getByLabelText("Período *");
    fireEvent.change(campoPeriodo, { target: { value: "d9bc43e3-cfd5-4969-bada-af78d96e8faf" } });

    const campoTipoConta = screen.getByLabelText("Tipo de conta *");
    fireEvent.change(campoTipoConta, { target: { value: "ba8b96ef-f05c-41f3-af10-73753490c111" } });

    const botaoSalvar = screen.getByText("Salvar e enviar");
    expect(botaoSalvar).toBeInTheDocument();
    expect(botaoSalvar).toBeEnabled();
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(getArquivosDeCargaFiltros).toHaveBeenCalledTimes(2);
      expect(postCreateArquivoDeCarga).toHaveBeenCalled();
   })
  });
  
});

describe("Listagem de Arquivos Carga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    getTabelaArquivosDeCarga.mockResolvedValue(tabelaArquivos);
    getArquivosDeCargaFiltros.mockResolvedValue(listaArquivos);
  });

  test("Carregar tabela com a listagem de arquivos", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getArquivosDeCargaFiltros).toHaveBeenCalledWith("CARGA_CONTAS_ASSOCIACOES");
      const table = screen.getByRole("grid");
      expect(table).toBeInTheDocument();
      const rows = table.querySelectorAll("tbody tr");
      expect(rows.length).toBeGreaterThan(0);
      expect(screen.getByText("carga_16")).toBeInTheDocument();
    });
  });

});

describe("Ações dos botões", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    getTabelaArquivosDeCarga.mockResolvedValue(tabelaArquivos);
    getArquivosDeCargaFiltros.mockResolvedValue(listaArquivos);
  });

  test("Ação do botão Filtrar", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>);
    
    const botaoFiltro = screen.getByText("Filtrar");
    expect(botaoFiltro).toBeInTheDocument();
    expect(botaoFiltro).toBeEnabled();
    fireEvent.click(botaoFiltro);

    await waitFor(() => {
      expect(getArquivosDeCargaFiltros).toHaveBeenCalled();
    })
  });

  test("Ação do botão Limpar", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );

    const botaoLimpar = screen.getByText("Limpar");
    expect(botaoLimpar).toBeInTheDocument();
    expect(botaoLimpar).toBeEnabled();
    fireEvent.click(botaoLimpar);

    await waitFor(() => {
      expect(getArquivosDeCargaFiltros).toHaveBeenCalled();
      expect(screen.getByLabelText("Filtrar por identificador")).toHaveValue("");
    })
  });

  test("Ação do botão baixar Modelo Carga", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );

    const botaoAcao = screen.getByText("Baixar modelo de planilha");
    expect(botaoAcao).toBeInTheDocument();
    expect(botaoAcao).toBeEnabled();
    fireEvent.click(botaoAcao);

    expect(getDownloadModeloArquivoDeCarga).toHaveBeenCalled();
    // await waitFor(() => {
    // })
  });

  test("Botão de Ação PROCESSAR", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
        const tabela = screen.getByRole("grid");
        const rows = tabela.querySelectorAll("tbody tr");
        expect(rows).toHaveLength(14);
        const primeiraLinha = rows[0];
        const colunas = primeiraLinha.querySelectorAll("td");
        const colunaActions = colunas[5];
        const botoes = colunaActions.querySelectorAll("button");
        const botaoAcao = Array.from(botoes).filter(btn => btn.textContent.trim() === "Processar")[0];
        fireEvent.click(botaoAcao);

        expect(postProcessarArquivoDeCarga).toHaveBeenCalled();
    })
  });

  test("Botão de Ação Editar", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      
        const tabela = screen.getByRole("grid");
        const rows = tabela.querySelectorAll("tbody tr");
        expect(rows).toHaveLength(14);
        const primeiraLinha = rows[1];
        const colunas = primeiraLinha.querySelectorAll("td");
        const colunaActions = colunas[5];
        const botoes = colunaActions.querySelectorAll("button");
        const botaoAcao = Array.from(botoes).filter(btn => btn.textContent.trim() === "Editar")[0];
        fireEvent.click(botaoAcao);

        expect(screen.getByText('Editar conta de associação')).toBeInTheDocument;

        const botaoSalvarEnviar = screen.getByText('Salvar e enviar')
        expect(botaoSalvarEnviar).toBeInTheDocument()
        fireEvent.click(botaoSalvarEnviar)
        expect(patchAlterarArquivoDeCarga).not.toHaveBeenCalled()
    })

  });

  test("Botão de Ação Editar REPASSE PREVISTO", async () => {
    // Testar Edição quando a condição
    useParams.mockReturnValue({ tipo_de_carga: "REPASSE_PREVISTO" });
    getArquivosDeCargaFiltros.mockReturnValue(listaArquivos);
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/REPASSE_PREVISTO"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
        const tabela = screen.getByRole("grid");
        expect(tabela).toBeInTheDocument();
        const rows = tabela.querySelectorAll("tbody tr");
        expect(rows).toHaveLength(14);
        const primeiraLinha = rows[1];
        const colunas = primeiraLinha.querySelectorAll("td");
        const colunaActions = colunas[5];
        const botoes = colunaActions.querySelectorAll("button");
        const botaoAcao = Array.from(botoes).filter(btn => btn.textContent.trim() === "Editar")[0];
        expect(botaoAcao).toBeInTheDocument();
        fireEvent.click(botaoAcao);

        expect(screen.getByText('Editar repasse previsto')).toBeInTheDocument();

        const botaoSalvarEnviar = screen.getByText('Salvar e enviar')
        expect(botaoSalvarEnviar).toBeInTheDocument()
        expect(botaoSalvarEnviar).toBeEnabled()
        // fireEvent.click(botaoSalvarEnviar)
        // expect(patchAlterarArquivoDeCarga).toHaveBeenCalled()
    })

  });

  test("Botão de Ação Baixar", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
        const tabela = screen.getByRole("grid");
        const rows = tabela.querySelectorAll("tbody tr");
        expect(rows).toHaveLength(14);
        const primeiraLinha = rows[0];
        const colunas = primeiraLinha.querySelectorAll("td");
        const colunaActions = colunas[5];
        const botoes = colunaActions.querySelectorAll("button");
        const botaoAcao = Array.from(botoes).filter(btn => btn.textContent.trim() === "Baixar")[0];
        fireEvent.click(botaoAcao);
        expect(getDownloadArquivoDeCarga).toHaveBeenCalled();
    })
  });

  test("Botão de Ação Excluir", async () => {
    useParams.mockReturnValue({ tipo_de_carga: "CARGA_CONTAS_ASSOCIACOES" });
    render(
      <MemoryRouter initialEntries={["/parametro-arquivos-de-carga/CARGA_CONTAS_ASSOCIACOES"]}>
        <Route path="/parametro-arquivos-de-carga/:tipo_de_carga">
          <ArquivosDeCarga />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
        const tabela = screen.getByRole("grid");
        const rows = tabela.querySelectorAll("tbody tr");
        expect(rows).toHaveLength(14);
        const primeiraLinha = rows[0];
        const colunas = primeiraLinha.querySelectorAll("td");
        const colunaActions = colunas[5];
        const botoes = colunaActions.querySelectorAll("button");
        expect(botoes).toHaveLength(5)
        const botaoAcao = Array.from(botoes).filter(btn => btn.textContent.trim() === "Excluir")[0];
        expect(botaoAcao).toBeInTheDocument();
        fireEvent.click(botaoAcao);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });
        const botaoExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-base-vermelho"));
        expect(botaoExcluir).toBeInTheDocument();
        fireEvent.click(botaoExcluir)
        expect(deleteArquivoDeCarga).toHaveBeenCalled();
    });
  });

});
