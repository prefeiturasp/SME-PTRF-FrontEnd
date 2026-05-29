import { UrlsMenuInterno } from '../UrlsMenuInterno';

describe('UrlsMenuInterno', () => {
    it('exporta um array com dois itens', () => {
        expect(Array.isArray(UrlsMenuInterno)).toBe(true);
        expect(UrlsMenuInterno).toHaveLength(2);
    });

    describe('primeiro item — Dados dos usuários', () => {
        const item = UrlsMenuInterno[0];

        it('tem label "Dados dos usuários"', () => {
            expect(item.label).toBe('Dados dos usuários');
        });

        it('tem url "gestao-de-usuarios-list"', () => {
            expect(item.url).toBe('gestao-de-usuarios-list');
        });

        it('não possui a propriedade origem', () => {
            expect(item).not.toHaveProperty('origem');
        });
    });

    describe('segundo item — Cargas de arquivo', () => {
        const item = UrlsMenuInterno[1];

        it('tem label "Cargas de arquivo"', () => {
            expect(item.label).toBe('Cargas de arquivo');
        });

        it('tem url "parametro-arquivos-de-carga"', () => {
            expect(item.url).toBe('parametro-arquivos-de-carga');
        });

        it('tem origem "CARGA_USUARIOS/V2"', () => {
            expect(item.origem).toBe('CARGA_USUARIOS/V2');
        });
    });

    it('cada item possui ao menos as propriedades label e url', () => {
        UrlsMenuInterno.forEach((item) => {
            expect(item).toHaveProperty('label');
            expect(item).toHaveProperty('url');
            expect(typeof item.label).toBe('string');
            expect(typeof item.url).toBe('string');
        });
    });
});
