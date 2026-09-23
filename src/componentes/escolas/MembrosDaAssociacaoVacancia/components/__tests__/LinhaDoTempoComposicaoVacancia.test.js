import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { LinhaDoTempoComposicaoVacancia } from "../LinhaDoTempoComposicaoVacancia";
import { useGetTimelineConsolidadaComposicaoVacancia } from "../../hooks/useGetTimelineConsolidadaComposicaoVacancia";
import { useGetDatasDeAlteracaoDaComposicaoVacancia } from "../../hooks/useGetDatasDeAlteracaoDaComposicaoVacancia";
import { useCancelarEntradaCargoComposicaoVacancia } from "../../hooks/useCancelarEntradaCargoComposicaoVacancia";
import { useCancelarSaidaCargoComposicaoVacancia } from "../../hooks/useCancelarSaidaCargoComposicaoVacancia";
import { useRegistrarSaidaCargoComposicaoVacancia } from "../../hooks/useRegistrarSaidaCargoComposicaoVacancia";
import { useNavegarParaIncluirNovoMembroVacancia } from "../../hooks/useNavegarParaIncluirNovoMembroVacancia";
import { RetornaSeTemPermissaoEdicaoHistoricoDeMembros } from "../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/useGetTimelineConsolidadaComposicaoVacancia");
jest.mock("../../hooks/useGetDatasDeAlteracaoDaComposicaoVacancia");
jest.mock("../../hooks/useCancelarEntradaCargoComposicaoVacancia");
jest.mock("../../hooks/useCancelarSaidaCargoComposicaoVacancia");
jest.mock("../../hooks/useRegistrarSaidaCargoComposicaoVacancia");
jest.mock("../../hooks/useNavegarParaIncluirNovoMembroVacancia");

jest.mock("../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros", () => ({
    RetornaSeTemPermissaoEdicaoHistoricoDeMembros: jest.fn(() => true),
}));

