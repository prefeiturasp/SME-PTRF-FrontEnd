import { RetornaSeTemPermissaoEdicaoAcompanhamentoDePc } from "../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        getPermissoes: jest.fn(),
    },
}));

describe("RetornaSeTemPermissaoEdicaoAcompanhamentoDePc", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve chamar getPermissoes com o parâmetro correto", () => {
        visoesService.getPermissoes.mockReturnValue(true);

        const resultado = RetornaSeTemPermissaoEdicaoAcompanhamentoDePc();

        expect(visoesService.getPermissoes).toHaveBeenCalledTimes(1);
        expect(visoesService.getPermissoes).toHaveBeenCalledWith([
            "change_acompanhamento_pcs_dre",
        ]);
        expect(resultado).toBe(true);
    });

    it("deve retornar false quando o serviço retornar false", () => {
        visoesService.getPermissoes.mockReturnValue(false);

        const resultado = RetornaSeTemPermissaoEdicaoAcompanhamentoDePc();

        expect(resultado).toBe(false);
    });
});
