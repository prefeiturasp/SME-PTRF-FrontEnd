import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalEdicaoReceitaPrevistaPDDE from "../ModalEdicaoReceitaPrevistaPdde";
import { usePatchReceitaPrevistaPdde } from "../hooks/usePatchReceitaPrevistaPdde";
import { usePostReceitaPrevistaPdde } from "../hooks/usePostReceitaPrevistaPdde";
import { visoesService } from "../../../../../../services/visoes.service";

jest.mock("../hooks/usePatchReceitaPrevistaPdde", () => ({
  usePatchReceitaPrevistaPdde: jest.fn(),
}));

jest.mock("../hooks/usePostReceitaPrevistaPdde", () => ({
  usePostReceitaPrevistaPdde: jest.fn(),
}));

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

const receitaCompleta = {
  uuid: "acao-1",
  nome: "PDDE Qualidade",
  aceita_custeio: true,
  aceita_capital: true,
  aceita_livre_aplicacao: true,
  receitas_previstas_pdde_valores: {
    uuid: "valores-1",
    saldo_custeio: "10.50",
    saldo_capital: "20",
    saldo_livre: "5",
    previsao_valor_custeio: "1",
    previsao_valor_capital: "2",
    previsao_valor_livre: "3",
  },
};

describe("ModalEdicaoReceitaPrevistaPDDE", () => {
  const onClose = jest.fn();
  const mutatePatch = jest.fn();
  const mutatePost = jest.fn();

  const renderModal = (receita = receitaCompleta, open = true) =>
    render(
      <ModalEdicaoReceitaPrevistaPDDE
        open={open}
        onClose={onClose}
        receitaPrevistaPDDE={receita}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    localStorage.setItem("PAA", "paa-uuid");
    visoesService.getPermissoes.mockReturnValue(true);
    usePatchReceitaPrevistaPdde.mockReturnValue({
      mutationPatch: { isPending: false, mutate: mutatePatch },
    });
    usePostReceitaPrevistaPdde.mockReturnValue({
      mutationPost: { isPending: false, mutate: mutatePost },
    });
  });

  it("deve exibir os saldos, as receitas previstas e os totais do recurso", async () => {
    renderModal();

    expect(
      await screen.findByText("Editar Recurso PDDE Qualidade")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("10,50")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20,00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("11,50")).toBeInTheDocument();
    expect(screen.getByDisplayValue("22,00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("8,00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });

  it("deve atualizar a receita existente ao salvar", async () => {
    const user = userEvent.setup();
    renderModal();

    await screen.findByDisplayValue("10,50");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(mutatePatch).toHaveBeenCalledWith({
      uuid: "valores-1",
      payload: {
        saldo_custeio: 10.5,
        saldo_capital: 20,
        saldo_livre: 5,
        previsao_valor_custeio: 1,
        previsao_valor_capital: 2,
        previsao_valor_livre: 3,
      },
    });
    expect(mutatePost).not.toHaveBeenCalled();
  });

  it("deve criar a receita prevista quando ainda não existe valor salvo", async () => {
    const user = userEvent.setup();
    const receitaNova = {
      ...receitaCompleta,
      receitas_previstas_pdde_valores: {
        saldo_custeio: "10.50",
        saldo_capital: "20",
        saldo_livre: "5",
        previsao_valor_custeio: "1",
        previsao_valor_capital: "2",
        previsao_valor_livre: "3",
      },
    };

    renderModal(receitaNova);
    await screen.findByDisplayValue("10,50");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(mutatePost).toHaveBeenCalledWith({
      paa: "paa-uuid",
      acao_pdde: "acao-1",
      saldo_custeio: 10.5,
      saldo_capital: 20,
      saldo_livre: 5,
      previsao_valor_custeio: 1,
      previsao_valor_capital: 2,
      previsao_valor_livre: 3,
    });
    expect(mutatePatch).not.toHaveBeenCalled();
  });

  it("deve desabilitar os campos e o salvamento para usuário sem permissão de edição", async () => {
    visoesService.getPermissoes.mockReturnValue(false);
    renderModal();

    await screen.findByDisplayValue("10,50");

    screen.getAllByRole("spinbutton").forEach((campo) => {
      expect(campo).toBeDisabled();
    });
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("deve desabilitar custeio, capital ou livre aplicação quando o recurso não aceita o tipo", async () => {
    renderModal({
      ...receitaCompleta,
      aceita_custeio: false,
      aceita_capital: true,
      aceita_livre_aplicacao: false,
    });

    await screen.findByText("Editar Recurso PDDE Qualidade");

    const custeio = screen.getAllByLabelText("Custeio");
    const capital = screen.getAllByLabelText("Capital");
    const livre = screen.getAllByLabelText("Livre Aplicação");

    expect(custeio[0]).toBeDisabled();
    expect(custeio[1]).toBeDisabled();
    expect(capital[0]).toBeEnabled();
    expect(capital[1]).toBeEnabled();
    expect(livre[0]).toBeDisabled();
    expect(livre[1]).toBeDisabled();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });

  it("deve impedir o salvamento quando o recurso não aceita nenhum tipo de valor", async () => {
    renderModal({
      ...receitaCompleta,
      aceita_custeio: false,
      aceita_capital: false,
      aceita_livre_aplicacao: false,
    });

    await screen.findByText("Editar Recurso PDDE Qualidade");
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("deve fechar o formulário ao cancelar", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(await screen.findByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mutatePatch).not.toHaveBeenCalled();
  });

  it("deve indicar carregamento enquanto a gravação está em andamento", async () => {
    usePatchReceitaPrevistaPdde.mockReturnValue({
      mutationPatch: { isPending: true, mutate: mutatePatch },
    });

    renderModal();

    await screen.findByText("Editar Recurso PDDE Qualidade");
    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });
});
