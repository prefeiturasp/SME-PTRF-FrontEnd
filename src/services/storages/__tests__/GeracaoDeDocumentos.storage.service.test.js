import {
    geracaoDocumentosStorageService as service,
    STORAGE_KEY_PERIODO_CONTA_GERACAO_DOCUMENTOS as KEY,
} from '../GeracaoDeDocumentos.storage.service';
import { recursoSelecionadoStorageService } from '../RecursoSelecionado.storage.service';

jest.mock('../RecursoSelecionado.storage.service', () => ({
    recursoSelecionadoStorageService: { getRecursoSelecionado: jest.fn() },
}));

describe('geracaoDocumentosStorageService', () => {
    beforeEach(() => {
        localStorage.clear();
        recursoSelecionadoStorageService.getRecursoSelecionado.mockReturnValue({ uuid: 'r1' });
    });

    it('expõe a chave de storage esperada', () => {
        expect(KEY).toBe('PERIODO_CONTA_GERACAO_DOCUMENTOS');
    });

    it('getPeriodo retorna null quando vazio', () => {
        expect(service.getPeriodo()).toBeNull();
    });

    it('setPeriodo/getPeriodo por recurso', () => {
        service.setPeriodo({ periodo: 'p1' });
        expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ recurso_r1: { periodo: 'p1' } });
        expect(service.getPeriodo()).toEqual({ periodo: 'p1' });
    });

    it('lê o formato legado (periodoPrestacaoDeConta)', () => {
        const legado = { periodoPrestacaoDeConta: 'abc' };
        localStorage.setItem(KEY, JSON.stringify(legado));
        expect(service.getPeriodo()).toEqual(legado);
    });

    it('setPeriodo descarta o formato legado', () => {
        localStorage.setItem(KEY, JSON.stringify({ periodoPrestacaoDeConta: 'abc' }));
        service.setPeriodo({ periodo: 'p2' });
        expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ recurso_r1: { periodo: 'p2' } });
    });

    it('removePeriodo apaga o item', () => {
        service.setPeriodo({ periodo: 'p1' });
        service.removePeriodo();
        expect(localStorage.getItem(KEY)).toBeNull();
    });
});
