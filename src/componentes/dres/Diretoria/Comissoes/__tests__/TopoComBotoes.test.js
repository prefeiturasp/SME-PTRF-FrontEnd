import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopoComBotoes } from "../TopoComBotoes";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

describe("TopoComBotoes Comissoes DRE", () => {
  const setup = (hasPermission = true) => {
    const handleOnShowModalAdicao = jest.fn();

    visoesService.getPermissoes.mockReturnValue(hasPermission);

    render(
      <TopoComBotoes
        handleOnShowModalAdicao={handleOnShowModalAdicao}
      />
    );

    const button = screen.getByRole("button", {
      name: /adicionar novo membro/i,
    });

    return {
      button,
      handleOnShowModalAdicao,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o título corretamente", () => {
    setup();

    expect(
      screen.getByRole("heading", {
        name: /comissões relativas ao ptrf/i,
      })
    ).toBeInTheDocument();
  });

  it("renderiza o botão de adicionar novo membro", () => {
    const { button } = setup();

    expect(button).toBeInTheDocument();
  });

  it("habilita o botão quando o usuário tem permissão", () => {
    const { button } = setup(true);

    expect(button).toBeEnabled();
    expect(visoesService.getPermissoes).toHaveBeenCalledWith([
      "change_comissoes_dre",
    ]);
  });

  it("desabilita o botão quando o usuário não tem permissão", () => {
    const { button } = setup(false);

    expect(button).toBeDisabled();
  });

  it("chama handleOnShowModalAdicao ao clicar no botão quando habilitado", async () => {
    const user = userEvent.setup();
    const { button, handleOnShowModalAdicao } = setup(true);

    await user.click(button);

    expect(handleOnShowModalAdicao).toHaveBeenCalledTimes(1);
  });

  it("não chama handleOnShowModalAdicao quando o botão está desabilitado", async () => {
    const user = userEvent.setup();
    const { button, handleOnShowModalAdicao } = setup(false);

    await user.click(button);

    expect(handleOnShowModalAdicao).not.toHaveBeenCalled();
  });

  it("exibe o texto correto dentro do botão", () => {
    const { button } = setup();

    expect(button).toHaveTextContent(/adicionar novo membro/i);
  });

  it("mantém o botão acessível pelo role 'button'", () => {
    setup();

    expect(
      screen.getByRole("button", { name: /adicionar novo membro/i })
    ).toBeInTheDocument();
  });
});