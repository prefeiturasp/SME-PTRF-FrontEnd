import { render, screen, fireEvent } from "@testing-library/react";
import { ModalForm } from "../ModalForm";

import { useFiqueDeOlhoContext } from "../../hooks/useFiqueDeOlhoContext";
import { useRecursoSelecionadoContext } from "../../../../../../../context/RecursoSelecionado";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { visoesService } from "../../../../../../../services/visoes.service";

jest.mock("../../hooks/useFiqueDeOlhoContext");

jest.mock("../../../../../../../context/RecursoSelecionado", () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../../../services/visoes.service", () => ({
    visoesService: {
        featureFlagAtiva: jest.fn(),
    },
}));

jest.mock("../../../../../../Globais/EditorWysiwyg", () => ({
    __esModule: true,
    default: ({ textoInicialEditor, handleChange, disabled }) => (
        <textarea
            data-testid="editor-wysiwyg"
            value={textoInicialEditor || ""}
            disabled={disabled}
            onChange={(e) => handleChange(e.target.value)}
        />
    ),
}));

const tiposDeTexto = [
    ["associacoes_prestacao_contas", "ASSOCIAÇÕES - Prestação de Contas"],
    ["associacoes_historico_membros", "ASSOCIAÇÕES - Histórico de Membros"],
    ["diretorias_consolidado_das_pcs", "DIRETORIAS - Consolidado das PCs"],
];

const recursos = [{ uuid: "recurso-1", nome: "PTRF Básico" }];

describe("ModalForm", () => {
    const handleCloseModalForm = jest.fn();

    const montarContexto = (overrides = {}) => ({
        stateFormModal: {
            isOpen: true,
            uuid: "",
            id: "",
            tipo_texto: "",
            texto: "",
            recurso_uuid: "",
        },
        bloquearBtnSalvarForm: false,
        handleCloseModalForm,
        dataTabelaFiqueDeOlho: { tipos_de_texto: tiposDeTexto },
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        useRecursoSelecionadoContext.mockReturnValue({ recursos });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.featureFlagAtiva.mockReturnValue(false);
    });

    it("não deve renderizar o formulário quando o modal estiver fechado", () => {
        useFiqueDeOlhoContext.mockReturnValue(
            montarContexto({ stateFormModal: { ...montarContexto().stateFormModal, isOpen: false } })
        );

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(screen.queryByText("Adicionar texto do fique de olho")).not.toBeInTheDocument();
    });

    it("deve exibir o título de adição quando não houver uuid", () => {
        useFiqueDeOlhoContext.mockReturnValue(montarContexto());

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(screen.getByText("Adicionar texto do fique de olho")).toBeInTheDocument();
    });

    it("deve exibir o título de edição quando houver uuid", () => {
        useFiqueDeOlhoContext.mockReturnValue(
            montarContexto({
                stateFormModal: { ...montarContexto().stateFormModal, uuid: "texto-1" },
            })
        );

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(screen.getByText("Editar texto do fique de olho")).toBeInTheDocument();
    });

    it("não deve exibir a opção de histórico de membros quando a flag historico-de-membros-v2 estiver inativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(false);
        useFiqueDeOlhoContext.mockReturnValue(montarContexto());

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith("historico-de-membros-v2");
        expect(
            screen.queryByRole("option", { name: "ASSOCIAÇÕES - Histórico de Membros" })
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: "ASSOCIAÇÕES - Prestação de Contas" })
        ).toBeInTheDocument();
    });

    it("deve exibir a opção de histórico de membros quando a flag historico-de-membros-v2 estiver ativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(true);
        useFiqueDeOlhoContext.mockReturnValue(montarContexto());

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(
            screen.getByRole("option", { name: "ASSOCIAÇÕES - Histórico de Membros" })
        ).toBeInTheDocument();
    });

    it("deve chamar handleCloseModalForm ao clicar em cancelar", () => {
        useFiqueDeOlhoContext.mockReturnValue(montarContexto());

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        fireEvent.click(screen.getByTestId("btn-cancelar-formulario"));

        expect(handleCloseModalForm).toHaveBeenCalledTimes(1);
    });

    it("deve desabilitar o botão salvar quando o usuário não tiver permissão de edição", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
        useFiqueDeOlhoContext.mockReturnValue(montarContexto());

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(screen.getByTestId("btn-salvar-formulario-fique-de-olho")).toBeDisabled();
    });

    it("deve desabilitar o botão salvar quando bloquearBtnSalvarForm for verdadeiro", () => {
        useFiqueDeOlhoContext.mockReturnValue(montarContexto({ bloquearBtnSalvarForm: true }));

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(screen.getByTestId("btn-salvar-formulario-fique-de-olho")).toBeDisabled();
    });

    it("deve habilitar o botão salvar quando houver permissão e não estiver bloqueado", () => {
        useFiqueDeOlhoContext.mockReturnValue(montarContexto());

        render(<ModalForm handleSubmitFormModal={jest.fn()} />);

        expect(screen.getByTestId("btn-salvar-formulario-fique-de-olho")).toBeEnabled();
    });
});
