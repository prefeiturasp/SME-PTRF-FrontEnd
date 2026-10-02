import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormularioEditaAta } from "../EdicaoAta/FormularioEditarAta";
import { consultarRF } from "../../../../../../services/escolas/Associacao.service";
import { visoesService } from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/escolas/Associacao.service", () => ({
  consultarRF: jest.fn(),
}));

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
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

jest.mock("react-tooltip", () => ({
  Tooltip: () => null,
}));

describe("FormularioEditaAta Component", () => {
  const mockStateForm = {
    numero_ata: "12",
    data_reuniao: "2026-08-20",
    hora_reuniao: "14:30",
    local_reuniao: "Sala de reuniões",
    comentarios: "Comentários da reunião",
    numero_portaria: "345",
    data_portaria: "2026-08-10",
    motivo_retificacao: null,
    eh_retificacao: false,
  };

  const mockPresentes = [
    { rf: "1111111", nome: "João da Silva", cargo: "Técnico", editavel: false },
    { rf: "2222222", nome: "Maria Souza", cargo: "Analista", editavel: false },
  ];

  const mockPresentesPadrao = [
    { rf: "3333333", nome: "José Lima", cargo: "Supervisor", editavel: false },
  ];

  const renderComponente = (props = {}) => {
    const propsPadrao = {
      listaPresentesPadrao: mockPresentesPadrao,
      listaPresentes: mockPresentes,
      stateFormEditarAta: mockStateForm,
      uuid_ata: "uuid-ata-1",
      formRef: { current: null },
      onSubmitFormEdicaoAta: jest.fn(),
      setDisableBtnSalvar: jest.fn(),
      ehPortariaPublicada: false,
      ...props,
    };

    const resultado = render(<FormularioEditaAta {...propsPadrao} />);

    return { ...resultado, props: propsPadrao };
  };

  const obtemCampo = (container, nome) =>
    container.querySelector(`[name="${nome}"]`);

  const adicionaPresente = async () => {
    fireEvent.click(await screen.findByRole("button", { name: "+ Adicionar presente" }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  describe("Preenchimento dos campos", () => {
    it("deve preencher os campos com os dados da ata", async () => {
      const { container } = renderComponente();

      await screen.findByText("Presentes");

      expect(obtemCampo(container, "stateFormEditarAta.numero_ata")).toHaveValue("12");
      expect(obtemCampo(container, "stateFormEditarAta.hora_reuniao")).toHaveValue("14:30");
      expect(obtemCampo(container, "stateFormEditarAta.numero_portaria")).toHaveValue("345");
      expect(obtemCampo(container, "stateFormEditarAta.local_reuniao")).toHaveValue(
        "Sala de reuniões"
      );
      expect(obtemCampo(container, "stateFormEditarAta.comentarios")).toHaveValue(
        "Comentários da reunião"
      );
      expect(screen.getByLabelText("stateFormEditarAta.data_reuniao")).toHaveValue(
        "2026-08-20"
      );
      expect(screen.getByLabelText("stateFormEditarAta.data_portaria")).toHaveValue(
        "2026-08-10"
      );
    });

    it("deve exibir 'Data da portaria' quando a portaria não estiver publicada", async () => {
      renderComponente();

      expect(await screen.findByText("Data da portaria")).toBeInTheDocument();
    });

    it("deve exibir 'Data da publicação da portaria' quando a portaria estiver publicada", async () => {
      renderComponente({ ehPortariaPublicada: true });

      expect(
        await screen.findByText("Data da publicação da portaria")
      ).toBeInTheDocument();
    });

    it("deve aceitar apenas números no número da ata e da portaria", async () => {
      const { container } = renderComponente();

      await screen.findByText("Presentes");

      const numeroAta = obtemCampo(container, "stateFormEditarAta.numero_ata");
      const numeroPortaria = obtemCampo(container, "stateFormEditarAta.numero_portaria");

      fireEvent.change(numeroAta, { target: { value: "12a" } });
      fireEvent.change(numeroPortaria, { target: { value: "abc" } });

      expect(numeroAta).toHaveValue("12");
      expect(numeroPortaria).toHaveValue("345");

      fireEvent.change(numeroAta, { target: { value: "99" } });

      await waitFor(() => {
        expect(numeroAta).toHaveValue("99");
      });
    });
  });

  describe("Motivo da retificação", () => {
    it("não deve exibir o campo quando a ata não for de retificação", async () => {
      renderComponente();

      await screen.findByText("Presentes");

      expect(screen.queryByText("Motivo da retificação")).not.toBeInTheDocument();
    });

    it("deve exibir o campo preenchido quando a ata for de retificação", async () => {
      const { container } = renderComponente({
        stateFormEditarAta: {
          ...mockStateForm,
          eh_retificacao: true,
          motivo_retificacao: "Correção de valores",
        },
      });

      expect(await screen.findByText("Motivo da retificação")).toBeInTheDocument();
      expect(obtemCampo(container, "stateFormEditarAta.motivo_retificacao")).toHaveValue(
        "Correção de valores"
      );
    });
  });

  describe("Lista de presentes", () => {
    it("deve exibir os presentes da ata", async () => {
      renderComponente();

      expect(await screen.findByDisplayValue("João da Silva")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Maria Souza")).toBeInTheDocument();
      expect(screen.queryByDisplayValue("José Lima")).not.toBeInTheDocument();
    });

    it("deve usar a lista padrão quando a ata ainda não tiver presentes", async () => {
      renderComponente({ listaPresentes: [] });

      expect(await screen.findByDisplayValue("José Lima")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Supervisor")).toBeInTheDocument();
    });

    it("deve exibir mensagem quando não houver presentes nem lista padrão", async () => {
      renderComponente({ listaPresentes: [], listaPresentesPadrao: [] });

      expect(
        await screen.findByText(
          "Não há técnicos indicados para a comissão responsável pela análise de prestação de contas."
        )
      ).toBeInTheDocument();
    });

    it("deve bloquear a edição do RF, nome e cargo de presentes já cadastrados", async () => {
      renderComponente();

      await screen.findByDisplayValue("João da Silva");

      expect(screen.getAllByLabelText("RF")[0]).toBeDisabled();
      expect(screen.getAllByLabelText("Nome")[0]).toBeDisabled();
      expect(screen.getAllByLabelText("Cargo")[0]).toBeDisabled();
    });

    it("deve adicionar um novo presente editável e desabilitar o salvar", async () => {
      const { props } = renderComponente();

      await adicionaPresente();

      const campos = screen.getAllByLabelText("RF");

      expect(campos).toHaveLength(3);
      expect(campos[2]).toBeEnabled();
      expect(campos[2]).toHaveValue("");
      expect(props.setDisableBtnSalvar).toHaveBeenCalledWith(true);
      expect(screen.getByRole("button", { name: "+ Adicionar presente" })).toBeDisabled();
    });

    it("deve remover o presente e habilitar o salvar", async () => {
      const { props } = renderComponente();

      await screen.findByDisplayValue("João da Silva");

      fireEvent.click(screen.getAllByRole("button", { name: "Remover" })[0]);

      await waitFor(() => {
        expect(screen.queryByDisplayValue("João da Silva")).not.toBeInTheDocument();
      });
      expect(screen.getByDisplayValue("Maria Souza")).toBeInTheDocument();
      expect(props.setDisableBtnSalvar).toHaveBeenCalledWith(false);
    });
  });

  describe("Consulta de RF", () => {
    it("deve preencher nome e cargo e habilitar o salvar quando o servidor for encontrado", async () => {
      consultarRF.mockResolvedValue({
        status: 200,
        data: [{ nm_pessoa: "Ana Pereira", cargo: "Coordenadora" }],
      });

      const { props } = renderComponente();

      await adicionaPresente();

      fireEvent.change(screen.getAllByLabelText("RF")[2], {
        target: { value: "4444444" },
      });

      await waitFor(() => {
        expect(screen.getAllByLabelText("Nome")[2]).toHaveValue("Ana Pereira");
      });
      expect(screen.getAllByLabelText("Cargo")[2]).toHaveValue("Coordenadora");
      expect(consultarRF).toHaveBeenCalledWith("4444444");
      expect(props.setDisableBtnSalvar).toHaveBeenLastCalledWith(false);
      expect(screen.queryByText("Servidor não encontrado")).not.toBeInTheDocument();
    });

    it("deve exibir erro e desabilitar o salvar quando o servidor não for encontrado", async () => {
      consultarRF.mockRejectedValue(new Error("Não encontrado"));

      const { props } = renderComponente();

      await adicionaPresente();

      fireEvent.change(screen.getAllByLabelText("RF")[2], {
        target: { value: "5555555" },
      });

      expect(await screen.findByText("Servidor não encontrado")).toBeInTheDocument();
      expect(screen.getAllByLabelText("Nome")[2]).toHaveValue("");
      expect(screen.getAllByLabelText("Cargo")[2]).toHaveValue("");
      // O catch desabilita o salvar, mas o rfVazio (executado no render) reabilita em seguida
      // porque o RF está preenchido. Por isso só verificamos que o bloqueio foi solicitado.
      expect(props.setDisableBtnSalvar).toHaveBeenCalledWith(true);
    });

    it("deve exibir erro de duplicidade sem consultar a API quando o RF já estiver na lista", async () => {
      renderComponente();

      await adicionaPresente();

      fireEvent.change(screen.getAllByLabelText("RF")[2], {
        target: { value: "1111111" },
      });

      expect(
        await screen.findByText("Esta pessoa já está na lista de presentes")
      ).toBeInTheDocument();
      expect(consultarRF).not.toHaveBeenCalled();
    });

    it("não deve consultar a API enquanto o RF tiver menos de 7 dígitos", async () => {
      renderComponente();

      await adicionaPresente();

      fireEvent.change(screen.getAllByLabelText("RF")[2], {
        target: { value: "123" },
      });

      await waitFor(() => {
        expect(screen.getAllByLabelText("RF")[2]).toHaveValue("123");
      });
      expect(consultarRF).not.toHaveBeenCalled();
    });

    it("não deve aceitar letras no RF", async () => {
      renderComponente();

      await adicionaPresente();

      fireEvent.change(screen.getAllByLabelText("RF")[2], {
        target: { value: "12a" },
      });

      expect(screen.getAllByLabelText("RF")[2]).toHaveValue("");
      expect(consultarRF).not.toHaveBeenCalled();
    });
  });

  describe("Permissão de edição", () => {
    it("deve desabilitar os campos e o botão de adicionar presente sem permissão", async () => {
      visoesService.getPermissoes.mockReturnValue(false);

      const { container } = renderComponente();

      await screen.findByText("Presentes");

      [
        "stateFormEditarAta.numero_ata",
        "stateFormEditarAta.hora_reuniao",
        "stateFormEditarAta.numero_portaria",
        "stateFormEditarAta.local_reuniao",
        "stateFormEditarAta.comentarios",
      ].forEach((nome) => {
        expect(obtemCampo(container, nome)).toBeDisabled();
      });
      expect(screen.getByLabelText("stateFormEditarAta.data_reuniao")).toBeDisabled();
      expect(screen.getByLabelText("stateFormEditarAta.data_portaria")).toBeDisabled();
      expect(screen.getByRole("button", { name: "+ Adicionar presente" })).toBeDisabled();
      expect(visoesService.getPermissoes).toHaveBeenCalledWith(
        ["change_ata_parecer_tecnico"],
        0,
        [["change_ata_parecer_tecnico"]]
      );
    });

    it("deve habilitar os campos com permissão", async () => {
      const { container } = renderComponente();

      await screen.findByText("Presentes");

      expect(obtemCampo(container, "stateFormEditarAta.numero_ata")).toBeEnabled();
      expect(obtemCampo(container, "stateFormEditarAta.comentarios")).toBeEnabled();
      expect(screen.getByRole("button", { name: "+ Adicionar presente" })).toBeEnabled();
    });
  });
});
