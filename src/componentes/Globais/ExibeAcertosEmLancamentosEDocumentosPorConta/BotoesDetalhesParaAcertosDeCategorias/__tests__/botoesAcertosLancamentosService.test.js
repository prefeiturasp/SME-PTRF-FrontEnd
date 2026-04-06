import { botoesAcertosLancamentosService } from '../botoesAcertosLancamentosService.service';
import {
    postMarcarGastoComoConciliado,
    postMarcarGastoDesconciliado,
} from '../../../../../services/dres/PrestacaoDeContas.service';
import { toastCustom } from '../../../ToastCustom';

jest.mock('../../../../../services/dres/PrestacaoDeContas.service', () => ({
    postMarcarGastoComoConciliado: jest.fn(),
    postMarcarGastoDesconciliado: jest.fn(),
}));

jest.mock('../../../ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
    },
}));

const analise_lancamento = { analise_lancamento: 'uuid-analise-123', despesa: 'uuid-despesa-456' };
const prestacaoDeContas = { periodo_uuid: 'uuid-periodo-789' };
const conta = { uuid: 'uuid-conta-001' };

describe('botoesAcertosLancamentosService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('marcarGastoComoConciliado', () => {
        it('chama postMarcarGastoComoConciliado com o payload correto', async () => {
            postMarcarGastoComoConciliado.mockResolvedValueOnce({});
            const carregaAcertosLancamentos = jest.fn().mockResolvedValueOnce({});

            await botoesAcertosLancamentosService.marcarGastoComoConciliado(
                analise_lancamento, prestacaoDeContas, carregaAcertosLancamentos, conta
            );

            expect(postMarcarGastoComoConciliado).toHaveBeenCalledWith({
                uuid_analise_lancamento: 'uuid-analise-123',
                uuid_periodo: 'uuid-periodo-789',
            });
        });

        it('exibe toast de sucesso após conciliar', async () => {
            postMarcarGastoComoConciliado.mockResolvedValueOnce({});
            const carregaAcertosLancamentos = jest.fn().mockResolvedValueOnce({});

            await botoesAcertosLancamentosService.marcarGastoComoConciliado(
                analise_lancamento, prestacaoDeContas, carregaAcertosLancamentos, conta
            );

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                'Despesa conciliada',
                'Despesa conciliada com sucesso.'
            );
        });

        it('chama carregaAcertosLancamentos com conta após conciliar', async () => {
            postMarcarGastoComoConciliado.mockResolvedValueOnce({});
            const carregaAcertosLancamentos = jest.fn().mockResolvedValueOnce({});

            await botoesAcertosLancamentosService.marcarGastoComoConciliado(
                analise_lancamento, prestacaoDeContas, carregaAcertosLancamentos, conta
            );

            expect(carregaAcertosLancamentos).toHaveBeenCalledWith(conta);
        });

        it('não lança erro quando postMarcarGastoComoConciliado falha', async () => {
            postMarcarGastoComoConciliado.mockRejectedValueOnce(new Error('Erro de rede'));
            const carregaAcertosLancamentos = jest.fn();

            await expect(
                botoesAcertosLancamentosService.marcarGastoComoConciliado(
                    analise_lancamento, prestacaoDeContas, carregaAcertosLancamentos, conta
                )
            ).resolves.not.toThrow();
        });

        it('não chama toast nem carregaAcertosLancamentos em caso de erro', async () => {
            postMarcarGastoComoConciliado.mockRejectedValueOnce(new Error('Erro'));
            const carregaAcertosLancamentos = jest.fn();

            await botoesAcertosLancamentosService.marcarGastoComoConciliado(
                analise_lancamento, prestacaoDeContas, carregaAcertosLancamentos, conta
            );

            expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
            expect(carregaAcertosLancamentos).not.toHaveBeenCalled();
        });
    });

    describe('marcarGastoComoDesconciliado', () => {
        it('chama postMarcarGastoDesconciliado com o payload correto', async () => {
            postMarcarGastoDesconciliado.mockResolvedValueOnce({});
            const carregaAcertosLancamentos = jest.fn().mockResolvedValueOnce({});

            await botoesAcertosLancamentosService.marcarGastoComoDesconciliado(
                analise_lancamento, carregaAcertosLancamentos, conta
            );

            expect(postMarcarGastoDesconciliado).toHaveBeenCalledWith({
                uuid_analise_lancamento: 'uuid-analise-123',
            });
        });

        it('exibe toast de sucesso após desconciliar', async () => {
            postMarcarGastoDesconciliado.mockResolvedValueOnce({});
            const carregaAcertosLancamentos = jest.fn().mockResolvedValueOnce({});

            await botoesAcertosLancamentosService.marcarGastoComoDesconciliado(
                analise_lancamento, carregaAcertosLancamentos, conta
            );

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                'Despesa desconciliada',
                'Despesa desconciliada com sucesso.'
            );
        });

        it('chama carregaAcertosLancamentos com conta após desconciliar', async () => {
            postMarcarGastoDesconciliado.mockResolvedValueOnce({});
            const carregaAcertosLancamentos = jest.fn().mockResolvedValueOnce({});

            await botoesAcertosLancamentosService.marcarGastoComoDesconciliado(
                analise_lancamento, carregaAcertosLancamentos, conta
            );

            expect(carregaAcertosLancamentos).toHaveBeenCalledWith(conta);
        });

        it('não lança erro quando postMarcarGastoDesconciliado falha', async () => {
            postMarcarGastoDesconciliado.mockRejectedValueOnce(new Error('Erro de rede'));
            const carregaAcertosLancamentos = jest.fn();

            await expect(
                botoesAcertosLancamentosService.marcarGastoComoDesconciliado(
                    analise_lancamento, carregaAcertosLancamentos, conta
                )
            ).resolves.not.toThrow();
        });

        it('não chama toast nem carregaAcertosLancamentos em caso de erro', async () => {
            postMarcarGastoDesconciliado.mockRejectedValueOnce(new Error('Erro'));
            const carregaAcertosLancamentos = jest.fn();

            await botoesAcertosLancamentosService.marcarGastoComoDesconciliado(
                analise_lancamento, carregaAcertosLancamentos, conta
            );

            expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
            expect(carregaAcertosLancamentos).not.toHaveBeenCalled();
        });
    });
});
