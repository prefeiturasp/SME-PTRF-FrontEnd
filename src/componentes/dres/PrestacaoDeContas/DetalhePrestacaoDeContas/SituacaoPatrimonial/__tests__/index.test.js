import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SituacaoPatrimonialPrestacaoConta } from "../index";
import { useGetBemProduzidosComAdquiridos } from "../../../../../escolas/SituacaoPatrimonial/ListaBemProduzido/hooks/useGetBemProduzidosComAdquiridos";
import { getTagsConferenciaLancamento } from "../../../../../../services/dres/PrestacaoDeContas.service";

jest.mock(
  "../../../../../escolas/SituacaoPatrimonial/ListaBemProduzido/hooks/useGetBemProduzidosComAdquiridos",
  () => ({ useGetBemProduzidosComAdquiridos: jest.fn() })
);

jest.mock("../../../../../../services/dres/PrestacaoDeContas.service", () => ({
  getTagsConferenciaLancamento: jest.fn(),
}));


const prestacaoDeContas = {
  uuid: "pc-uuid",
  periodo_uuid: "periodo-uuid",
  associacao: { uuid: "associacao-uuid" },
};

const bemProduzido = {
  uuid: "bem-1",
  numero_documento: "1273",
  especificacao_do_bem: "Analisador de pressão",
  num_processo_incorporacao: "66016.2023/0060514-8",
  data_aquisicao_producao: "2025-01-01",
  quantidade: 1,
  valor_total: 127980,
  tipo: "Produzido",
};

const bemAdquirido = {
  uuid: "bem-2",
  numero_documento: "1063",
  especificacao_do_bem: "Armário escolar",
  num_processo_incorporacao: "6574.4756/4327895",
  data_aquisicao_producao: "2025-01-01",
  quantidade: 1,
  valor_total: 500,
  tipo: "Adquirido",
};

const mockHook = (data, isLoading = false) =>
  useGetBemProduzidosComAdquiridos.mockReturnValue({ data, isLoading });