jest.mock("../../../../../hooks/Globais/useDataTemplate", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("../../../../Globais/DatePickerField", () => ({
    DatePickerField: ({ name, value, onChange, ...props }) => (
        <input name={name} value={value || ""} onChange={(event) => onChange(name, event.target.value)} {...props} />
    ),
}));

// Mock leve do modal genérico de confirmação (antd por baixo), seguindo o padrão de
// expor onOk/onCancel via botões simples para não depender do portal/z-index reais.
jest.mock("../../../../sme/Parametrizacoes/componentes/ModalConfirmarExclusao", () => ({
    ModalConfirmarExclusao: ({ open, onOk, onCancel, titulo, bodyText, okText, cancelText }) =>
        open ? (
            <div>
                <p>{titulo}</p>
                <div>{bodyText}</div>
                <button onClick={onOk}>{okText}</button>
                <button onClick={onCancel}>{cancelText}</button>
            </div>
        ) : null,
}));

describe("LinhaDoTempoComposicaoVacancia - modais de confirmação de cancelamento", () => {
    const mandato = { data_inicial: "2026-01-01", data_final: "2026-12-31" };
    const onSelecionarData = jest.fn();

    let mutateCancelarEntrada;
    let mutateCancelarSaida;

    const registro = {
        uuid: "registro-1",
        cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
        cargo_associacao_label: "Presidente",
        cargo_vago: false,
        cargo_vago_vigente: false,
        cargo_vigente: false,
        ocupante_vigente: true,
        eh_composicao_vigente: true,
        eh_ultimo_ocupante: false,
        pode_cancelar_entrada: true,
        pode_cancelar_saida: true,
        data_inicio_no_cargo: "2026-01-01",
        data_fim_no_cargo: "2026-12-31",
        ocupante_do_cargo: { nome: "Maria Silva" },
        tag_novo_membro: null,
        tag_vacancia: null,
    };

    const timelineConsolidada = {
        diretoria_executiva: [
            {
                cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                cargo_associacao_label: "Presidente",
                timeline: [registro],
            },
        ],
        conselho_fiscal: [],
    };

    const renderComponent = () =>
        render(
            <MemoryRouter>
                <LinhaDoTempoComposicaoVacancia
                    composicaoUuid="composicao-1"
                    mandato={mandato}
                    dataSelecionada="2026-03-01"
                    onSelecionarData={onSelecionarData}
                />
            </MemoryRouter>
        );

    // Abre o Painel de ação clicando no segmento (único) da trilha do cargo.
    const abrirPainelDoRegistro = () => {
        const segmento = screen.getByRole("button", { name: /Maria Silva/i });
        fireEvent.click(segmento);
    };

    beforeEach(() => {
        jest.clearAllMocks();

        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));

        useDataTemplate.mockReturnValue((_, __, value) => value);
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);

        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: timelineConsolidada,
            isLoading: false,
        });
        useGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: [] });

        mutateCancelarEntrada = jest.fn((_, { onSuccess }) => onSuccess());
        mutateCancelarSaida = jest.fn((_, { onSuccess }) => onSuccess());

        useCancelarEntradaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarEntradaCargoComposicaoVacancia: { mutate: mutateCancelarEntrada },
        });
        useCancelarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarSaidaCargoComposicaoVacancia: { mutate: mutateCancelarSaida },
        });
        useRegistrarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationRegistrarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useNavegarParaIncluirNovoMembroVacancia.mockReturnValue({
            navegarParaIncluirNovoMembro: jest.fn(),
        });
    });

    it("abre o modal de confirmação de cancelar entrada, sem abrir o de cancelar saída", () => {
        renderComponent();
        abrirPainelDoRegistro();

        fireEvent.click(screen.getByRole("button", { name: "Cancelar Entrada" }));

        expect(screen.getByText("Cancelar entrada no cargo")).toBeInTheDocument();
        expect(screen.queryByText("Cancelar saída do cargo")).not.toBeInTheDocument();
        expect(mutateCancelarEntrada).not.toHaveBeenCalled();
    });

    it("abre o modal de confirmação de cancelar saída, sem abrir o de cancelar entrada", () => {
        renderComponent();
        abrirPainelDoRegistro();

        fireEvent.click(screen.getByRole("button", { name: "Cancelar Saída" }));

        expect(screen.getByText("Cancelar saída do cargo")).toBeInTheDocument();
        expect(screen.queryByText("Cancelar entrada no cargo")).not.toBeInTheDocument();
        expect(mutateCancelarSaida).not.toHaveBeenCalled();
    });

    it("confirma o cancelamento de entrada, chama a mutation correta e fecha os modais", () => {
        renderComponent();
        abrirPainelDoRegistro();

        fireEvent.click(screen.getByRole("button", { name: "Cancelar Entrada" }));
        fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

        expect(mutateCancelarEntrada).toHaveBeenCalledWith({ uuid: "registro-1" }, expect.any(Object));
        expect(mutateCancelarSaida).not.toHaveBeenCalled();

        // onSuccess fecha o modal de confirmação e o Painel de ação (registroSelecionado volta a null)
        expect(screen.queryByText("Cancelar entrada no cargo")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Cancelar Entrada" })).not.toBeInTheDocument();
    });

    it("confirma o cancelamento de saída, chama a mutation correta e fecha os modais", () => {
        renderComponent();
        abrirPainelDoRegistro();

        fireEvent.click(screen.getByRole("button", { name: "Cancelar Saída" }));
        fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

        expect(mutateCancelarSaida).toHaveBeenCalledWith({ uuid: "registro-1" }, expect.any(Object));
        expect(mutateCancelarEntrada).not.toHaveBeenCalled();

        expect(screen.queryByText("Cancelar saída do cargo")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Cancelar Saída" })).not.toBeInTheDocument();
    });

    it("ao clicar em Voltar no modal de cancelar entrada, não chama a mutation e mantém o painel aberto", () => {
        renderComponent();
        abrirPainelDoRegistro();

        fireEvent.click(screen.getByRole("button", { name: "Cancelar Entrada" }));
        fireEvent.click(screen.getByRole("button", { name: "Voltar" }));

        expect(mutateCancelarEntrada).not.toHaveBeenCalled();
        expect(screen.queryByText("Cancelar entrada no cargo")).not.toBeInTheDocument();
        // Painel de ação continua aberto - o botão "Cancelar Entrada" ainda está visível
        expect(screen.getByRole("button", { name: "Cancelar Entrada" })).toBeInTheDocument();
    });

    it("ao clicar em Voltar no modal de cancelar saída, não chama a mutation e mantém o painel aberto", () => {
        renderComponent();
        abrirPainelDoRegistro();

        fireEvent.click(screen.getByRole("button", { name: "Cancelar Saída" }));
        fireEvent.click(screen.getByRole("button", { name: "Voltar" }));

        expect(mutateCancelarSaida).not.toHaveBeenCalled();
        expect(screen.queryByText("Cancelar saída do cargo")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancelar Saída" })).toBeInTheDocument();
    });
});

describe("LinhaDoTempoComposicaoVacancia - editar dados / incluir novo membro / informar saída", () => {
    const mandato = { data_inicial: "2026-01-01", data_final: "2026-12-31" };
    const onSelecionarData = jest.fn();

    let mutateRegistrarSaida;
    let navegarParaIncluirNovoMembro;

    // registro editável: ocupado, vigente na composição atual, não é um "vago vigente"
    const registroEditavel = {
        uuid: "registro-editavel",
        cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
        cargo_associacao_label: "Presidente",
        cargo_vago: false,
        cargo_vago_vigente: false,
        cargo_vigente: true,
        ocupante_vigente: true,
        eh_composicao_vigente: true,
        eh_ultimo_ocupante: false,
        pode_cancelar_entrada: false,
        pode_cancelar_saida: false,
        data_inicio_no_cargo: "2026-01-01",
        data_fim_no_cargo: "2026-12-31",
        ocupante_do_cargo: { nome: "Maria Silva" },
        tag_novo_membro: null,
        tag_vacancia: null,
    };

    // registro vago vigente: cargo em aberto agora, botão vira "Incluir novo membro"
    const registroVagoVigente = {
        ...registroEditavel,
        uuid: "registro-vago-vigente",
        cargo_vago: true,
        cargo_vago_vigente: true,
        cargo_vigente: true,
        ocupante_vigente: false,
        ocupante_do_cargo: null,
    };

    const montaTimeline = (registro) => ({
        diretoria_executiva: [
            {
                cargo_associacao: registro.cargo_associacao,
                cargo_associacao_label: registro.cargo_associacao_label,
                timeline: [registro],
            },
        ],
        conselho_fiscal: [],
    });

    const renderComponent = () =>
        render(
            <MemoryRouter>
                <LinhaDoTempoComposicaoVacancia
                    composicaoUuid="composicao-1"
                    mandato={mandato}
                    dataSelecionada="2026-03-01"
                    onSelecionarData={onSelecionarData}
                />
            </MemoryRouter>
        );

    const abrirPainel = (nomeSegmento) => {
        fireEvent.click(screen.getByRole("button", { name: new RegExp(nomeSegmento, "i") }));
    };

    beforeEach(() => {
        jest.clearAllMocks();

        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));

        useDataTemplate.mockReturnValue((_, __, value) => value);
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);

        useGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: [] });

        useCancelarEntradaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarEntradaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useCancelarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });

        mutateRegistrarSaida = jest.fn((_, { onSuccess }) => onSuccess());
        useRegistrarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationRegistrarSaidaCargoComposicaoVacancia: { mutate: mutateRegistrarSaida },
        });

        navegarParaIncluirNovoMembro = jest.fn();
        useNavegarParaIncluirNovoMembroVacancia.mockReturnValue({ navegarParaIncluirNovoMembro });
    });

    it("navega para o formulário de edição ao clicar em Editar dados", () => {
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: montaTimeline(registroEditavel),
            isLoading: false,
        });

        renderComponent();
        abrirPainel("Maria Silva");

        fireEvent.click(screen.getByRole("button", { name: "Editar" }));

        expect(mockNavigate).toHaveBeenCalledWith(
            "/cadastro-historico-de-membros-vacancia/composicao-1",
            { state: { cargo: { ...registroEditavel, cargoLabel: "Presidente" }, marcoSelecionado: "2026-03-01" } }
        );
    });

    it("desabilita o botão Editar dados quando o usuário não tem permissão", () => {
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: montaTimeline(registroEditavel),
            isLoading: false,
        });

        renderComponent();
        abrirPainel("Maria Silva");

        expect(screen.getByRole("button", { name: "Editar" })).toBeDisabled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("exibe o botão Incluir novo membro (em vez de Editar) para um cargo vago vigente", () => {
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: montaTimeline(registroVagoVigente),
            isLoading: false,
        });

        renderComponent();
        abrirPainel("Vago");

        expect(screen.getByRole("button", { name: "Incluir novo membro" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
    });

    it("ao incluir novo membro com sucesso, fecha o Painel de ação", async () => {
        navegarParaIncluirNovoMembro.mockResolvedValue(true);
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: montaTimeline(registroVagoVigente),
            isLoading: false,
        });

        renderComponent();
        abrirPainel("Vago");

        fireEvent.click(screen.getByRole("button", { name: "Incluir novo membro" }));

        expect(navegarParaIncluirNovoMembro).toHaveBeenCalledWith(
            registroVagoVigente.cargo_associacao,
            { marcoSelecionado: "2026-03-01" }
        );

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: "Incluir novo membro" })).not.toBeInTheDocument();
        });
    });

    it("quando incluir novo membro falha (cargo não está mais vago), mantém o Painel de ação aberto", async () => {
        navegarParaIncluirNovoMembro.mockResolvedValue(false);
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: montaTimeline(registroVagoVigente),
            isLoading: false,
        });

        renderComponent();
        abrirPainel("Vago");

        fireEvent.click(screen.getByRole("button", { name: "Incluir novo membro" }));

        await waitFor(() => expect(navegarParaIncluirNovoMembro).toHaveBeenCalled());

        expect(screen.getByRole("button", { name: "Incluir novo membro" })).toBeInTheDocument();
    });

    it("registra a saída ao confirmar o modal de Informar saída e fecha o Painel de ação", async () => {
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: montaTimeline(registroEditavel),
            isLoading: false,
        });

        renderComponent();
        abrirPainel("Maria Silva");

        fireEvent.click(screen.getByRole("button", { name: "Informar saída" }));

        const inputData = screen.getByLabelText(/data da saída/i);
        fireEvent.change(inputData, { target: { value: "2026-07-15" } });
        fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

        expect(mutateRegistrarSaida).toHaveBeenCalledWith(
            { uuid: "registro-editavel", data_saida: "2026-07-15" },
            expect.any(Object)
        );
        // onSuccess fecha o modal de informar saída e o Painel de ação (Modal real, com transição)
        await waitFor(() => {
            expect(screen.queryByRole("button", { name: "Informar saída" })).not.toBeInTheDocument();
        });
    });
});

