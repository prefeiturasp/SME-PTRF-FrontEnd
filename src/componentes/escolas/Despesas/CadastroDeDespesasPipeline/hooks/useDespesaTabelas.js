import {useEffect, useState} from "react";
import {
    getDespesasTabelas,
    getEspecificacoesPorAplicacao,
} from "../../../../../services/escolas/Despesas.service";
import {getUuidAssociacao} from "../../../../../utils/AssociacaoUtils";
import {metodosAuxiliares} from "../utils";

/**
 * Carrega tabelas de despesa, especificações de custeio/capital e controla loading inicial.
 * Usa /especificacoes/por-aplicacao/ (só tela pipeline / flag despesas-pipeline).
 */
export const useDespesaTabelas = ({
    parametroLocation,
    veioDeSituacaoPatrimonial,
    visao_selecionada,
}) => {
    const aux = metodosAuxiliares;
    const [despesasTabelas, setDespesasTabelas] = useState([]);
    const [especificaoes_capital, set_especificaoes_capital] = useState("");
    const [especificacoes_custeio, set_especificacoes_custeio] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const tabelasPromise = (() => {
                if (aux.origemAnaliseLancamento(parametroLocation)) {
                    return getDespesasTabelas(parametroLocation.state.uuid_associacao);
                }
                if (veioDeSituacaoPatrimonial && visao_selecionada === "DRE") {
                    return getDespesasTabelas(getUuidAssociacao());
                }
                return getDespesasTabelas();
            })();

            const [resp, especificacoes] = await Promise.all([
                tabelasPromise,
                getEspecificacoesPorAplicacao(),
            ]);

            setDespesasTabelas(resp);
            set_especificacoes_custeio(especificacoes?.custeio_por_tipo || {});
            set_especificaoes_capital(especificacoes?.capital || []);
            setLoading(false);
        };
        carregaTabelasDespesas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        despesasTabelas,
        setDespesasTabelas,
        especificaoes_capital,
        especificacoes_custeio,
        set_especificacoes_custeio,
        loading,
        setLoading,
    };
};
