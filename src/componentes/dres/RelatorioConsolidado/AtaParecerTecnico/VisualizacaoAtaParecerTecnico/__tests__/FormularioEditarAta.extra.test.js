import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormularioEditaAta } from "../EdicaoAta/FormularioEditarAta";
import { consultarRF } from "../../../../../../services/escolas/Associacao.service";
import { visoesService } from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/escolas/Associacao.service", () => ({
  consultarRF: jest.fn(),
}));

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: { getPermissoes: jest.fn() },
}));

jest.mock("../../../../../Globais/DatePickerField", () => ({
  DatePickerField: ({ name, value, onChange, disabled }) => (
    <input
      aria-label={name}
      value={value || ""}
      onChange={(e) => onChange(name, e.target.value)}
      disabled={disabled}
    />
  ),
}));

jest.mock("react-tooltip", () => ({ Tooltip: () => null }));

describe("FormularioEditaAta - complementar", () => {
  const stateForm = {
    numero_ata: "12",
    data_reuniao: "2026-08-20",
    hora_reuniao: "14:30",
    local_reuniao: "Sala",
    comentarios: "",
    numero_portaria: "345",
    data_portaria: "2026-08-10",
    motivo_retificacao: null,
    eh_retificacao: false,
  };

  const renderiza = (props = {}) => {
    const p = {
      listaPresentesPadrao: [],
      listaPresentes: [],
      stateFormEditarAta: stateForm,
      uuid_ata: "uuid-ata",
      formRef: { current: null },
      onSubmitFormEdicaoAta: jest.fn(),
      setDisableBtnSalvar: jest.fn(),
      ehPortariaPublicada: false,
      ...props,
    };
    const r = render(<FormularioEditaAta {...p} />);
    return { ...r, props: p };
  };

  beforeEach(() => {
    visoesService.getPermissoes.mockReturnValue(true);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("aceita número de portaria numérico", async () => {
    const { container } = renderiza();
    await screen.findByText("Presentes");
    const campo = container.querySelector('[name="stateFormEditarAta.numero_portaria"]');
    fireEvent.change(campo, { target: { value: "789" } });
    await waitFor(() => expect(campo).toHaveValue("789"));
  });

  it("desabilita salvar e adicionar quando há presente com RF vazio", async () => {
    const { props } = renderiza({
      listaPresentes: [{ rf: "", nome: "", cargo: "", editavel: true }],
    });
    await screen.findByText("Presentes");
    expect(props.setDisableBtnSalvar).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "+ Adicionar presente" })).toBeDisabled();
  });

  it("remover presente com RF vazio reabilita o salvar", async () => {
    const { props } = renderiza({
      listaPresentes: [{ rf: "", nome: "", cargo: "", editavel: true }],
    });
    await screen.findByText("Presentes");
    fireEvent.click(screen.getByRole("button", { name: "Remover" }));
    await waitFor(() => expect(screen.queryAllByLabelText("RF")).toHaveLength(0));
    expect(props.setDisableBtnSalvar).toHaveBeenLastCalledWith(false);
  });

  it("dispara handleChange nos campos nome e cargo desabilitados", async () => {
    renderiza({
      listaPresentes: [{ rf: "1111111", nome: "João", cargo: "Técnico", editavel: false }],
    });
    await screen.findByDisplayValue("João");
    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Maria" } });
    fireEvent.change(screen.getByLabelText("Cargo"), { target: { value: "Chefe" } });
    await waitFor(() => {
      expect(screen.getByLabelText("Nome")).toHaveValue("Maria");
      expect(screen.getByLabelText("Cargo")).toHaveValue("Chefe");
    });
  });

  it("limpa mensagem de erro e não consulta ao editar RF para menos de 7 dígitos após erro", async () => {
    renderiza({
      listaPresentes: [{ rf: "", nome: "", cargo: "", editavel: true }],
    });
    await screen.findByText("Presentes");
    consultarRF.mockResolvedValue({ status: 404, data: [] });
    fireEvent.change(screen.getByLabelText("RF"), { target: { value: "7777777" } });
    await waitFor(() => expect(consultarRF).toHaveBeenCalledWith("7777777"));
    expect(screen.queryByText("Servidor não encontrado")).not.toBeInTheDocument();
  });

  it("ignora resposta com status diferente de 200/201 sem preencher nome e cargo", async () => {
    consultarRF.mockResolvedValue({ status: 500, data: [{ nm_pessoa: "X", cargo: "Y" }] });
    renderiza({
      listaPresentes: [{ rf: "", nome: "", cargo: "", editavel: true }],
    });
    await screen.findByText("Presentes");
    fireEvent.change(screen.getByLabelText("RF"), { target: { value: "8888888" } });
    await waitFor(() => expect(consultarRF).toHaveBeenCalled());
    expect(screen.getByLabelText("Nome")).toHaveValue("");
  });

  it("aceita status 201 na consulta de RF", async () => {
    consultarRF.mockResolvedValue({ status: 201, data: [{ nm_pessoa: "Zé", cargo: "Dir" }] });
    renderiza({
      listaPresentes: [{ rf: "", nome: "", cargo: "", editavel: true }],
    });
    await screen.findByText("Presentes");
    fireEvent.change(screen.getByLabelText("RF"), { target: { value: "9999999" } });
    await waitFor(() => expect(screen.getByLabelText("Nome")).toHaveValue("Zé"));
  });

  it("renderiza campos vazios quando valores do estado são nulos", async () => {
    const { container } = renderiza({
      stateFormEditarAta: {
        ...stateForm,
        numero_ata: null,
        hora_reuniao: null,
        local_reuniao: null,
        numero_portaria: null,
        data_reuniao: null,
        data_portaria: null,
        comentarios: null,
        eh_retificacao: true,
        motivo_retificacao: null,
      },
    });
    await screen.findByText("Presentes");
    expect(container.querySelector('[name="stateFormEditarAta.numero_ata"]')).toHaveValue("");
    expect(container.querySelector('[name="stateFormEditarAta.motivo_retificacao"]')).toHaveValue("");
  });
});