describe("LinhaDoTempoComposicaoVacancia - navegação por data e marco", () => {
    const mandato = { data_inicial: "2020-01-01", data_final: "2030-12-31" };
    const onSelecionarData = jest.fn();

    const timelineVazia = { diretoria_executiva: [], conselho_fiscal: [] };

    const renderComponent = (dataSelecionada, marcos) => {
        useGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: marcos || [] });
        return render(
            <MemoryRouter>
                <LinhaDoTempoComposicaoVacancia
                    composicaoUuid="composicao-1"
                    mandato={mandato}
                    dataSelecionada={dataSelecionada}
                    onSelecionarData={onSelecionarData}
                />
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();

        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));

        useDataTemplate.mockReturnValue((_, __, value) => value);
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({ data: timelineVazia, isLoading: false });

        useCancelarEntradaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarEntradaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useCancelarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useRegistrarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationRegistrarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useNavegarParaIncluirNovoMembroVacancia.mockReturnValue({ navegarParaIncluirNovoMembro: jest.fn() });
    });

    it("chama onSelecionarData com a data escolhida no seletor de data", () => {
        const { container } = renderComponent("2026-03-01");

        // BarraSelecionaData é renderizada duas vezes na página (topo e antes da lista) - usa a primeira.
        // O prop é `dataQa` (camelCase); ao ser espalhado no <input> nativo pelo mock do
        // DatePickerField, o React renderiza o atributo em minúsculas: `dataqa`.
        const [seletor] = container.querySelectorAll('[dataqa="seletor-data-timeline"]');
        fireEvent.change(seletor, { target: { value: "2026-05-20" } });

        expect(onSelecionarData).toHaveBeenCalledWith("2026-05-20");
    });

    it("chama onSelecionarData com a data de hoje ao clicar em Hoje (mandato cobre o presente)", () => {
        renderComponent("2026-03-01");

        const [botaoHoje] = screen.getAllByRole("button", { name: "Hoje" });
        fireEvent.click(botaoHoje);

        expect(onSelecionarData).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));
    });

    it("avança para o marco seguinte (mais recente) e desabilita o botão quando já é o mais recente", () => {
        const marcos = [
            { inicio: "2026-01-01", fim: "2026-03-14" },
            { inicio: "2026-03-15", fim: "2026-12-31" },
        ];
        renderComponent("2026-03-01", marcos);

        const [botaoMaisRecente, botaoMaisAntigo] = screen.getAllByRole("button", { name: "" })
            .filter((botao) => botao.className.includes("btn-success") && botao.querySelector("svg"));

        // no marco mais antigo (index 0): não há marco mais recente que ele nesta direção -> desabilitado
        expect(botaoMaisRecente).toBeDisabled();

        fireEvent.click(botaoMaisAntigo);
        expect(onSelecionarData).toHaveBeenCalledWith("2026-03-15");
    });

    it("desabilita o botão de ir para marco mais antigo quando já está no mais antigo", () => {
        const marcos = [
            { inicio: "2026-01-01", fim: "2026-03-14" },
            { inicio: "2026-03-15", fim: "2026-12-31" },
        ];
        renderComponent("2026-01-15", marcos);

        const botoesDeNavegacao = screen
            .getAllByRole("button", { name: "" })
            .filter((botao) => botao.className.includes("btn-success") && botao.querySelector("svg"));

        expect(botoesDeNavegacao[0]).toBeDisabled();
    });
});

