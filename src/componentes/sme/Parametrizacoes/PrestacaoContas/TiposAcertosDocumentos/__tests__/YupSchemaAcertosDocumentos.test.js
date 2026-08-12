import { YupSchemaAcertosDocumentos } from '../YupSchemaAcertosDocumentos';

describe('YupSchemaAcertosDocumentos', () => {
    it('deve passar na validação quando todos os campos forem preenchidos corretamente', async () => {
        const payloadValido = {
            nome: 'Acerto de Tarifa Bancária',
            categoria: 'Financeiro',
            tipos_documento_prestacao: ['doc-uuid-1', 'doc-uuid-2'],
            ativo: true,
            pode_alterar_saldo_conciliacao: false,
        };

        const resultado = await YupSchemaAcertosDocumentos.validate(payloadValido);

        expect(resultado).toEqual(payloadValido);
    });

    it('deve passar na validação omitindo os campos booleanos opcionais', async () => {
        const payloadValido = {
            nome: 'Acerto Simples',
            categoria: 'Geral',
            tipos_documento_prestacao: ['doc-uuid-1'],
        };

        const resultado = await YupSchemaAcertosDocumentos.validate(payloadValido);

        expect(resultado).toEqual(payloadValido);
    });

    it('deve falhar na validação quando o campo nome estiver vazio', async () => {
        const payloadInvalido = {
            nome: '',
            categoria: 'Financeiro',
            tipos_documento_prestacao: ['doc-uuid-1'],
        };

        await expect(YupSchemaAcertosDocumentos.validate(payloadInvalido)).rejects.toMatchObject({
            name: 'ValidationError',
            message: 'Nome é obrigatório.',
            path: 'nome',
        });
    });

    it('deve falhar na validação quando o campo categoria estiver vazio ou ausente', async () => {
        const payloadInvalido = {
            nome: 'Acerto Sem Categoria',
            categoria: '',
            tipos_documento_prestacao: ['doc-uuid-1'],
        };

        await expect(YupSchemaAcertosDocumentos.validate(payloadInvalido)).rejects.toMatchObject({
            name: 'ValidationError',
            message: 'Categoria é obrigatório.',
            path: 'categoria',
        });
    });

    it('deve falhar se o array tipos_documento_prestacao estiver vazio', async () => {
        const payloadInvalido = {
            nome: 'Acerto Sem Documentos',
            categoria: 'Financeiro',
            tipos_documento_prestacao: [],
        };

        await expect(YupSchemaAcertosDocumentos.validate(payloadInvalido)).rejects.toMatchObject({
            name: 'ValidationError',
            message: 'Pelo menos um documento é obrigatório.',
            path: 'tipos_documento_prestacao',
        });
    });

    it('deve converter ou falhar na validação de tipos não booleanos nos campos ativo e pode_alterar_saldo_conciliacao', async () => {
        const payloadInvalido = {
            nome: 'Acerto Booleano Invalido',
            categoria: 'Financeiro',
            tipos_documento_prestacao: ['doc-uuid-1'],
            ativo: 'texto-nao-booleano',
        };

        await expect(YupSchemaAcertosDocumentos.validate(payloadInvalido)).rejects.toThrow(
            /ativo must be a `boolean` type/i
        );
    });
});