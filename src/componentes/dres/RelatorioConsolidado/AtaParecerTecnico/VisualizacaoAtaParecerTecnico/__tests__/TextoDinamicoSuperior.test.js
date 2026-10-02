import React from "react";
import { render, screen } from "@testing-library/react";
import { TextoDinamicoSuperior } from "../TextoDinamicoSuperior";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { useGetComissaoResponsavelPC } from "../../../hooks/useGetComissaoResponsavelPC";

jest.mock("../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../../../hooks/useGetComissaoResponsavelPC", () => ({
  useGetComissaoResponsavelPC: jest.fn(),
}));

const normalizaEspacos = (texto) => texto.replace(/\s+/g, " ").trim();

const obtemParagrafosDoTexto = (container) =>
  Array.from(container.querySelectorAll(".texto-dinamico-superior")).map(
    (paragrafo) => normalizaEspacos(paragrafo.textContent)
  );

describe("TextoDinamicoSuperior Component", () => {
  const recursoBase = {
    uuid: "recurso-uuid-1",
    nome: "PTRF",
    habilita_exibicao_de_lauda: false,
    textos_ata: {
      introducao: "conforme a Portaria SME nº 1.234",
    },
  };

  const renderComponente = (props = {}) =>
    render(
      <TextoDinamicoSuperior
        retornaDadosAtaFormatado={(campo) => `[${campo}]`}
        retornaTituloCorpoAta={() => "Ata de Parecer Técnico Conclusivo"}
        ehPrevia={() => false}
        ehRetificacao={false}
        motivoRetificacao=""
        {...props}
      />
    );

  beforeEach(() => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: recursoBase,
    });
    useGetComissaoResponsavelPC.mockReturnValue({
      data: { nome: "Comissão de Prestação de Contas" },
    });
  });

  describe("Renderização do título", () => {
    it("deve renderizar o título do corpo da ata com o número da ata", () => {
      renderComponente();

      expect(
        screen.getByText("Ata de Parecer Técnico Conclusivo [numero_ata]")
      ).toBeInTheDocument();
    });
  });

  describe("Busca da comissão responsável", () => {
    it("deve buscar a comissão responsável pelo uuid do recurso selecionado", () => {
      renderComponente();

      expect(useGetComissaoResponsavelPC).toHaveBeenCalledWith({
        recurso_uuid: "recurso-uuid-1",
      });
    });

    it("deve exibir o nome da comissão responsável no texto", () => {
      const { container } = renderComponente();

      expect(obtemParagrafosDoTexto(container)[0]).toContain(
        "reuniu-se a Comissão de Prestação de Contas da Diretoria Regional de Educação"
      );
    });

    it("deve exibir texto padrão quando não houver comissão responsável", () => {
      useGetComissaoResponsavelPC.mockReturnValue({ data: undefined });

      const { container } = renderComponente();

      expect(obtemParagrafosDoTexto(container)[0]).toContain(
        "reuniu-se a (Nenhuma comissão responsável pela pc encontrada)"
      );
    });
  });

  describe("Aviso de versão prévia", () => {
    it("não deve renderizar o aviso quando não for prévia", () => {
      const { container } = renderComponente();

      expect(container.querySelector(".texto-atencao")).not.toBeInTheDocument();
    });

    it("deve renderizar o aviso com textos de relatório quando a lauda não estiver habilitada", () => {
      const { container } = renderComponente({ ehPrevia: () => true });

      const aviso = normalizaEspacos(
        container.querySelector(".texto-atencao").textContent
      );

      expect(aviso).toBe(
        "Atenção! Essa é uma versão prévia da ata. As informações aqui exibidas podem ser alteradas até a geração do relatório do Consolidado das PCs. A ata final só poderá ser emitida após a geração do relatório do Consolidado das PCs."
      );
    });

    it("deve renderizar o aviso com textos de publicação quando a lauda estiver habilitada", () => {
      useRecursoSelecionadoContext.mockReturnValue({
        recursoSelecionado: { ...recursoBase, habilita_exibicao_de_lauda: true },
      });

      const { container } = renderComponente({ ehPrevia: () => true });

      const aviso = normalizaEspacos(
        container.querySelector(".texto-atencao").textContent
      );

      expect(aviso).toBe(
        "Atenção! Essa é uma versão prévia da ata. As informações aqui exibidas podem ser alteradas até gerada após a publicação do Consolidado das PCs. A ata final só poderá ser gerada após a publicação do Consolidado das PCs."
      );
    });
  });

  describe("Texto da ata sem retificação", () => {
    it("deve renderizar o texto com os dados da ata, o recurso e a base legal", () => {
      const { container } = renderComponente();

      const [textoPrincipal, motivos, deliberacao] =
        obtemParagrafosDoTexto(container);

      expect(textoPrincipal).toBe(
        "[data_reuniao], às [hora_reuniao], reuniu-se a Comissão de Prestação de Contas da Diretoria Regional de Educação [nome_dre], instituída pela Portaria DRE-[nome_dre] nº [numero_portaria] [portaria_publicada], para análise das prestações de contas dos recursos transferidos pelo PTRF, período de [periodo.data_inicio_realizacao_despesas] a [periodo.data_fim_realizacao_despesas], conforme a Portaria SME nº 1.234"
      );
      expect(motivos).toBe("");
      expect(deliberacao).toBe("");
    });

    it("deve encerrar o texto com ponto final quando o recurso não tiver base legal", () => {
      useRecursoSelecionadoContext.mockReturnValue({
        recursoSelecionado: { ...recursoBase, textos_ata: {} },
      });

      const { container } = renderComponente();

      expect(obtemParagrafosDoTexto(container)[0]).toMatch(
        /a \[periodo\.data_fim_realizacao_despesas\]\.$/
      );
    });

    it("não deve indicar prestações de contas retificadas", () => {
      const { container } = renderComponente();

      expect(obtemParagrafosDoTexto(container)[0]).not.toContain(
        "RETIFICADAS"
      );
    });
  });

  describe("Texto da ata de retificação", () => {
    const propsRetificacao = {
      ehRetificacao: true,
      motivoRetificacao: "Correção dos valores informados.",
    };

    it("deve indicar prestações de contas retificadas e introduzir os motivos", () => {
      const { container } = renderComponente(propsRetificacao);

      const textoPrincipal = obtemParagrafosDoTexto(container)[0];

      expect(textoPrincipal).toContain(
        "para análise das prestações de contas RETIFICADAS dos recursos transferidos pelo PTRF"
      );
      expect(textoPrincipal).toMatch(/, em virtude dos seguintes motivos:$/);
    });

    it("deve renderizar o motivo da retificação", () => {
      const { container } = renderComponente(propsRetificacao);

      expect(obtemParagrafosDoTexto(container)[1]).toBe(
        "Correção dos valores informados."
      );
    });

    it("deve renderizar a deliberação com a base legal do recurso", () => {
      const { container } = renderComponente(propsRetificacao);

      expect(obtemParagrafosDoTexto(container)[2]).toBe(
        "Após análise, conforme a Portaria SME nº 1.234"
      );
    });

    it("deve renderizar a deliberação com ponto final quando o recurso não tiver base legal", () => {
      useRecursoSelecionadoContext.mockReturnValue({
        recursoSelecionado: { ...recursoBase, textos_ata: null },
      });

      const { container } = renderComponente(propsRetificacao);

      expect(obtemParagrafosDoTexto(container)[2]).toBe("Após análise.");
    });
  });
});
