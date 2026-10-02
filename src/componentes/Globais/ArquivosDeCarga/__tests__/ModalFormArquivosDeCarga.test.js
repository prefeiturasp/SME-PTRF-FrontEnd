import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalFormArquivosDeCarga from "../ModalFormArquivosDeCarga";

const stateFormModal = {
  operacao: "create",
  identificador: "",
  conteudo: "",
  periodo: "",
  tipo_de_conta: "",
  tipo_delimitador: "",
  ultima_execucao: "01/01/2026",
  status: "PENDENTE",
  log: "",
  id: 15,
  nome_arquivo: "",
  valida_conteudo: false,
};

const tabelaArquivos = {
  tipos_delimitadores: [{ id: "virgula", nome: "Vírgula" }],
};

describe("ModalFormArquivosDeCarga", () => {
  const handleClose = jest.fn();
  const handleSubmitModalForm = jest.fn();

  const renderModal = (props = {}) =>
    render(
      <ModalFormArquivosDeCarga
        show
        stateFormModal={stateFormModal}
        handleClose={handleClose}
        handleSubmitModalForm={handleSubmitModalForm}
        tabelaArquivos={tabelaArquivos}
        statusTemplate={() => "Pendente"}
        dadosDeOrigem={{ titulo_modal: "arquivo de carga" }}
        periodos={[{ uuid: "periodo-1", referencia: "2026.1" }]}
        arquivoRequerPeriodo={false}
        tiposDeContas={[{ uuid: "conta-1", nome: "Cheque" }]}
        arquivoRequerTipoDeConta={false}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir o formulário de inclusão e os dados somente leitura", () => {
    renderModal();

    expect(screen.getByText("Adicionar arquivo de carga")).toBeInTheDocument();
    expect(screen.getByLabelText("Identificador *")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo delimitador *")).toBeInTheDocument();
    expect(screen.getByLabelText("Última execução")).toHaveValue("01/01/2026");
    expect(screen.getByLabelText("Status")).toHaveValue("Pendente");
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.queryByLabelText("Período *")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Tipo de conta *")).not.toBeInTheDocument();
  });

  it("deve informar os campos obrigatórios quando o envio está incompleto", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Salvar e enviar" }));

    expect(await screen.findByText("* Identificador é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("* Tipo delimitador é obrigatório")).toBeInTheDocument();
    expect(handleSubmitModalForm).not.toHaveBeenCalled();
  });

  it("deve pedir período e tipo de conta quando o arquivo exige esses dados", () => {
    renderModal({ arquivoRequerPeriodo: true, arquivoRequerTipoDeConta: true });

    expect(screen.getByRole("combobox", { name: "Período *" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2026.1" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tipo de conta *" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Cheque" })).toBeInTheDocument();
  });

  it("deve enviar o arquivo preenchido e permitir cancelar", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByLabelText("Identificador *"), "creditos-2026");
    await user.selectOptions(screen.getByLabelText("Tipo delimitador *"), "virgula");
    await user.click(screen.getByRole("button", { name: "Salvar e enviar" }));

    expect(handleSubmitModalForm).toHaveBeenCalledWith(
      expect.objectContaining({
        identificador: "creditos-2026",
        tipo_delimitador: "virgula",
      }),
      expect.anything()
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("deve mostrar o arquivo atual ao editar uma carga", () => {
    renderModal({
      stateFormModal: {
        ...stateFormModal,
        operacao: "edit",
        identificador: "carga-1",
        nome_arquivo: "pasta/creditos.csv",
      },
    });

    expect(screen.getByText("Editar arquivo de carga")).toBeInTheDocument();
    expect(screen.getByText("creditos.csv")).toBeInTheDocument();
  });
});
