import { TEXTOS_FIQUE_DE_OLHO } from '../textosFiqueDeOlho';

describe('TEXTOS_FIQUE_DE_OLHO', () => {
    test('deve conter os tipos de texto do fique de olho com os valores esperados', () => {
        expect(TEXTOS_FIQUE_DE_OLHO).toEqual({
            UE_PRESTACAO_CONTAS: 'associacoes_prestacao_contas',
            UE_HISTORICO_MEMBROS: 'associacoes_historico_membros',
            DRE_CONSOLIDADO_DAS_PCS: 'diretorias_consolidado_das_pcs',
        });
    });

    test('não deve ter nenhum valor duplicado entre os tipos de texto', () => {
        const valores = Object.values(TEXTOS_FIQUE_DE_OLHO);
        const valoresUnicos = new Set(valores);

        expect(valoresUnicos.size).toBe(valores.length);
    });
});
