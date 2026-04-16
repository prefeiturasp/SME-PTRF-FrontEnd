import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from "../RetornaSeTemPermissaoEdicaoGestaoUsuarios";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
        getPermissoes: jest.fn()
    }
}));

describe("utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return UE permission result when selected view is UE", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue("UE");
        visoesService.getPermissoes.mockReturnValue(true);

        const result = RetornaSeTemPermissaoEdicaoGestaoUsuarios();

        expect(result).toBe(true);
        expect(visoesService.getItemUsuarioLogado).toHaveBeenCalledWith("visao_selecionada.nome");
        expect(visoesService.getPermissoes).toHaveBeenCalledWith(["change_gestao_usuarios_ue"]);
    });

    it("should return DRE permission result when selected view is DRE", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue("DRE");
        visoesService.getPermissoes.mockReturnValue(false);

        const result = RetornaSeTemPermissaoEdicaoGestaoUsuarios();

        expect(result).toBe(false);
        expect(visoesService.getPermissoes).toHaveBeenCalledWith(["change_gestao_usuarios_dre"]);
    });

    it("should return SME permission result when selected view is SME", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue("SME");
        visoesService.getPermissoes.mockReturnValue("permitted");

        const result = RetornaSeTemPermissaoEdicaoGestaoUsuarios();

        expect(result).toBe("permitted");
        expect(visoesService.getPermissoes).toHaveBeenCalledWith(["change_gestao_usuarios_sme"]);
    });

    it("should return undefined and not request permissions when selected view is unknown", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue("OUTRA_VISAO");

        const result = RetornaSeTemPermissaoEdicaoGestaoUsuarios();

        expect(result).toBeUndefined();
        expect(visoesService.getPermissoes).not.toHaveBeenCalled();
    });

    it("should return undefined and not request permissions when selected view is missing", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue(undefined);

        const result = RetornaSeTemPermissaoEdicaoGestaoUsuarios();

        expect(result).toBeUndefined();
        expect(visoesService.getPermissoes).not.toHaveBeenCalled();
    });

    it("should return undefined and not request permissions when selected view is null", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue(null);

        const result = RetornaSeTemPermissaoEdicaoGestaoUsuarios();

        expect(result).toBeUndefined();
        expect(visoesService.getPermissoes).not.toHaveBeenCalled();
    });

    it("should treat lowercase view as invalid and return undefined", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue("ue");

        const result = RetornaSeTemPermissaoEdicaoGestaoUsuarios();

        expect(result).toBeUndefined();
        expect(visoesService.getPermissoes).not.toHaveBeenCalled();
    });
});