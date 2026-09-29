import { YupSignupSchemaDetalharAcertosDocumentos } from '../YupSignupSchemaDetalharAcertosDocumentos';

describe('YupSignupSchemaDetalharAcertosDocumentos', () => {
    const validate = async (data) => {
        try {
            await YupSignupSchemaDetalharAcertosDocumentos.validate(data, { abortEarly: false });
            return null;
        } catch (error) {
            return error;
        }
    };

    it('valida com sucesso quando solicitacoes_acerto está vazio', async () => {
        const error = await validate({ solicitacoes_acerto: [] });

        expect(error).toBeNull();
    });

    it('valida com sucesso quando solicitacoes_acerto não é informado', async () => {
        const error = await validate({});

        expect(error).toBeNull();
    });

    it('retorna erro quando tipo_acerto não é informado', async () => {
        const error = await validate({ solicitacoes_acerto: [{}] });

        expect(error).not.toBeNull();
        expect(error.errors).toContain('Tipo de acerto é obrigatorio');
    });

    it('retorna erro quando tipo_acerto é uma string vazia', async () => {
        const error = await validate({ solicitacoes_acerto: [{ tipo_acerto: '' }] });

        expect(error.errors).toContain('Tipo de acerto é obrigatorio');
    });

    it('valida com sucesso quando tipo_acerto é informado', async () => {
        const error = await validate({ solicitacoes_acerto: [{ tipo_acerto: 'uuid-tipo-acerto' }] });

        expect(error).toBeNull();
    });

    it('valida múltiplos itens, acusando erro apenas nos itens sem tipo_acerto', async () => {
        const error = await validate({
            solicitacoes_acerto: [
                { tipo_acerto: 'uuid-1' },
                {},
                { tipo_acerto: 'uuid-3' },
            ],
        });

        expect(error).not.toBeNull();
        expect(error.errors).toHaveLength(1);
        expect(error.errors).toContain('Tipo de acerto é obrigatorio');
    });

    it('isValidSync retorna false para payload inválido e true para payload válido', () => {
        expect(
            YupSignupSchemaDetalharAcertosDocumentos.isValidSync({ solicitacoes_acerto: [{}] })
        ).toBe(false);

        expect(
            YupSignupSchemaDetalharAcertosDocumentos.isValidSync({
                solicitacoes_acerto: [{ tipo_acerto: 'uuid-tipo-acerto' }],
            })
        ).toBe(true);
    });
});
