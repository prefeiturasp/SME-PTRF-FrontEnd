import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { JustificativaDiferenca } from "../JustificativaDiferenca";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

describe("JustificativaDiferenca Component", () => {
  const mockJustificativa = {
    uuid: "justificativa-1",
    texto: "Texto da justificativa",
  };

  const renderComponente = (props = {}) => {
    const propsPadrao = {
      comparaValores: jest.fn(() => true),
      justificativaDiferenca: mockJustificativa,
      setJustificativaDiferenca: jest.fn(),
      onChangeJustificativaDiferenca: jest.fn(),
      onSubmitJustificativaDiferenca: jest.fn(),
      btnSalvarJustificativaDisable: false,
      setBtnSalvarJustificativaDisable: jest.fn(),
      jaPublicado: false,
      ...props,
    };

    const resultado = render(<JustificativaDiferenca {...propsPadrao} />);

    return { ...resultado, props: propsPadrao };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
  });

  describe("Condições de exibição", () => {
    it("não deve renderizar nada quando não houver diferença entre previsto e transferido", () => {
      const { container } = renderComponente({ comparaValores: () => false });

      expect(container).toBeEmptyDOMElement();
    });

    it("deve renderizar o título, o campo e os botões quando houver diferença", () => {
      renderComponente();

      expect(
        screen.getByText(
          "Justificativa da diferença entre o valor previsto pela SME e o transferido pela DRE no período"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Escreva aqui a justificativa para essa diferença.")
      ).toHaveValue("Texto da justificativa");
      expect(screen.getByRole("button", { name: "Limpar" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
    });
  });

  describe("Campo de justificativa", () => {
    it("deve chamar onChangeJustificativaDiferenca com o texto digitado", () => {
      const { props } = renderComponente();

      fireEvent.change(
        screen.getByPlaceholderText("Escreva aqui a justificativa para essa diferença."),
        { target: { value: "Novo texto" } }
      );

      expect(props.onChangeJustificativaDiferenca).toHaveBeenCalledWith("Novo texto");
    });

    it("deve desabilitar o campo quando o usuário não tiver permissão", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      renderComponente();

      expect(
        screen.getByPlaceholderText("Escreva aqui a justificativa para essa diferença.")
      ).toBeDisabled();
      expect(visoesService.getPermissoes).toHaveBeenCalledWith([
        "change_relatorio_consolidado_dre",
      ]);
    });
  });

  describe("Botão Limpar", () => {
    it("deve limpar o texto mantendo os demais dados e habilitar o botão salvar", () => {
      const { props } = renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Limpar" }));

      expect(props.setJustificativaDiferenca).toHaveBeenCalledWith({
        uuid: "justificativa-1",
        texto: "",
      });
      expect(props.setBtnSalvarJustificativaDisable).toHaveBeenCalledWith(false);
    });

    it("deve estar desabilitado quando o consolidado já estiver publicado", () => {
      renderComponente({ jaPublicado: true });

      expect(screen.getByRole("button", { name: "Limpar" })).toBeDisabled();
    });

    it("deve estar desabilitado quando o usuário não tiver permissão", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      renderComponente();

      expect(screen.getByRole("button", { name: "Limpar" })).toBeDisabled();
    });
  });

  describe("Botão Salvar", () => {
    it("deve estar habilitado e chamar onSubmitJustificativaDiferenca ao ser clicado", () => {
      const { props } = renderComponente();

      const botaoSalvar = screen.getByRole("button", { name: "Salvar" });

      expect(botaoSalvar).toBeEnabled();

      fireEvent.click(botaoSalvar);

      expect(props.onSubmitJustificativaDiferenca).toHaveBeenCalledTimes(1);
    });

    it.each([
      ["o consolidado já estiver publicado", { jaPublicado: true }],
      ["btnSalvarJustificativaDisable for true", { btnSalvarJustificativaDisable: true }],
    ])("deve estar desabilitado quando %s", (_, props) => {
      renderComponente(props);

      expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    });

    it("deve estar desabilitado quando o usuário não tiver permissão", () => {
      visoesService.getPermissoes.mockReturnValue(false);

      renderComponente();

      expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    });
  });
});
