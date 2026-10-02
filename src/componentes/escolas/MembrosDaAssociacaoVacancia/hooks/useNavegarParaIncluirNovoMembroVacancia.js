import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getCargosDaComposicaoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";
import { extraiMensagemDeErroVacancia } from "../utils/extraiMensagemDeErroVacancia";

// Busca o cargo pelo mesmo endpoint que a listagem usa, em vez de navegar direto com um
// objeto "cargo" que pode estar desatualizado (ex.: outra pessoa já preencheu o cargo
// vago nesse intervalo, entre a composição ser carregada e o clique no botão). Só
// navega para o formulário quando o cargo ainda está confirmadamente vago e vigente.
// A ideia é incluir somente no último cargo vago (considerando que pode haver vários cargos vagos durante o mandado).
// Sendo assim, não deve ser possível incluir novo membro no meio de um período entre duas ocupações.
export const useNavegarParaIncluirNovoMembroVacancia = (composicaoUuid) => {
    const navigate = useNavigate();

    const navegarParaIncluirNovoMembro = async (cargoAssociacao, { marcoSelecionado } = {}) => {
        let cargoVagoVigente;
        try {
            const cargos = await getCargosDaComposicaoVacancia(composicaoUuid, moment().format("YYYY-MM-DD"));
            const todosOsCargos = [...(cargos?.diretoria_executiva || []), ...(cargos?.conselho_fiscal || [])];
            // Obtem o último cargo vago vigente
            cargoVagoVigente = todosOsCargos.find((item) => item.cargo_associacao === cargoAssociacao);
        } catch (error) {
            toastCustom.ToastCustomError("Erro ao carregar o cargo.", extraiMensagemDeErroVacancia(error));
            return false;
        }
        if (!cargoVagoVigente?.cargo_vago_vigente) {
            toastCustom.ToastCustomError(
                "Não foi possível incluir um novo membro.",
                "O cargo não está mais vago. Atualize a listagem e tente novamente."
            );
            return false;
        }

        navigate(`/cadastro-historico-de-membros-vacancia/${composicaoUuid}`, {
            state: { cargo: cargoVagoVigente, marcoSelecionado },
        });
        return true;
    };

    return { navegarParaIncluirNovoMembro };
};
