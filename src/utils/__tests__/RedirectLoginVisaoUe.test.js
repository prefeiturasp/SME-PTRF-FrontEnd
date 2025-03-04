import { visoesService } from "../../services/visoes.service";
import { RedirectLoginVisaoUe } from "../RedirectLoginVisaoUe";

jest.mock("../../services/visoes.service", () => ({
    visoesService: {
        getDadosDoUsuarioLogado: jest.fn(),
        redirectVisao: jest.fn()
    }
}));

describe("RedirectLoginVisaoUe", () => {
    it("deve chamar redirectVisao com o nome da visão selecionada se houver visão selecionada", () => {
        visoesService.getDadosDoUsuarioLogado.mockReturnValue({
            visao_selecionada: { nome: "UE" }
        });

        RedirectLoginVisaoUe();

        expect(visoesService.redirectVisao).toHaveBeenCalledWith("UE");
    });

    it("não deve chamar redirectVisao se visao_selecionada for undefined", () => {
        visoesService.getDadosDoUsuarioLogado.mockReturnValue({});

        RedirectLoginVisaoUe();

        expect(visoesService.redirectVisao).not.toHaveBeenCalled();
    });

    it("não deve chamar redirectVisao se getDadosDoUsuarioLogado retornar null", () => {
        visoesService.getDadosDoUsuarioLogado.mockReturnValue(null);

        RedirectLoginVisaoUe();

        expect(visoesService.redirectVisao).not.toHaveBeenCalled();
    });

    it("deve retornar null", () => {
        const result = RedirectLoginVisaoUe();
        expect(result).toBeNull();
    });
});
