import {useEffect, useState} from "react";
import {
    getDespesasTabelas,
    getEspecificacoesCapital,
    getEspecificacoesCusteio,
} from "../../../../../services/escolas/Despesas.service";
import {getUuidAssociacao} from "../../../../../utils/AssociacaoUtils";
import {metodosAuxiliares} from "../utils";

/**
 * Carrega tabelas de despesa, especificações de custeio/capital e controla loading inicial.
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
            let resp;

            if (aux.origemAnaliseLancamento(parametroLocation)) {
                resp = await getDespesasTabelas(parametroLocation.state.uuid_associacao);
            } else if (veioDeSituacaoPatrimonial && visao_selecionada === "DRE") {
                const uuid_associacao = getUuidAssociacao();
                resp = await getDespesasTabelas(uuid_associacao);
            } else {
                resp = await getDespesasTabelas();
            }

            setDespesasTabelas(resp);

            const array_tipos_custeio = resp.tipos_custeio || [];
            let let_especificacoes_custeio = [];

            await Promise.all(
                array_tipos_custeio.map(async (tipoCusteio) => {
                    const resposta = await getEspecificacoesCusteio(tipoCusteio.id);
                    let_especificacoes_custeio[tipoCusteio.id] = resposta;
                })
            );
            set_especificacoes_custeio([...let_especificacoes_custeio]);
            setLoading(false);
        };
        carregaTabelasDespesas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async function get_especificacoes_capital() {
            const resp = await getEspecificacoesCapital();
            set_especificaoes_capital(resp);
        })();
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
