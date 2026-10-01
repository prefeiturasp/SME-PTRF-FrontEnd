import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalMotivosEstorno from "../ModalMotivosEstorno";

const motivos = [
  { id: 1, motivo: "Depósito em duplicidade" },
  { id: 2, motivo: "Valor lançado a maior" },
];

describe("ModalMotivosEstorno", () => {
  const handleClose = jest.fn();
  const setSelectMotivosEstorno = jest.fn();
  const handleChangeCheckBoxOutrosMotivosEstorno = jest.fn();
  const handleChangeTxtOutrosMotivosEstorno = jest.fn();
  const setShowModalMotivoEstorno = jest.fn();
  const onSubmit = jest.fn();
  const values = { valor: "10,00" };
  const errors = {};

  const renderModal = (props = {}) =>
    render(
      <ModalMotivosEstorno
        show
        handleClose={handleClose}
        listaMotivosEstorno={motivos}
        selectMotivosEstorno={[]}
        setSelectMotivosEstorno={setSelectMotivosEstorno}
        checkBoxOutrosMotivosEstorno={false}
        txtOutrosMotivosEstorno=""
        handleChangeCheckBoxOutrosMotivosEstorno={handleChangeCheckBoxOutrosMotivosEstorno}
        handleChangeTxtOutrosMotivosEstorno={handleChangeTxtOutrosMotivosEstorno}
        setShowModalMotivoEstorno={setShowModalMotivoEstorno}
        onSubmit={onSubmit}
        setFieldValue={jest.fn()}
        values={values}
        errors={errors}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve manter a confirmação desabilitada sem motivo selecionado nem texto de outros motivos", () => {
    renderModal();

    expect(screen.getByText("Motivos Estorno")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDisabled();
  });

  it("deve listar os motivos selecionados e confirmar o estorno", async () => {
    const user = userEvent.setup();
    renderModal({ selectMotivosEstorno: motivos });

    expect(screen.getByText("1. Depósito em duplicidade")).toBeInTheDocument();
    expect(screen.getByText("2. Valor lançado a maior")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(setShowModalMotivoEstorno).toHaveBeenCalledWith(false);
    expect(onSubmit).toHaveBeenCalledWith(values, errors);
  });

  it("deve exibir o campo de outros motivos e permitir confirmar apenas com esse texto", async () => {
    const user = userEvent.setup();
    renderModal({
      checkBoxOutrosMotivosEstorno: true,
      txtOutrosMotivosEstorno: "Ajuste manual",
    });

    expect(screen.getByRole("textbox")).toHaveValue("Ajuste manual");
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeEnabled();

    await user.click(screen.getByRole("checkbox", { name: "Outros motivos" }));
    expect(handleChangeCheckBoxOutrosMotivosEstorno).toHaveBeenCalled();
  });

  it("deve ignorar texto em branco como justificativa de outros motivos", () => {
    renderModal({
      checkBoxOutrosMotivosEstorno: true,
      txtOutrosMotivosEstorno: "   ",
    });

    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDisabled();
  });

  it("deve cancelar sem confirmar o estorno", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