describe("LinhaDoTempoComposicaoVacancia - painel sem ações disponíveis", () => {
    const mandato = { data_inicial: "2026-01-01", data_final: "2026-12-31" };
    const onSelecionarData = jest.fn();

    const registroBase = {
        uuid: "registro-sem-acoes",
        cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
        cargo_associacao_label: "Presidente",
        cargo_vago: false,
        cargo_vago_vigente: false,
        cargo_vigente: false,
        ocupante_vigente: false,
        eh_composicao_vigente: true,
        eh_ultimo_ocupante: false,
        pode_cancelar_entrada: false,
        pode_cancelar_saida: false,
        data_inicio_no_cargo: "2026-01-01",
        data_fim_no_cargo: "2026-06-30",
        ocupante_do_cargo: { nome: "João Souza" },
        tag_novo_membro: null,
        tag_vacancia: null,
    };

    const montaTimeline = (registro) => ({
        diretoria_executiva: [
            {
                cargo_associacao: registro.cargo_associacao,
                cargo_associacao_label: registro.cargo_associacao_label,
                timeline: [registro],
            },
        ],
        conselho_fiscal: [],
    });

    const renderComponent = (registro) => {
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: montaTimeline(registro),
            isLoading: false,
        });
        return render(
            <MemoryRouter>
                <LinhaDoTempoComposicaoVacancia
                    composicaoUuid="composicao-1"
                    mandato={mandato}
                    dataSelecionada="2026-03-01"
                    onSelecionarData={onSelecionarData}
                />
            </MemoryRouter>
        );
    };

    const abrirPainel = () => {
        fireEvent.click(document.querySelector(".segmento-timeline"));
    };

    beforeEach(() => {
        jest.clearAllMocks();

        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));

        useDataTemplate.mockReturnValue((_, __, value) => value);
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);
        useGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: [] });

        useCancelarEntradaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarEntradaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useCancelarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useRegistrarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationRegistrarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useNavegarParaIncluirNovoMembroVacancia.mockReturnValue({ navegarParaIncluirNovoMembro: jest.fn() });
    });

    it("mostra 'Mandato anterior' quando o registro não pertence à composição vigente", () => {
        renderComponent({ ...registroBase, eh_composicao_vigente: false });
        abrirPainel();

        expect(screen.getByText(/mandato anterior/i)).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Informar saída" })).not.toBeInTheDocument();
    });

    it("mostra 'Período em que o cargo esteve vago' para um vago histórico sem ações", () => {
        renderComponent({ ...registroBase, cargo_vago: true, ocupante_do_cargo: null });
        abrirPainel();

        expect(screen.getByText(/período em que o cargo esteve vago/i)).toBeInTheDocument();
    });

    it("mostra 'Ocupação encerrada' para um ocupante que já saiu e não pode mais ser alterado", () => {
        renderComponent(registroBase);
        abrirPainel();

        expect(screen.getByText(/ocupação encerrada/i)).toBeInTheDocument();
    });

    it("fecha o Painel de ação ao clicar em Fechar", () => {
        renderComponent(registroBase);
        abrirPainel();

        expect(screen.getByText(/ocupação encerrada/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

        expect(screen.queryByText(/ocupação encerrada/i)).not.toBeInTheDocument();
    });
});

