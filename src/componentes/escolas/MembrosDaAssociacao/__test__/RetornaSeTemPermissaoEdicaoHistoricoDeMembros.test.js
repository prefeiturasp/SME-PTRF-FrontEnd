import { RetornaSeTemPermissaoEdicaoHistoricoDeMembros } from "../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        getPermissoes: jest.fn(),
    },
}));

describe("RetornaSeTemPermissaoEdicaoHistoricoDeMembros", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve chamar getPermissoes com o parâmetro correto", () => {
        visoesService.getPermissoes.mockReturnValue(true);

        const resultado = RetornaSeTemPermissaoEdicaoHistoricoDeMembros();

        expect(visoesService.getPermissoes).toHaveBeenCalledTimes(1);
        expect(visoesService.getPermissoes).toHaveBeenCalledWith([
            "change_associacao",
        ]);
        expect(resultado).toBe(true);
    });

    it("deve retornar false quando o serviço retornar false", () => {
        visoesService.getPermissoes.mockReturnValue(false);

        const resultado = RetornaSeTemPermissaoEdicaoHistoricoDeMembros();

        expect(resultado).toBe(false);
    });
});