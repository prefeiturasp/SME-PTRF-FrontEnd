import {
    alertaPaginaStorageService,
    STORAGE_KEY_ALERTAS_PAGINAS_VISTOS,
} from '../AlertaPagina.storage.service';

describe('alertaPaginaStorageService', () => {
    beforeEach(() => localStorage.clear());

    it('retorna false quando o alerta não foi visto', () => {
        expect(alertaPaginaStorageService.alertaJaVisto('123', 'a:2026-11-15')).toBe(false);
    });

    it('marca como visto por login e chave', () => {
        alertaPaginaStorageService.marcarAlertaComoVisto('123', 'a:2026-11-15');

        expect(alertaPaginaStorageService.alertaJaVisto('123', 'a:2026-11-15')).toBe(true);
        expect(alertaPaginaStorageService.alertaJaVisto('456', 'a:2026-11-15')).toBe(false);
        expect(alertaPaginaStorageService.alertaJaVisto('123', 'a:2027-11-15')).toBe(false);
    });

    it('poda entradas com mais de 30 dias ao gravar', () => {
        const sessentaDias = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem(
            STORAGE_KEY_ALERTAS_PAGINAS_VISTOS,
            JSON.stringify({ 123: { antiga: sessentaDias } }),
        );

        alertaPaginaStorageService.marcarAlertaComoVisto('123', 'nova');

        expect(alertaPaginaStorageService.alertaJaVisto('123', 'antiga')).toBe(false);
        expect(alertaPaginaStorageService.alertaJaVisto('123', 'nova')).toBe(true);
    });

    it('tolera JSON inválido no storage', () => {
        localStorage.setItem(STORAGE_KEY_ALERTAS_PAGINAS_VISTOS, '{invalido');

        expect(alertaPaginaStorageService.alertaJaVisto('123', 'x')).toBe(false);
        expect(() => alertaPaginaStorageService.marcarAlertaComoVisto('123', 'x')).not.toThrow();
        expect(alertaPaginaStorageService.alertaJaVisto('123', 'x')).toBe(true);
    });
});
