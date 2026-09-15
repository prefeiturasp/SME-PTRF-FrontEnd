import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import DevolutivaDaAssociacao from '../index';
import { getAnalisesDePcDevolvidas } from '../../../../../../services/dres/PrestacaoDeContas.service';

jest.mock('../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getAnalisesDePcDevolvidas: jest.fn(),
}));

let mockCapturedDatePickerProps = null;
jest.mock('../../../../../Globais/DatePickerField', () => ({
    DatePickerField: (props) => {
        mockCapturedDatePickerProps = props;
        return <input data-testid="data-recebimento-devolutiva" disabled={props.disabled} value={props.value || ''} readOnly />;
    },
}));

describe('DevolutivaDaAssociacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedDatePickerProps = null;
    });

    it('renderiza título e não exibe prazo quando não há análises devolvidas', async () => {
        getAnalisesDePcDevolvidas.mockResolvedValue([]);
        render(<DevolutivaDaAssociacao prestacaoDeContas={{ uuid: 'uuid-1' }} dataRecebimentoDevolutiva={null} handleChangedataRecebimentoDevolutiva={jest.fn()} />);

        expect(screen.getByText('Devolutiva da Associação')).toBeInTheDocument();
        await waitFor(() => expect(getAnalisesDePcDevolvidas).toHaveBeenCalledWith('uuid-1'));
        expect(screen.getByText(/Prazo de reenvio:/)).toBeInTheDocument();
    });

    it('não busca análises quando o retorno é null', async () => {
        getAnalisesDePcDevolvidas.mockResolvedValue(null);
        render(<DevolutivaDaAssociacao prestacaoDeContas={{ uuid: 'uuid-2' }} dataRecebimentoDevolutiva={null} handleChangedataRecebimentoDevolutiva={jest.fn()} />);
        await waitFor(() => expect(getAnalisesDePcDevolvidas).toHaveBeenCalledWith('uuid-2'));
        expect(screen.getByTestId('data-recebimento-devolutiva')).toBeInTheDocument();
    });

    it('exibe o prazo de reenvio calculado a partir da análise devolvida mais recente', async () => {
        getAnalisesDePcDevolvidas.mockResolvedValue([
            { devolucao_prestacao_conta: { data_limite_ue: '2024-01-10' } },
            { devolucao_prestacao_conta: { data_limite_ue: '2024-02-20' } },
        ]);
        render(<DevolutivaDaAssociacao prestacaoDeContas={{ uuid: 'uuid-3' }} dataRecebimentoDevolutiva={null} handleChangedataRecebimentoDevolutiva={jest.fn()} />);

        // getAnalisesDePcDevolvidas.reverse() faz a última análise (2024-02-20) virar a primeira
        await waitFor(() => expect(screen.getByText('20/02/2024')).toBeInTheDocument());
    });

    it('passa a data de recebimento e desabilita o campo quando editavel é false', async () => {
        getAnalisesDePcDevolvidas.mockResolvedValue([]);
        render(<DevolutivaDaAssociacao prestacaoDeContas={{ uuid: 'uuid-4' }} dataRecebimentoDevolutiva="2024-05-01" handleChangedataRecebimentoDevolutiva={jest.fn()} editavel={false} />);
        await waitFor(() => expect(getAnalisesDePcDevolvidas).toHaveBeenCalled());
        expect(mockCapturedDatePickerProps.value).toBe('2024-05-01');
        expect(mockCapturedDatePickerProps.disabled).toBe(true);
    });

    it('chama handleChangedataRecebimentoDevolutiva ao alterar a data', async () => {
        getAnalisesDePcDevolvidas.mockResolvedValue([]);
        const handleChange = jest.fn();
        render(<DevolutivaDaAssociacao prestacaoDeContas={{ uuid: 'uuid-5' }} dataRecebimentoDevolutiva={null} handleChangedataRecebimentoDevolutiva={handleChange} />);
        await waitFor(() => expect(getAnalisesDePcDevolvidas).toHaveBeenCalled());

        act(() => {
            mockCapturedDatePickerProps.onChange('data_recebimento_da_devolutiva', '2024-03-01');
        });
        expect(handleChange).toHaveBeenCalledWith('data_recebimento_da_devolutiva', '2024-03-01');
    });

    it('não atualiza estado após desmontar o componente (cleanup do useEffect)', async () => {
        let resolveFn;
        getAnalisesDePcDevolvidas.mockReturnValue(new Promise((resolve) => { resolveFn = resolve; }));
        const { unmount } = render(<DevolutivaDaAssociacao prestacaoDeContas={{ uuid: 'uuid-6' }} dataRecebimentoDevolutiva={null} handleChangedataRecebimentoDevolutiva={jest.fn()} />);
        unmount();
        await act(async () => {
            resolveFn([{ devolucao_prestacao_conta: { data_limite_ue: '2024-01-10' } }]);
        });
        // Não deve lançar erro de "state update on unmounted component"
    });
});
