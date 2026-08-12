import { YupSchemaTipoConta } from '../YupSchemaTipoConta';

describe('YupSchemaTipoConta', () => {
    it('deve passar na validação quando um nome válido for fornecido', async () => {
        const payloadValido = {
            nome: 'Conta Corrente',
        };

        const resultado = await YupSchemaTipoConta.validate(payloadValido);

        expect(resultado).toEqual(payloadValido);
    });

    it('deve falhar na validação quando o campo nome for uma string vazia', async () => {
        const payloadInvalido = {
            nome: '',
        };

        await expect(YupSchemaTipoConta.validate(payloadInvalido)).rejects.toMatchObject({
            name: 'ValidationError',
            message: 'Nome é obrigatório',
            path: 'nome',
        });
    });

    it('deve falhar na validação quando o campo nome for undefined', async () => {
        const payloadInvalido = {};

        await expect(YupSchemaTipoConta.validate(payloadInvalido)).rejects.toMatchObject({
            name: 'ValidationError',
            message: 'Nome é obrigatório',
            path: 'nome',
        });
    });

    it('deve falhar na validação de tipo quando o campo nome for null', async () => {
        const payloadInvalido = {
            nome: null,
        };

        // Como o campo não é .nullable(), o Yup dispara o erro de tipo em vez do .required()
        await expect(YupSchemaTipoConta.validate(payloadInvalido)).rejects.toThrow(
            /nome must be a `string` type/i
        );
    });
});