describe("LinhaDoTempoComposicaoVacancia - casos gerais de renderização", () => {
    const onSelecionarData = jest.fn();

    const renderComponent = (props = {}) =>
        render(
            <MemoryRouter>
                <LinhaDoTempoComposicaoVacancia
                    composicaoUuid="composicao-1"
                    mandato={{ data_inicial: "2026-01-01", data_final: "2026-12-31" }}
                    dataSelecionada="2026-03-01"
                    onSelecionarData={onSelecionarData}
                    {...props}
                />
            </MemoryRouter>
        );

    beforeEach(() => {
        jest.clearAllMocks();

        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));

        useDataTemplate.mockReturnValue((_, __, value) => value);
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);
        useGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: [] });
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: { diretoria_executiva: [], conselho_fiscal: [] },
            isLoading: false,
        });

        useCancelarEntradaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarEntradaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useCancelarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useRegistrarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationRegistrarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useNavegarParaIncluirNovoMembroVacancia.mockReturnValue({ navegarParaIncluirNovoMembro: jest.fn() });
    });

    it("não renderiza nada quando o mandato não tem data inicial/final", () => {
        const { container } = renderComponent({ mandato: { data_inicial: null, data_final: null } });

        expect(container).toBeEmptyDOMElement();
    });

    it("exibe o Loading enquanto a timeline consolidada está carregando", () => {
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({ data: undefined, isLoading: true });

        renderComponent();

        expect(screen.queryByText(/movimentação no cargo/i)).not.toBeInTheDocument();
        expect(document.querySelector(".LinhaDoTempoComposicaoVacancia")).not.toBeInTheDocument();
    });

    it("renderiza os cargos do Conselho Fiscal tanto na trilha quanto na lista de membros na data", () => {
        const registroConselho = {
            uuid: "registro-conselho",
            cargo_associacao: "MEMBRO_CONSELHO_FISCAL",
            cargo_associacao_label: "Membro do Conselho Fiscal",
            cargo_vago: false,
            cargo_vago_vigente: false,
            cargo_vigente: true,
            ocupante_vigente: true,
            eh_composicao_vigente: true,
            eh_ultimo_ocupante: false,
            pode_cancelar_entrada: false,
            pode_cancelar_saida: false,
            data_inicio_no_cargo: "2026-01-01",
            data_fim_no_cargo: "2026-12-31",
            ocupante_do_cargo: { nome: "Carlos Souza" },
            tag_novo_membro: null,
            tag_vacancia: null,
        };
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: {
                diretoria_executiva: [],
                conselho_fiscal: [
                    {
                        cargo_associacao: registroConselho.cargo_associacao,
                        cargo_associacao_label: registroConselho.cargo_associacao_label,
                        timeline: [registroConselho],
                    },
                ],
            },
            isLoading: false,
        });

        renderComponent();

        expect(screen.getAllByTitle("Membro do Conselho Fiscal").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Carlos Souza").length).toBeGreaterThan(0);
    });

    it("renderiza a BarraSelecionaData exatamente duas vezes, ambas corretamente configuradas com o mandato e a data selecionada", () => {
        const mandato = { data_inicial: "2026-01-01", data_final: "2026-12-31" };
        renderComponent({ mandato, dataSelecionada: "2026-03-01" });

        const seletores = document.querySelectorAll('[dataqa="seletor-data-timeline"]');
        expect(seletores).toHaveLength(2);

        seletores.forEach((seletor) => {
            expect(seletor).toHaveValue("2026-03-01");
            expect(seletor.getAttribute("mindate")).toContain("2026");
            expect(seletor.getAttribute("mindate")).not.toBe(seletor.getAttribute("maxdate"));
        });

        // "Movimentação no cargo" também deve aparecer só duas vezes, uma por barra
        expect(screen.getAllByText(/movimentação no cargo/i)).toHaveLength(2);
    });
});

