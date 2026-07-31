/**
 * Cache in-memory de status-periodo por data (associacao + YYYY-MM-DD).
 * Só usado pelo CadastroDeDespesasPipeline (flag despesas-pipeline).
 *
 * Deduplica chamadas concorrentes para a mesma data (in-flight promise).
 */
import moment from "moment";
import {getPeriodoFechado as getPeriodoFechadoApi} from "../../../../../services/escolas/Associacao.service";
import {getUuidAssociacao} from "../../../../../utils/AssociacaoUtils";

const cache = new Map();
const inflight = new Map();

const chave = (data) => {
    const dataNorm = moment(data, "YYYY-MM-DD").format("YYYY-MM-DD");
    const associacao = getUuidAssociacao() || "";
    return `${associacao}|${dataNorm}`;
};

export const getPeriodoFechadoCached = async (data_verificacao) => {
    const key = chave(data_verificacao);

    if (cache.has(key)) {
        return cache.get(key);
    }

    if (inflight.has(key)) {
        return inflight.get(key);
    }

    const promise = getPeriodoFechadoApi(data_verificacao)
        .then((result) => {
            cache.set(key, result);
            inflight.delete(key);
            return result;
        })
        .catch((error) => {
            inflight.delete(key);
            throw error;
        });

    inflight.set(key, promise);
    return promise;
};

/** Expõe limpeza para testes. */
export const limparCachePeriodoFechado = () => {
    cache.clear();
    inflight.clear();
};
