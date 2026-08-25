import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormularioEditaAta } from "../index";

import {
	getMembroPorIdentificadorPaa,
	getProfessorGremioInfo,
} from "../../../../../../../services/escolas/PresentesAtaPaa.service";
import * as utils from "../../utils";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { visoesService } from "../../../../../../../services/visoes.service";

jest.mock(
	"../../../../../../../services/escolas/PresentesAtaPaa.service",
	() => ({
		getMembroPorIdentificadorPaa: jest.fn(),
		getProfessorGremioInfo: jest.fn(),
	}),
);

jest.mock("../../utils", () => ({
	...jest.requireActual("../../utils"),
	adicionaProfessorGremioNaLista: jest.fn(),
	extraiProfessorDefaults: jest.fn(),
}));

jest.mock("../../../../../../../services/visoes.service", () => ({
	visoesService: {
		getPermissoes: jest.fn(() => true),
	},
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
	toastCustom: {
		ToastCustomSuccess: jest.fn(),
		ToastCustomWarning: jest.fn(),
		ToastCustomError: jest.fn(),
	},
}));

const professor = {
	id: "professor-gremio",
	identificacao: "",
	nome: "",
	cargo: "",
	editavel: true,
	membro: false,
	professor_gremio: true,
};

const propsBase = {
	listaPresentesPadrao: [],
	stateFormEditarAta: {
		tipo_ata: "APRESENTACAO",
		data_reuniao: "2025-01-01",
		comentarios: "",
		parecer_conselho: "",
	},
	tabelas: {
		pareceres: [],
		tipos_reuniao: [],
		convocacoes: [],
	},
	membrosCargos: [],
	formRef: {
		current: {
			setFieldValue: jest.fn(),
			values: { listaPresentesPadrao: [professor] },
		},
	},
	onSubmitFormEdicaoAta: jest.fn(),
	uuid_ata: "uuid-123",
	setDisableBtnSalvar: jest.fn(),
	repassesPendentes: [],
	erros: {},
	editaStatusDePresencaMembro: jest.fn(),
	precisaProfessorGremio: true,
};

describe("FormularioEditaAta - professor orientador do grêmio", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		visoesService.getPermissoes.mockReturnValue(true);
		utils.extraiProfessorDefaults.mockReturnValue(null);
		utils.adicionaProfessorGremioNaLista.mockImplementation(
			(lista, ataUuid, professorDefaults, precisaProfessorGremio) =>
				precisaProfessorGremio ? [...lista, professor] : lista,
		);
	});

	it("deve renderizar o campo RF Professor Orientador do Grêmio quando habilitado", async () => {
		const { getByLabelText } = render(
			<FormularioEditaAta {...propsBase} />,
		);

		await waitFor(() => {
			expect(
				getByLabelText("RF Professor Orientador do Grêmio"),
			).toBeInTheDocument();
		});
	});

	it("não deve renderizar o participante do grêmio quando desabilitado", async () => {
		const { queryByLabelText } = render(
			<FormularioEditaAta
				{...propsBase}
				precisaProfessorGremio={false}
			/>,
		);

		await waitFor(() => {
			expect(
				queryByLabelText("RF Professor Orientador do Grêmio"),
			).not.toBeInTheDocument();
		});
	});

	it("deve consultar a API e preencher nome e cargo ao sair do campo RF", async () => {
		getProfessorGremioInfo.mockResolvedValue({
			mensagem: "servidor-encontrado",
			nome: "Professor João",
			cargo: "Professor",
		});

		const { container, getByLabelText } = render(
			<FormularioEditaAta
				{...propsBase}
				formRef={{
					current: {
						values: { listaPresentesPadrao: [professor] },
					},
				}}
			/>,
		);

        const campoRf = await screen.findByLabelText(
            "RF Professor Orientador do Grêmio",
        );

		fireEvent.change(campoRf, { target: { value: "1234567" } });
		fireEvent.blur(campoRf);

		await waitFor(() => {
			expect(getProfessorGremioInfo).toHaveBeenCalledWith("1234567");
			expect(
				container.querySelector(
					'input[name="listaPresentesPadrao[0].nome"]',
				).value,
			).toBe("Professor João");
			expect(
				container.querySelector(
					'input[name="listaPresentesPadrao[0].cargo"]',
				).value,
			).toBe("Professor / Professor Orientador");
			expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
				"Participante inserido com sucesso",
			);
		});
	});

	it("deve exibir mensagem de sucesso ao confirmar a inclusão de um membro", async () => {
		getMembroPorIdentificadorPaa.mockResolvedValue({
			mensagem: "servidor-encontrado",
			nome: "Membro da Associação",
			cargo: "Membro",
		});

		const { container, getByText } = render(
			<FormularioEditaAta
				{...propsBase}
				listaPresentesPadrao={[]}
				precisaProfessorGremio={false}
				formRef={{
					current: { values: { listaPresentesPadrao: [] } },
				}}
			/>,
		);

		const botaoAdicionar = getByText("+ Adicionar presente");
		await waitFor(() => expect(botaoAdicionar).toBeEnabled());
		fireEvent.click(botaoAdicionar);

		const campoRf = await screen.findByRole("textbox", {
			name: "Identificador (opcional)",
		});
		fireEvent.change(campoRf, { target: { value: "1234567" } });
		fireEvent.blur(campoRf);

		await waitFor(() => {
			expect(getMembroPorIdentificadorPaa).toHaveBeenCalledWith(
				"uuid-123",
				"1234567",
			);
			expect(
				container.querySelector(
					'input[name="listaPresentesPadrao[0].nome"]',
				).value,
			).toBe("Membro da Associação");
		});

		fireEvent.click(getByText("Confirmar"));

		await waitFor(() => {
			expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
				"Participante inserido com sucesso",
			);
		});
	});
});
