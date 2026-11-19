import { NOME_MES } from '../meses';

describe('NOME_MES', () => {
    it('tem os 12 meses em ordem, com o índice 0 em janeiro', () => {
        expect(NOME_MES).toHaveLength(12);
        expect(NOME_MES[0]).toBe('janeiro');
        expect(NOME_MES[11]).toBe('dezembro');
    });

    it('guarda os nomes em Unicode normalizado (março com ç composto)', () => {
        expect(NOME_MES[2]).toBe('março');
        expect(NOME_MES.every((nome) => nome === nome.normalize('NFC'))).toBe(true);
    });
});
