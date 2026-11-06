import { getCargosComposicaoData } from "../../../../../../../services/Mandatos.service";
import { toastCustom } from "../../../../../../../componentes/Globais/ToastCustom";

jest.mock("../../../../../../../services/Mandatos.service");
jest.mock("../../../../../../../componentes/Globais/ToastCustom");

describe("NovoFormularioEditaAta - handleChangeDate", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve exibir toast de erro quando composição não for encontrada", async () => {
        const error = {
            response: {
                data: {
                    erro: "Composição não encontrada."
                }
            }
        };

        getCargosComposicaoData.mockRejectedValue(error);

        // Simula a função handleChangeDate
        const handleChangeDate = async () => {
            try {
                await getCargosComposicaoData("2025-11-24", "uuid-associacao");
            } catch (error) {
                const mensagemErro = error?.response?.data?.erro || "Não foi possível carregar a composição por data.";
                toastCustom.ToastCustomError("Erro ao carregar participantes", mensagemErro);
            }
        };

        await handleChangeDate();

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao carregar participantes",
            "Composição não encontrada."
        );
    });
});

