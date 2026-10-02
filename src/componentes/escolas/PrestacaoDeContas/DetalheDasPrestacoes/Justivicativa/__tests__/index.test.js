import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Justificativa } from "../index";
import * as visoesService from "../../../../../../services/visoes.service";

// Mock do serviço externo
jest.mock("../../../../../../services/visoes.service");

describe("Justificativa", () => {
  const salvarJustificativaMock = jest.fn();
  const setBtnJustificativaSalvarDisable = jest.fn();
  const setCheckSalvarJustificativa = jest.fn();
  const setClassBtnSalvarJustificativa = jest.fn();
  const handleChangeTextareaJustificativa = jest.fn();

  const props = {
    textareaJustificativa: "",
    handleChangeTextareaJustificativa,
    periodoFechado: false,
    btnSalvarJustificativaDisable: false,
    setBtnJustificativaSalvarDisable,
    checkSalvarJustificativa: false,
    setCheckSalvarJustificativa,
    salvarJustificativa: salvarJustificativaMock,
    classBtnSalvarJustificativa: "primary",
    lancamentosSelecionados: ["lanc1"],
    setClassBtnSalvarJustificativa,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza textarea e botão corretamente", () => {
    visoesService.visoesService.getPermissoes.mockReturnValue(true);
    render(<Justificativa {...props} permissaoEditarConciliacao={true} />);

    expect(screen.getByPlaceholderText("Escreva o comentário")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Salvar Justificativas/i })).toBeInTheDocument();
  });

  it("desativa textarea se permissaoEditarConciliacao for false", () => {
    render(<Justificativa {...props} permissaoEditarConciliacao={false} />);
    expect(screen.getByPlaceholderText("Escreva o comentário")).toBeDisabled();
    expect(screen.queryByRole("button", { name: /Salvar Justificativas/i })).not.toBeInTheDocument();
  });

  it("mantém textarea e botão habilitados mesmo sem permiteEditarCamposExtrato", () => {
    render(<Justificativa {...props} permissaoEditarConciliacao={true} permiteEditarCamposExtrato={false} />);

    expect(screen.getByPlaceholderText("Escreva o comentário")).toBeEnabled();
    expect(screen.getByRole("button", { name: /Salvar Justificativas/i })).toBeInTheDocument();
  });

  it("chama salvarJustificativa e atualizadores ao clicar no botão", () => {
    render(<Justificativa {...props} permissaoEditarConciliacao={true} />);

    const btn = screen.getByRole("button", { name: /Salvar Justificativas/i });
    fireEvent.click(btn);

    expect(setBtnJustificativaSalvarDisable).toHaveBeenCalledWith(true);
    expect(setCheckSalvarJustificativa).toHaveBeenCalledWith(true);
    expect(setClassBtnSalvarJustificativa).toHaveBeenCalledWith("secondary");
    expect(salvarJustificativaMock).toHaveBeenCalledWith(["lanc1"]);
  });

  it('exibe o ícone de "Salvo" se permissaoEditarConciliacao e checkSalvarJustificativa for true', () => {
    render(
      <Justificativa
        {...props}
        checkSalvarJustificativa={true}
        permissaoEditarConciliacao={true}
      />
    );

    expect(screen.getByText(/Salvo/i)).toBeInTheDocument();
  });

  it("chama handleChangeTextareaJustificativa ao digitar no textarea", () => {
    render(<Justificativa {...props} permissaoEditarConciliacao={true} />);
    const textarea = screen.getByPlaceholderText("Escreva o comentário");

    fireEvent.change(textarea, { target: { value: "Texto de teste" } });

    expect(handleChangeTextareaJustificativa).toHaveBeenCalled();
  });

  it("exibe justificativa obrigatória quando justificativaObrigatoria é true", () => {
    render(<Justificativa {...props} permissaoEditarConciliacao={true} justificativaObrigatoria={true} />);

    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Escreva o comentário")).toBeRequired();
  });

  it("exibe justificativa opcional quando justificativaObrigatoria é false", () => {
    render(<Justificativa {...props} permissaoEditarConciliacao={true} justificativaObrigatoria={false} />);

    expect(screen.getByText(/opcional/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Escreva o comentário")).not.toBeRequired();
  });
});
