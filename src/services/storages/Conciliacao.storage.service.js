import { criarStoragePorRecurso } from './StoragePorRecurso.service';

const STORAGE_KEY_PERIODO_CONTA_CONCILIACAO = 'PERIODO_CONTA_CONCILIACAO';

const isLegadoConciliacao = (parsed) => 'periodo' in parsed || 'conta' in parsed;

const {
    getItem: getConciliacao,
    setItem: setConciliacao,
    removeItem: removeConciliacao,
} = criarStoragePorRecurso({ storageKey: STORAGE_KEY_PERIODO_CONTA_CONCILIACAO, isLegadoFn: isLegadoConciliacao });

export const conciliacaoStorageService = {
    getPeriodoConta: getConciliacao,
    setPeriodoConta: setConciliacao,
    removePeriodoConta: removeConciliacao,
};