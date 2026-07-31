import {
    getPeriodoFechadoCached,
    limparCachePeriodoFechado,
} from "../getPeriodoFechadoCached";
import {getPeriodoFechado} from "../../../../../../services/escolas/Associacao.service";

jest.mock("../../../../../../services/escolas/Associacao.service", () => ({
    getPeriodoFechado: jest.fn(),
}));

jest.mock("../../../../../../utils/AssociacaoUtils", () => ({
    getUuidAssociacao: () => "assoc-uuid-teste",
}));

describe("getPeriodoFechadoCached", () => {
    beforeEach(() => {
        limparCachePeriodoFechado();
        jest.clearAllMocks();
    });

    it("chama a API só uma vez para a mesma data", async () => {
        const payload = {aceita_alteracoes: true, periodo_referencia: "2026.1"};
        getPeriodoFechado.mockResolvedValue(payload);

        const [a, b] = await Promise.all([
            getPeriodoFechadoCached("2026-03-15"),
            getPeriodoFechadoCached("2026-03-15"),
        ]);

        expect(getPeriodoFechado).toHaveBeenCalledTimes(1);
        expect(a).toEqual(payload);
        expect(b).toEqual(payload);
    });

    it("reusa o cache em chamadas sequenciais", async () => {
        getPeriodoFechado.mockResolvedValue({aceita_alteracoes: false});

        await getPeriodoFechadoCached("2026-01-01");
        await getPeriodoFechadoCached("2026-01-01");

        expect(getPeriodoFechado).toHaveBeenCalledTimes(1);
    });

    it("busca de novo para data diferente", async () => {
        getPeriodoFechado.mockResolvedValue({aceita_alteracoes: true});

        await getPeriodoFechadoCached("2026-01-01");
        await getPeriodoFechadoCached("2026-02-01");

        expect(getPeriodoFechado).toHaveBeenCalledTimes(2);
    });
});
