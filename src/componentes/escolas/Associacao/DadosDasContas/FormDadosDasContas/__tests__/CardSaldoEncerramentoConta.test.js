import React from "react";
import { render, screen } from "@testing-library/react";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { CardSaldoEncerramentoConta } from "../CardSaldoEncerramentoConta";

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

const { visoesService } = require("../../../../../../services/visoes.service");

function setupComponent(overrides = {}) {
  const props = {
    index: 0,
    conta: {
      tipo_conta: { permite_inativacao: true },
      saldo_atual_conta: 0,
      habilitar_solicitar_encerramento: true,
      solicitacao_encerramento: null,
    },
    handleOpenModalConfirmEncerramentoConta: jest.fn(),
    handleOpenModalMotivoRejeicaoEncerramento: jest.fn(),
    handleCancelarEncerramento: jest.fn(),
    errosDataEncerramentoConta: [],
    inicioPeriodo: new Date("2024-01-01"),
    ...overrides,
  };

  return render(<CardSaldoEncerramentoConta {...props} />);
}

test("respeita permissao change_associacao: desabilita data e oculta acoes quando sem permissao; habilita e exibe quando tem permissao", async () => {
  const user = userEvent.setup();

  // Sem permissao -> campo data desabilitado e botoes nao aparecem
  visoesService.getPermissoes.mockReturnValue(false);
  const renderNoPerm = setupComponent();

  const dateInputNoPerm = within(renderNoPerm.container).getByRole("textbox");
  expect(dateInputNoPerm).toBeDisabled();
  expect(within(renderNoPerm.container).queryByRole("button", { name: /Solicitar encerramento da conta/i })).not.toBeInTheDocument();

  // Com permissao -> campo habilitado e botoes aparecem
  visoesService.getPermissoes.mockReturnValue(true);
  const renderWithPerm = setupComponent();

  const dateInputWithPerm = within(renderWithPerm.container).getByRole("textbox");
  expect(dateInputWithPerm).not.toBeDisabled();
  expect(within(renderWithPerm.container).getByRole("button", { name: /Solicitar encerramento da conta/i })).toBeInTheDocument();

  await user.click(within(renderWithPerm.container).getByRole("button", { name: /Solicitar encerramento da conta/i }));
});
