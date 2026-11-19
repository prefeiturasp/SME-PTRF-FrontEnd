import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaaSecaoPlanoEAta } from "../PaaSecaoPlanoEAta";

jest.mock("../../../PaaLinhaDocumento/PaaLinhaDocumento", () => ({
  PaaLinhaDocumento: ({ titulo, testIdPrefix, onVisualizar, onDownload, carregandoVisualizar }) => (
    <div data-testid={`linha-${testIdPrefix}`} data-carregando={String(carregandoVisualizar)}>
      <span>{titulo}</span>
      <button type="button" onClick={onVisualizar}>{`visualizar-${testIdPrefix}`}</button>
      <button type="button" onClick={onDownload}>{`download-${testIdPrefix}`}</button>
    </div>
  ),
}));

jest.mock("../../../PaaAtaAcoes/PaaAtaAcoes", () => ({
  PaaAtaAcoes: ({ paaUuid, documentoPlano, onDepoisDeGerar }) => (
    <div data-testid="ata-acoes" data-paa={paaUuid} data-retificacao={String(documentoPlano?.status?.retificacao)}>
      <button type="button" onClick={onDepoisDeGerar}>depois-de-gerar</button>
    </div>
  ),
}));

describe("PaaSecaoPlanoEAta", () => {
  const documento = { status: { retificacao: false }, uuid: "doc-1" };
  const ata = { uuid: "ata-1", apresenta_botoes_acao: false };

  let props;

  beforeEach(() => {
    props = {
      tituloSecao: null,
      documento,
      ata,
      tituloAta: "Ata de apresentação do PAA",
      paaUuid: "paa-1",
      chaveVisualizacaoDocumento: (uuid, retificacao) => `doc:${uuid}:${retificacao}`,
      visualizacaoEmAndamento: null,
      onVisualizarDocumento: jest.fn(),
      onDownloadDocumento: jest.fn(),
      onVisualizarAta: jest.fn(),
      onDownloadAta: jest.fn(),
      onDepoisDeGerarAta: jest.fn(),
      resumoAssembleia: null,
      dadosPaa: { uuid: "paa-1" },
    };
  });

  it("não renderiza o título da seção quando não informado", () => {
    render(<PaaSecaoPlanoEAta {...props} />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renderiza o título da seção quando informado", () => {
    render(<PaaSecaoPlanoEAta {...props} tituloSecao="Retificação" />);

    expect(screen.getByRole("heading", { name: "Retificação" })).toBeInTheDocument();
  });

  it("renderiza as linhas do Plano Anual e da ata com seus títulos", () => {
    render(<PaaSecaoPlanoEAta {...props} />);

    expect(screen.getByTestId("linha-plano")).toHaveTextContent("Plano Anual");
    expect(screen.getByTestId("linha-ata")).toHaveTextContent("Ata de apresentação do PAA");
  });

  it("aciona visualizar e download do documento com o próprio documento", async () => {
    render(<PaaSecaoPlanoEAta {...props} />);

    await userEvent.click(screen.getByText("visualizar-plano"));
    await userEvent.click(screen.getByText("download-plano"));

    expect(props.onVisualizarDocumento).toHaveBeenCalledWith(documento);
    expect(props.onDownloadDocumento).toHaveBeenCalledWith(documento);
  });

  it("aciona visualizar (com o título) e download da ata", async () => {
    render(<PaaSecaoPlanoEAta {...props} />);

    await userEvent.click(screen.getByText("visualizar-ata"));
    await userEvent.click(screen.getByText("download-ata"));

    expect(props.onVisualizarAta).toHaveBeenCalledWith(ata, "Ata de apresentação do PAA");
    expect(props.onDownloadAta).toHaveBeenCalledWith(ata);
  });

  it("indica carregamento do documento quando a chave em andamento coincide", () => {
    render(<PaaSecaoPlanoEAta {...props} visualizacaoEmAndamento="doc:paa-1:false" />);

    expect(screen.getByTestId("linha-plano")).toHaveAttribute("data-carregando", "true");
    expect(screen.getByTestId("linha-ata")).toHaveAttribute("data-carregando", "false");
  });

  it("indica carregamento da ata quando a chave em andamento coincide", () => {
    render(<PaaSecaoPlanoEAta {...props} visualizacaoEmAndamento="ata:ata-1" />);

    expect(screen.getByTestId("linha-ata")).toHaveAttribute("data-carregando", "true");
    expect(screen.getByTestId("linha-plano")).toHaveAttribute("data-carregando", "false");
  });

  it("não indica carregamento da ata quando ela não tem uuid", () => {
    render(<PaaSecaoPlanoEAta {...props} ata={{}} visualizacaoEmAndamento="ata:undefined" />);

    expect(screen.getByTestId("linha-ata")).toHaveAttribute("data-carregando", "false");
  });

  it("mostra as ações da ata somente quando apresenta_botoes_acao é verdadeiro", () => {
    const { rerender } = render(<PaaSecaoPlanoEAta {...props} />);
    expect(screen.queryByTestId("ata-acoes")).not.toBeInTheDocument();

    rerender(<PaaSecaoPlanoEAta {...props} ata={{ ...ata, apresenta_botoes_acao: true }} />);

    const acoes = screen.getByTestId("ata-acoes");
    expect(acoes).toHaveAttribute("data-paa", "paa-1");
    expect(acoes).toHaveAttribute("data-retificacao", "false");
  });

  it("repassa onDepoisDeGerarAta às ações da ata", async () => {
    render(<PaaSecaoPlanoEAta {...props} ata={{ ...ata, apresenta_botoes_acao: true }} />);

    await userEvent.click(screen.getByText("depois-de-gerar"));

    expect(props.onDepoisDeGerarAta).toHaveBeenCalledTimes(1);
  });

  it("renderiza o resumo da assembleia somente quando informado", () => {
    const { rerender } = render(<PaaSecaoPlanoEAta {...props} />);
    expect(screen.queryByText("Resumo da assembleia")).not.toBeInTheDocument();

    rerender(<PaaSecaoPlanoEAta {...props} resumoAssembleia="Resumo da assembleia" />);

    expect(screen.getByText("Resumo da assembleia")).toBeInTheDocument();
  });
});
