import { useParams } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useGetStatusDelecaoBemProduzido } from "../../hooks/useGetStatusDelecaoBemProduzido";

export const ButtonExcluirBemProduzido = ({ handleDelete }) => {
    const { uuid } = useParams()

    const {
        error,
        isLoading: estaCarregandoConfirmacaoStatusDelecao,
        isError: erroConfirmacaoStatusDelecao
    } = useGetStatusDelecaoBemProduzido(uuid);

    let mensagemTipoBloqueioDelecao = error?.response?.data?.titulo


    return (
        <>
            { uuid && (
                <>
                    <span
                        data-tooltip-id="confirmacao-status-delecao"
                        data-tooltip-content={ mensagemTipoBloqueioDelecao }
                    >
                        <button
                            type="button"
                            className="btn btn-danger float-right"
                            disabled={
                                estaCarregandoConfirmacaoStatusDelecao ||
                                erroConfirmacaoStatusDelecao
                            }
                            onClick={ handleDelete }
                        >
                            Excluir bem
                        </button>
                    </span>

                    <ReactTooltip id="confirmacao-status-delecao" />
                </>
            )}
        </>
    );
}
