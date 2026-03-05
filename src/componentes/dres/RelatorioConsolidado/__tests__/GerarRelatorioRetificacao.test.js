import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GrC from "../GerarRelatorioRetificacao";
import { visoesService } from "../../../../services/visoes.service";


// mocks 
jest.mock("../../../../utils/Modais", () => ({
  ModalPublicarRelatorioConsolidado: ({ show }) =>
    show ? <div>Modal Publicar Consolidado</div> : null,
  ModalPublicarRelatorioConsolidadoPendente: ({ show }) =>
    show ? <div>Modal Publicar Pendente</div> : null,
}));

jest.mock("../MarcarPublicacaoNoDiarioOficial/BotaoMarcarPublicacaoNoDiarioOficial", () => () => (
  <div>Botao Diario Oficial</div>
));

jest.mock("../BlocoRetificacao/InfoRefiticacaoRelatorio", () => () => (
  <div>Info Retificacao</div>
));

jest.mock("../Retificar", () => ({
  Retificar: () => <div>Retificar</div>,
}));

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(() => true),
  },
}));

beforeEach(() => {
  visoesService.getPermissoes.mockReturnValue(true);
});

const GerarRelatorioRetificado = (props) =>
  GrC(
    props.publicarConsolidadoDre,
    props.podeGerarPrevia,
    props.children,
    props.consolidadoDre,
    props.execucaoFinanceira,
    props.disableGerar,
    props.setShowPublicarRelatorioConsolidado,
    props.publicarConsolidadoDePublicacoesParciais,
    props.carregaConsolidadosDreJaPublicadosProximaPublicacao,
    props.showPublicarRelatorioConsolidado
  );

const setup = (overrideProps = {}) => {
  const defaultProps = {
    publicarConsolidadoDre: jest.fn(),
    podeGerarPrevia: true,
    children: <div>Prévia</div>,
    consolidadoDre: {
      titulo_relatorio: "Relatório Teste",
      ja_publicado: false,
      habilita_botao_gerar: true,
      eh_consolidado_de_publicacoes_parciais: false,
    },
    execucaoFinanceira: {
      por_tipo_de_conta: [],
    },
    disableGerar: false,
    setShowPublicarRelatorioConsolidado: jest.fn(),
    publicarConsolidadoDePublicacoesParciais: jest.fn(),
    carregaConsolidadosDreJaPublicadosProximaPublicacao: jest.fn(),
    showPublicarRelatorioConsolidado: false,
  };

  const props = { ...defaultProps, ...overrideProps };

  render(<GerarRelatorioRetificado {...props} />);

  return { props };
};

describe("GerarRelatorioRetificado", () => {
  it("deve renderizar o título do relatório", () => {
    setup();

    expect(screen.getByText("Relatório Teste")).toBeInTheDocument();
  });

 it("deve exibir botão Gerar habilitado", () => {
    setup();

    const botao = screen.getByRole("button", { name: /gerar/i });
    expect(botao).toBeEnabled();
  });

  it("deve chamar publicarConsolidadoDre ao clicar em Gerar quando não é publicação parcial", () => {
    const publicarConsolidadoDre = jest.fn();

    const { props } = setup({
      publicarConsolidadoDre,
      consolidadoDre: {
        titulo_relatorio: "Relatório Teste",
        ja_publicado: false,
        habilita_botao_gerar: true,
        eh_consolidado_de_publicacoes_parciais: false,
      },
      execucaoFinanceira: {
        por_tipo_de_conta: [
          {
            justificativa_texto: true,
            valores: {},
          },
        ],
      },
    });

    const botao = screen.getByRole("button", { name: /gerar/i });
    fireEvent.click(botao);

    expect(props.setShowPublicarRelatorioConsolidado).toHaveBeenCalledWith(true);
  });

  it("deve chamar publicarConsolidadoDePublicacoesParciais quando for consolidado parcial", () => {
    const publicarConsolidadoDePublicacoesParciais = jest.fn();

    setup({
      publicarConsolidadoDePublicacoesParciais,
      consolidadoDre: {
        titulo_relatorio: "Relatório Teste",
        ja_publicado: false,
        habilita_botao_gerar: true,
        eh_consolidado_de_publicacoes_parciais: true,
      },
    });

    const botao = screen.getByRole("button", { name: /gerar/i });
    fireEvent.click(botao);

    expect(publicarConsolidadoDePublicacoesParciais).toHaveBeenCalled();
  });
 
  it("deve abrir modal pendente quando houver divergência e sem justificativa", () => {
    setup({
      execucaoFinanceira: {
        por_tipo_de_conta: [
          {
            justificativa_texto: false,
            valores: {
              repasses_previstos_sme_custeio: 10,
              repasses_no_periodo_custeio: 20,
              repasses_previstos_sme_capital: 10,
              repasses_no_periodo_capital: 20,
              repasses_previstos_sme_livre: 10,
              repasses_no_periodo_livre: 20,
              repasses_previstos_sme_total: 10,
              repasses_no_periodo_total: 20,
            },
          },
        ],
      },
    });

    const botao = screen.getByRole("button", { name: /gerar/i });
    fireEvent.click(botao);

    expect(screen.getByText("Modal Publicar Pendente")).toBeInTheDocument();
  });
});