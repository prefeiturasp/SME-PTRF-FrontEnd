import { YupSignupSchemaDetalharAcertos } from '../YupSignupSchemaDetalharAcertos';

describe('YupSignupSchemaDetalharAcertos', () => {
    const ID_DEVOLUCAO_TESOURO = 'DEVOLUCAO_TESOURO';

    const schema = YupSignupSchemaDetalharAcertos(ID_DEVOLUCAO_TESOURO);

    const validate = async (data) => {
        try {
            await schema.validate(data, { abortEarly: false });
            return null;
        } catch (error) {
            return error;
        }
    };

    describe('estrutura básica', () => {
        it('deve validar com sucesso quando solicitacoes_acerto está vazio', async () => {
            const error = await validate({
                solicitacoes_acerto: [],
            });

            expect(error).toBeNull();
        });
    });

    describe('deve validar tipo_acerto', () => {
        it('retorna erro quando tipo_acerto não é informado', async () => {
            const error = await validate({
                solicitacoes_acerto: [{}],
            });

            expect(error.errors).toContain('Tipo de acerto é obrigatório');
        });

        it('passa quando tipo_acerto é informado', async () => {
            const error = await validate({
                solicitacoes_acerto: [{ tipo_acerto: 'OUTRO_TIPO' }],
            });

            expect(error).toBeNull();
        });
    });

    describe('deve validar branch condicional: devolução ao tesouro', () => {
        it('não exige devolucao_tesouro quando tipo_acerto é diferente do idDevolucaoTesouro', async () => {
            const error = await validate({
                solicitacoes_acerto: [{ tipo_acerto: 'OUTRO_TIPO' }],
            });

            expect(error).toBeNull();
        });

        it('deve retornar erro quando tipo_acerto exige devolução e campos não são informados', async () => {
            const error = await validate({
                solicitacoes_acerto: [
                    {
                        tipo_acerto: ID_DEVOLUCAO_TESOURO,
                        devolucao_tesouro: {},
                    },
                ],
            });

            expect(error.errors).toEqual(
                expect.arrayContaining([
                    'Tipo de devolução é obrigatório',
                    'Valor total ou parcial é obrigatório',
                    'Valor é obrigatório',
                ]),
            );
        });

        it('deve retornar erro quando devolucao_tesouro não é informado mas é obrigatório', async () => {
            const error = await validate({
                solicitacoes_acerto: [
                    {
                        tipo_acerto: ID_DEVOLUCAO_TESOURO,
                    },
                ],
            });

            expect(error.errors).toEqual(
                expect.arrayContaining([
                    'Tipo de devolução é obrigatório',
                    'Valor total ou parcial é obrigatório',
                    'Valor é obrigatório',
                ]),
            );
        });

        it('deve validar com sucesso quando todos os campos de devolucao_tesouro são informados', async () => {
            const error = await validate({
                solicitacoes_acerto: [
                    {
                        tipo_acerto: ID_DEVOLUCAO_TESOURO,
                        devolucao_tesouro: {
                            tipo: 'TOTAL',
                            devolucao_total: 'SIM',
                            valor: '1000',
                        },
                    },
                ],
            });

            expect(error).toBeNull();
        });
    });

    describe('múltiplas solicitações de acerto', () => {
        it('deve validar corretamente entradas mistas', async () => {
            const error = await validate({
                solicitacoes_acerto: [
                    { tipo_acerto: 'OUTRO_TIPO' },
                    {
                        tipo_acerto: ID_DEVOLUCAO_TESOURO,
                        devolucao_tesouro: {
                            tipo: 'PARCIAL',
                            devolucao_total: 'NAO',
                            valor: '500',
                        },
                    },
                ],
            });

            expect(error).toBeNull();
        });
    });
});
