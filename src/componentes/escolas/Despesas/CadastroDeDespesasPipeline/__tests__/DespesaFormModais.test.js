import React from "react";
import {render, screen} from "@testing-library/react";
import {DespesaFormModais} from "../DespesaFormModais";
import {visoesService} from "../../../../../services/visoes.service";
import {metodosAuxiliares} from "../utils";

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {getItemUsuarioLogado: jest.fn()},
}));
jest.mock("../utils", () => ({
    metodosAuxiliares: {onCancelarTrue: jest.fn()},
}));
jest.mock("../modals/ModalErroDeletarCadastroDespesa", () => ({
    ModalErroDeletarCadastroDespesa: (p) => <button data-testid="m-erro-deletar" onClick={p.handleClose}>{p.texto}|{String(p.show)}|{p.titulo}</button>,
}));
jest.mock("../../../../../utils/Modais", () => ({
    CancelarModal: (p) => <button data-testid="cancelar" onClick={p.onCancelarTrue} onBlur={p.handleClose}>{String(p.show)}</button>,
    AvisoCapitalModal: (p) => <button data-testid="aviso-capital" onClick={p.handleClose}>{String(p.show)}</button>,
    DeletarModal: (p) => (
        <div>
            <button data-testid="deletar" onClick={p.onDeletarTrue}>{p.texto}</button>
            <button data-testid="deletar-close" onClick={p.handleClose} />
        </div>
    ),
    PeriodoFechado: (p) => <button data-testid="periodo-fechado" onClick={p.handleClose} />,
    PeriodoFechadoImposto: (p) => <button data-testid="periodo-fechado-imposto" onClick={p.handleClose} />,
    ErroGeral: (p) => <button data-testid="erro-geral" onClick={p.handleClose} />,
}));

const props = (extra = {}) => ({
    show: true,
    setShow: jest.fn(),
    setLoading: jest.fn(),
    origem: "origem",
    parametroLocation: {state: {}},
    showAvisoCapital: true,
    setShowAvisoCapital: jest.fn(),
    despesaContext: {idDespesa: 10},
    showDelete: true,
    setShowDelete: jest.fn(),
    onDeletarTrue: jest.fn(),
    textoModalDelete: "confirma?",
    showPeriodoFechado: false,
    setShowPeriodoFechado: jest.fn(),
    showPeriodoFechadoImposto: false,
    setShowPeriodoFechadoImposto: jest.fn(),
    showErroGeral: false,
    setShowErroGeral: jest.fn(),
    showModalErroDeletarDespesa: true,
    setShowModalErroDeletarDespesa: jest.fn(),
    textoModalErroDeletarDespesa: "erro",
    ...extra,
});

describe("DespesaFormModais", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        visoesService.getItemUsuarioLogado.mockReturnValue("UE");
    });

    it("renderiza todos os modais para visão UE com despesa existente", () => {
        render(<DespesaFormModais {...props()} />);
        expect(screen.getByTestId("cancelar")).toBeInTheDocument();
        expect(screen.getByTestId("aviso-capital")).toBeInTheDocument();
        expect(screen.getByTestId("deletar")).toHaveTextContent("confirma?");
        expect(screen.getByTestId("periodo-fechado")).toBeInTheDocument();
        expect(screen.getByTestId("periodo-fechado-imposto")).toBeInTheDocument();
        expect(screen.getByTestId("erro-geral")).toBeInTheDocument();
        expect(screen.getByTestId("m-erro-deletar")).toHaveTextContent("erro|true|Exclusão de Despesa");
    });

    it("não renderiza PeriodoFechado fora da visão UE", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue("DRE");
        render(<DespesaFormModais {...props()} />);
        expect(screen.queryByTestId("periodo-fechado")).not.toBeInTheDocument();
    });

    it("não renderiza DeletarModal sem idDespesa", () => {
        render(<DespesaFormModais {...props({despesaContext: {idDespesa: null}})} />);
        expect(screen.queryByTestId("deletar")).not.toBeInTheDocument();
    });

    it("onCancelarTrue delega para metodosAuxiliares.onCancelarTrue", () => {
        const p = props();
        render(<DespesaFormModais {...p} />);
        screen.getByTestId("cancelar").click();
        expect(metodosAuxiliares.onCancelarTrue).toHaveBeenCalledWith(p.setShow, p.setLoading, p.origem, p.parametroLocation);
    });

    it("handleClose de cada modal chama o setter correspondente com false", () => {
        const p = props();
        render(<DespesaFormModais {...p} />);
        screen.getByTestId("cancelar").focus();
        screen.getByTestId("cancelar").blur();
        expect(p.setShow).toHaveBeenCalledWith(false);
        screen.getByTestId("aviso-capital").click();
        expect(p.setShowAvisoCapital).toHaveBeenCalledWith(false);
        screen.getByTestId("deletar-close").click();
        expect(p.setShowDelete).toHaveBeenCalledWith(false);
        screen.getByTestId("periodo-fechado").click();
        expect(p.setShowPeriodoFechado).toHaveBeenCalledWith(false);
        screen.getByTestId("periodo-fechado-imposto").click();
        expect(p.setShowPeriodoFechadoImposto).toHaveBeenCalledWith(false);
        screen.getByTestId("erro-geral").click();
        expect(p.setShowErroGeral).toHaveBeenCalledWith(false);
        screen.getByTestId("m-erro-deletar").click();
        expect(p.setShowModalErroDeletarDespesa).toHaveBeenCalledWith(false);
    });

    it("onDeletarTrue repassa argumentos do contexto", () => {
        const p = props();
        render(<DespesaFormModais {...p} />);
        screen.getByTestId("deletar").click();
        expect(p.onDeletarTrue).toHaveBeenCalledWith(p.setShowDelete, p.setLoading, p.despesaContext, p.origem);
    });
});
