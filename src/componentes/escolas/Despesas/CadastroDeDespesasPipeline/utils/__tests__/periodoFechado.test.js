import {periodoFechado, periodoFechadoImposto} from "../periodoFechado";
import {getPeriodoFechadoCached} from "../getPeriodoFechadoCached";

jest.mock("../getPeriodoFechadoCached", () => ({
    getPeriodoFechadoCached: jest.fn(),
}));

describe("periodoFechado", () => {
    let setBtn, setShow, setCampos, onErro;

    beforeEach(() => {
        setBtn = jest.fn();
        setShow = jest.fn();
        setCampos = jest.fn();
        onErro = jest.fn();
        jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => jest.restoreAllMocks());

    it("libera campos quando o período aceita alterações", async () => {
        getPeriodoFechadoCached.mockResolvedValue({aceita_alteracoes: true});
        await periodoFechado("2026-03-10", setBtn, setShow, setCampos, onErro);
        expect(getPeriodoFechadoCached).toHaveBeenCalledWith("2026-03-10");
        expect(setBtn).toHaveBeenCalledWith(false);
        expect(setShow).toHaveBeenCalledWith(false);
        expect(setCampos).toHaveBeenCalledWith(false);
        expect(onErro).not.toHaveBeenCalled();
    });

    it("bloqueia campos quando o período está fechado", async () => {
        getPeriodoFechadoCached.mockResolvedValue({aceita_alteracoes: false});
        await periodoFechado("2026-03-10", setBtn, setShow, setCampos, onErro);
        expect(setBtn).toHaveBeenCalledWith(true);
        expect(setShow).toHaveBeenCalledWith(true);
        expect(setCampos).toHaveBeenCalledWith(true);
    });

    it("bloqueia e exibe erro geral quando a API falha", async () => {
        getPeriodoFechadoCached.mockRejectedValue(new Error("falha"));
        await periodoFechado("2026-03-10", setBtn, setShow, setCampos, onErro);
        expect(setBtn).toHaveBeenCalledWith(true);
        expect(setShow).toHaveBeenCalledWith(true);
        expect(setCampos).toHaveBeenCalledWith(true);
        expect(onErro).toHaveBeenCalledTimes(1);
    });
});

describe("periodoFechadoImposto", () => {
    let setBtn, setShow, setCampos, setDisable, onErro;

    beforeEach(() => {
        setBtn = jest.fn();
        setShow = jest.fn();
        setCampos = jest.fn();
        setDisable = jest.fn();
        onErro = jest.fn();
        jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => jest.restoreAllMocks());

    const executa = (impostos) =>
        periodoFechadoImposto(impostos, setBtn, setShow, setCampos, setDisable, onErro);

    it("ignora impostos sem data_transacao", async () => {
        await executa([{data_transacao: null}, {}]);
        expect(getPeriodoFechadoCached).not.toHaveBeenCalled();
        expect(setBtn).not.toHaveBeenCalled();
    });

    it("libera quando o período aceita alterações", async () => {
        getPeriodoFechadoCached.mockResolvedValue({aceita_alteracoes: true});
        await executa([{data_transacao: "2026-03-10"}]);
        expect(setBtn).toHaveBeenCalledWith(false);
        expect(setShow).toHaveBeenCalledWith(false);
        expect(setDisable).toHaveBeenCalledWith(false);
        const updater = setCampos.mock.calls[0][0];
        expect(updater({1: true})).toEqual({1: true, 0: false});
    });

    it("bloqueia quando o período está fechado", async () => {
        getPeriodoFechadoCached.mockResolvedValue({aceita_alteracoes: false});
        await executa([{data_transacao: "2026-03-10"}]);
        expect(setBtn).toHaveBeenCalledWith(true);
        expect(setShow).toHaveBeenCalledWith(true);
        expect(setDisable).toHaveBeenCalledWith(true);
        expect(setCampos.mock.calls[0][0]({})).toEqual({0: true});
    });

    it("bloqueia e exibe erro quando a API falha", async () => {
        getPeriodoFechadoCached.mockRejectedValue(new Error("x"));
        await executa([{data_transacao: "2026-03-10"}]);
        expect(setDisable).toHaveBeenCalledWith(true);
        expect(onErro).toHaveBeenCalledTimes(1);
    });
});