describe("LinhaDoTempoComposicaoVacancia - navegação por marco (chevron esquerdo) e fechar informar saída sem confirmar", () => {
    const mandato = { data_inicial: "2026-01-01", data_final: "2026-12-31" };
    const onSelecionarData = jest.fn();

    const registro = {
        uuid: "registro-1",
        cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
        cargo_associacao_label: "Presidente",
        cargo_vago: false,
        cargo_vago_vigente: false,
        cargo_vigente: true,
        ocupante_vigente: true,
        eh_composicao_vigente: true,
        eh_ultimo_ocupante: false,
        pode_cancelar_entrada: false,
        pode_cancelar_saida: false,
        data_inicio_no_cargo: "2026-01-01",
        data_fim_no_cargo: "2026-12-31",
        ocupante_do_cargo: { nome: "Maria Silva" },
        tag_novo_membro: null,
        tag_vacancia: null,
    };

    const marcos = [
        { inicio: "2026-01-01", fim: "2026-03-14" },
        { inicio: "2026-03-15", fim: "2026-12-31" },
    ];

    const renderComponent = (dataSelecionada) =>
        render(
            <MemoryRouter>
                <LinhaDoTempoComposicaoVacancia
                    composicaoUuid="composicao-1"
                    mandato={mandato}
                    dataSelecionada={dataSelecionada}
                    onSelecionarData={onSelecionarData}
                />
            </MemoryRouter>
        );

    beforeEach(() => {
        jest.clearAllMocks();

        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));

        useDataTemplate.mockReturnValue((_, __, value) => value);
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);
        useGetDatasDeAlteracaoDaComposicaoVacancia.mockReturnValue({ data: marcos });
        useGetTimelineConsolidadaComposicaoVacancia.mockReturnValue({
            data: {
                diretoria_executiva: [
                    { cargo_associacao: registro.cargo_associacao, cargo_associacao_label: registro.cargo_associacao_label, timeline: [registro] },
                ],
                conselho_fiscal: [],
            },
            isLoading: false,
        });

        useCancelarEntradaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarEntradaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useCancelarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationCancelarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useRegistrarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationRegistrarSaidaCargoComposicaoVacancia: { mutate: jest.fn() },
        });
        useNavegarParaIncluirNovoMembroVacancia.mockReturnValue({ navegarParaIncluirNovoMembro: jest.fn() });
    });

    it("volta para o marco anterior (mais antigo) ao clicar no chevron esquerdo quando habilitado", () => {
        // no marco mais recente (index 1): chevron esquerdo (irParaMarco(1) -> marcos[0]) fica habilitado
        renderComponent("2026-03-15");

        const [chevronEsquerdo] = screen
            .getAllByRole("button", { name: "" })
            .filter((botao) => botao.querySelector(".fa-chevron-left"));

        expect(chevronEsquerdo).toBeEnabled();
        fireEvent.click(chevronEsquerdo);

        expect(onSelecionarData).toHaveBeenCalledWith("2026-01-01");
    });

    it("fecha o modal de Informar saída ao clicar em Cancelar, sem registrar nenhuma saída", () => {
        const mutateRegistrarSaida = jest.fn();
        useRegistrarSaidaCargoComposicaoVacancia.mockReturnValue({
            mutationRegistrarSaidaCargoComposicaoVacancia: { mutate: mutateRegistrarSaida },
        });

        renderComponent("2026-03-15");

        fireEvent.click(screen.getByRole("button", { name: /Maria Silva/i }));
        fireEvent.click(screen.getByRole("button", { name: "Informar saída" }));

        expect(screen.getByText("Informar saída do cargo")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

        expect(mutateRegistrarSaida).not.toHaveBeenCalled();
        // Painel de ação continua aberto - só o modal de informar saída fechou
        expect(screen.getByRole("button", { name: "Informar saída" })).toBeInTheDocument();
    });
});
