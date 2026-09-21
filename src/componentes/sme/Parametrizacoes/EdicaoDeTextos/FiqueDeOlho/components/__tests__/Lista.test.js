import { render, screen, fireEvent } from "@testing-library/react";
import { Lista } from "../Lista";

import { useFiqueDeOlhoContext } from "../../hooks/useFiqueDeOlhoContext";
import { visoesService } from "../../../../../../../services/visoes.service";

jest.mock("../../hooks/useFiqueDeOlhoContext");

jest.mock("../../../../../../../services/visoes.service", () => ({
    visoesService: {
        featureFlagAtiva: jest.fn(),
    },
}));

jest.mock("../ModalForm", () => ({
    ModalForm: () => <div data-testid="modal-form-stub" />,
}));

jest.mock("../Paginacao", () => ({
    Paginacao: () => <div data-testid="paginacao-stub" />,
}));

const registroPrestacaoContas = {
    id: 1,
    uuid: "texto-1",
    tipo_texto: "associacoes_prestacao_contas",
    tipo_texto_display: "ASSOCIAÇÕES - Prestação de Contas",
    texto: "<p>Texto de prestação de contas</p>",
    recurso: "recurso-1",
};

const registroHistoricoDeMembros = {
    id: 2,
    uuid: "texto-2",
    tipo_texto: "associacoes_historico_membros",
    tipo_texto_display: "ASSOCIAÇÕES - Histórico de Membros",
    texto: "<p>Texto de histórico de membros</p>",
    recurso: "recurso-1",
};

describe("Lista", () => {
    const setStateFormModal = jest.fn();
    const setBloquearBtnSalvarForm = jest.fn();
    const mutationPost = { mutate: jest.fn() };
    const mutationPatch = { mutate: jest.fn() };

    const montarContexto = (overrides = {}) => ({
        stateFormModal: {},
        setStateFormModal,
        setBloquearBtnSalvarForm,
        isLoadingFiqueDeOlho: false,
        dataFiqueDeOlho: { results: [registroPrestacaoContas, registroHistoricoDeMembros] },
        countFiqueDeOlho: 2,
        mutationPost,
        mutationPatch,
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        visoesService.featureFlagAtiva.mockReturnValue(false);
    });

    it("deve exibir o carregamento enquanto os dados estiverem sendo buscados", () => {
        useFiqueDeOlhoContext.mockReturnValue(
            montarContexto({ isLoadingFiqueDeOlho: true, dataFiqueDeOlho: { results: [] } })
        );

        render(<Lista />);

        expect(screen.queryByTestId("tabela-lista-fique-de-olho")).not.toBeInTheDocument();
    });

    it("deve exibir a mensagem de nenhum resultado quando não houver registros", () => {
        useFiqueDeOlhoContext.mockReturnValue(
            montarContexto({ dataFiqueDeOlho: { results: [] }, countFiqueDeOlho: 0 })
        );

        render(<Lista />);

        expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
        expect(screen.queryByTestId("tabela-lista-fique-de-olho")).not.toBeInTheDocument();
    });

    it("não deve exibir o registro de histórico de membros quando a flag historico-de-membros-v2 estiver inativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(false);
        useFiqueDeOlhoContext.mockReturnValue(montarContexto());

        render(<Lista />);

        expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith("historico-de-membros-v2");
        expect(
            screen.getByText("ASSOCIAÇÕES - Prestação de Contas")
        ).toBeInTheDocument();
        expect(
            screen.queryByText("ASSOCIAÇÕES - Histórico de Membros")
        ).not.toBeInTheDocument();
    });

    it("deve exibir o registro de histórico de membros quando a flag historico-de-membros-v2 estiver ativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(true);
        useFiqueDeOlhoContext.mockReturnValue(montarContexto());

        render(<Lista />);

        expect(
            screen.getByText("ASSOCIAÇÕES - Histórico de Membros")
        ).toBeInTheDocument();
    });

    it("deve exibir a mensagem de nenhum resultado quando só houver o registro de histórico de membros e a flag estiver inativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(false);
        useFiqueDeOlhoContext.mockReturnValue(
            montarContexto({
                dataFiqueDeOlho: { results: [registroHistoricoDeMembros] },
                countFiqueDeOlho: 1,
            })
        );

        render(<Lista />);

        expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
    });

    it("deve chamar setStateFormModal com os dados do registro ao clicar em editar", () => {
        useFiqueDeOlhoContext.mockReturnValue(montarContexto());

        render(<Lista />);

        const botoesEditar = screen.getAllByTestId("btn-editar-fique-de-olho");
        fireEvent.click(botoesEditar[0]);

        expect(setStateFormModal).toHaveBeenCalledWith(
            expect.objectContaining({
                texto: registroPrestacaoContas.texto,
                tipo_texto: registroPrestacaoContas.tipo_texto,
                uuid: registroPrestacaoContas.uuid,
                id: registroPrestacaoContas.id,
                isOpen: true,
                recurso_uuid: registroPrestacaoContas.recurso,
            })
        );
    });
});