describe("SituacaoPatrimonialPrestacaoConta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("busca os bens com a associação e o período da prestação de contas na visão DRE", () => {
    mockHook({ count: 0, results: [] });
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(useGetBemProduzidosComAdquiridos).toHaveBeenCalledWith(
      { periodos_uuid: "periodo-uuid" },
      1,
      true,
      "associacao-uuid"
    );
  });

  it("renderiza o título, o botão de solicitar inclusão desabilitado e as colunas", () => {
    mockHook({ count: 2, results: [bemProduzido, bemAdquirido] });
    const { container } = render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);
    const cabecalhos = Array.from(container.querySelectorAll("thead th")).map((th) => th.textContent.trim());

    expect(screen.getByText("Situação patrimonial")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Solicitar a inclusão de bem produzido" })).toBeDisabled();

    [
      "Nº do documento",
      "Especificação do bem",
      "Nº do processo de incorporação",
      "Data de aquisição/ produção",
      "Quantidade",
      "Valor total",
      "Tipo de bem",
      "Conferido",
      "Ação",
    ].forEach((coluna) => expect(cabecalhos).toContain(coluna));
  });

  it("envolve a tabela em contêiner com rolagem horizontal para telas menores", () => {
    mockHook({ count: 1, results: [bemProduzido] });
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    const wrapper = screen.getByTestId("situacao-patrimonial-tabela");
    expect(wrapper).toHaveClass("table-responsive");
    expect(wrapper.querySelector("table")).toBeInTheDocument();
  });

  it("exibe os dados dos bens formatados e as tags de tipo com as cores corretas", () => {
    mockHook({ count: 2, results: [bemProduzido, bemAdquirido] });
    const { container } = render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(screen.getByText("1273")).toBeInTheDocument();
    expect(screen.getByText("Analisador de pressão")).toBeInTheDocument();
    expect(screen.getByText("66016.2023/0060514-8")).toBeInTheDocument();
    expect(screen.getAllByText("01/01/2025")).toHaveLength(2);
    expect(screen.getByText(/127\.980,00/)).toBeInTheDocument();

    expect(container.querySelector(".custom-tag-bem-produzido")).toHaveTextContent("Produzido");
    expect(container.querySelector(".custom-tag-bem-adquirido")).toHaveTextContent("Adquirido");
  });

  it("exibe a ação de editar desabilitada para bens produzidos e adquiridos", () => {
    mockHook({ count: 2, results: [bemProduzido, bemAdquirido] });
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    const botoesEditar = screen.getAllByRole("button", { name: /Editar bem/ });
    expect(botoesEditar).toHaveLength(2);
    botoesEditar.forEach((botao) => expect(botao).toBeDisabled());
  });

  it("exibe '-' na coluna Conferido quando o bem não tem análise (padrão Conferência de Documentos)", () => {
    mockHook({ count: 2, results: [bemProduzido, bemAdquirido] });
    const { container } = render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    const celulasConferido = Array.from(container.querySelectorAll("tbody tr")).map(
      (linha) => linha.querySelectorAll("td")[7]
    );
    expect(celulasConferido).toHaveLength(2);
    celulasConferido.forEach((celula) => expect(celula.querySelector(".p-2")).toHaveTextContent(/^-$/));
  });

  it("exibe o check de conferido quando o bem tiver análise CORRETO", () => {
    mockHook({ count: 1, results: [{ ...bemProduzido, analise_bem: { resultado: "CORRETO" } }] });
    const { container } = render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    const celulaConferido = container.querySelectorAll("tbody tr td")[7];
    expect(celulaConferido.querySelector(".p-2")).not.toHaveTextContent("-");
    expect(celulaConferido.querySelector("svg, i, span")).toBeInTheDocument();
  });

  it("exibe o botão Legenda conferência e abre o modal da legenda ao clicar", async () => {
    getTagsConferenciaLancamento.mockResolvedValue([
      { id: 2, descricao: "Lançamento conferido e correto" },
    ]);
    mockHook({ count: 1, results: [bemProduzido] });
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(screen.queryByText("Legenda da Conferência de Lançamentos")).not.toBeInTheDocument();
    expect(getTagsConferenciaLancamento).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Legenda conferência" }));

    expect(await screen.findByText("Legenda da Conferência de Lançamentos")).toBeInTheDocument();
    expect(await screen.findByText("Lançamento conferido e correto")).toBeInTheDocument();
    expect(getTagsConferenciaLancamento).toHaveBeenCalledTimes(1);
  });

  it("fecha o modal da legenda ao clicar em Fechar", async () => {
    getTagsConferenciaLancamento.mockResolvedValue([]);
    mockHook({ count: 1, results: [bemProduzido] });
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    fireEvent.click(screen.getByRole("button", { name: "Legenda conferência" }));
    fireEvent.click(await screen.findByRole("button", { name: "Fechar" }));

    await waitFor(() =>
      expect(screen.queryByText("Legenda da Conferência de Lançamentos")).not.toBeInTheDocument()
    );
  });

  it("exibe o total de bens da prestação de contas (e não só da página)", () => {
    mockHook({ count: 15, results: [bemProduzido, bemAdquirido] });
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(screen.getByTestId("situacao-patrimonial-total")).toHaveTextContent(/^Exibindo 15 bens$/);
  });

  it("usa o singular quando há apenas um bem", () => {
    mockHook({ count: 1, results: [bemProduzido] });
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(screen.getByTestId("situacao-patrimonial-total")).toHaveTextContent(/^Exibindo 1 bem$/);
  });

  it("não exibe a legenda nem o total quando não há bens", () => {
    mockHook({ count: 0, results: [] });
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(screen.queryByRole("button", { name: "Legenda conferência" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("situacao-patrimonial-total")).not.toBeInTheDocument();
  });

  it("exibe mensagem orientativa quando não há bens cadastrados", () => {
    mockHook({ count: 0, results: [] });
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(screen.getByText("Não existem bens cadastrados para esta prestação de contas.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("não exibe a mensagem de vazio enquanto carrega", () => {
    mockHook(undefined, true);
    render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(screen.queryByText("Não existem bens cadastrados para esta prestação de contas.")).not.toBeInTheDocument();
  });

  it("não exibe paginação com até 10 registros", () => {
    mockHook({ count: 2, results: [bemProduzido, bemAdquirido] });
    const { container } = render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(container.querySelector(".p-paginator")).not.toBeInTheDocument();
  });

  it("exibe paginação com mais de 10 registros e busca a próxima página", () => {
    mockHook({ count: 15, results: [bemProduzido, bemAdquirido] });
    const { container } = render(<SituacaoPatrimonialPrestacaoConta prestacaoDeContas={prestacaoDeContas} />);

    expect(container.querySelector(".p-paginator")).toBeInTheDocument();
    fireEvent.click(container.querySelectorAll(".p-paginator-page")[1]);

    expect(useGetBemProduzidosComAdquiridos).toHaveBeenLastCalledWith(
      { periodos_uuid: "periodo-uuid" },
      2,
      true,
      "associacao-uuid"
    );
  });
});
