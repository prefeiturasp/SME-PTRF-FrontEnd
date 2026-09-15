import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormRecebimentoPelaDiretoria } from '../FormRecebimentoPelaDiretoria';

let mockCapturedDatePickerProps = null;
jest.mock('../../../../Globais/DatePickerField', () => ({
    DatePickerField: (props) => {
        mockCapturedDatePickerProps = props;
        return <input data-testid="data-recebimento" disabled={props.disabled} value={props.value || ''} readOnly />;
    },
}));

describe('FormRecebimentoPelaDiretoria', () => {
    const tabelaPrestacoes = { status: [{ id: 'NAO_RECEBIDA', nome: 'Não recebida' }, { id: 'RECEBIDA', nome: 'Recebida' }] };

    beforeEach(() => {
        mockCapturedDatePickerProps = null;
    });

    it('renderiza os campos com valores vazios quando o estado não possui dados', () => {
        const { container } = render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{}}
                handleChangeFormRecebimentoPelaDiretoria={jest.fn()}
                tabelaPrestacoes={{}}
            />
        );
        expect(screen.getByText('Recebimento pela Diretoria')).toBeInTheDocument();
        expect(container.querySelector('input[name="tecnico_atribuido"]')).toHaveValue('');
        expect(mockCapturedDatePickerProps.value).toBe('');
        expect(mockCapturedDatePickerProps.className).toContain('is_invalid');
    });

    it('chama handleChange ao digitar no campo técnico responsável', () => {
        const handleChange = jest.fn();
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{ tecnico_atribuido: 'João' }}
                handleChangeFormRecebimentoPelaDiretoria={handleChange}
                tabelaPrestacoes={{}}
            />
        );
        const input = screen.getByDisplayValue('João');
        fireEvent.change(input, { target: { name: 'tecnico_atribuido', value: 'Maria' } });
        expect(handleChange).toHaveBeenCalledWith('tecnico_atribuido', 'Maria');
    });

    it('não marca a data como inválida quando preenchida, e propaga onChange do DatePickerField', () => {
        const handleChange = jest.fn();
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{ data_recebimento: '2024-01-10' }}
                handleChangeFormRecebimentoPelaDiretoria={handleChange}
                tabelaPrestacoes={{}}
            />
        );
        expect(mockCapturedDatePickerProps.value).toBe('2024-01-10');
        expect(mockCapturedDatePickerProps.className).not.toContain('is_invalid');

        mockCapturedDatePickerProps.onChange('data_recebimento', '2024-02-20');
        expect(handleChange).toHaveBeenCalledWith('data_recebimento', '2024-02-20');
    });

    it('renderiza as opções de status a partir de tabelaPrestacoes e propaga a mudança de seleção', () => {
        const handleChange = jest.fn();
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{ status: 'NAO_RECEBIDA' }}
                handleChangeFormRecebimentoPelaDiretoria={handleChange}
                tabelaPrestacoes={tabelaPrestacoes}
            />
        );
        expect(screen.getByText('Não recebida')).toBeInTheDocument();
        expect(screen.getByText('Recebida')).toBeInTheDocument();

        fireEvent.change(screen.getByDisplayValue('Não recebida'), { target: { name: 'status', value: 'RECEBIDA' } });
        expect(handleChange).toHaveBeenCalledWith('status', 'RECEBIDA');
    });

    it('não renderiza opções de status quando tabelaPrestacoes.status está vazio', () => {
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{}}
                handleChangeFormRecebimentoPelaDiretoria={jest.fn()}
                tabelaPrestacoes={{ status: [] }}
            />
        );
        expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('não exibe o bloco de motivos quando exibeMotivo é false', () => {
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{}}
                handleChangeFormRecebimentoPelaDiretoria={jest.fn()}
                tabelaPrestacoes={{}}
                exibeMotivo={false}
                prestacaoDeContas={{ motivos_aprovacao_ressalva: [{ motivo: 'Motivo 1' }] }}
            />
        );
        expect(screen.queryByText('Motivo(s)')).not.toBeInTheDocument();
    });

    it('exibe o bloco de motivos combinando motivos cadastrados e outros motivos', () => {
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{}}
                handleChangeFormRecebimentoPelaDiretoria={jest.fn()}
                tabelaPrestacoes={{}}
                exibeMotivo={true}
                prestacaoDeContas={{
                    motivos_aprovacao_ressalva: [{ motivo: 'Motivo 1' }, { motivo: 'Motivo 2' }],
                    outros_motivos_aprovacao_ressalva: 'Motivo extra',
                }}
            />
        );
        expect(screen.getByText('Motivo(s)')).toBeInTheDocument();
        expect(screen.getByText('1. Motivo 1')).toBeInTheDocument();
        expect(screen.getByText('2. Motivo 2')).toBeInTheDocument();
        expect(screen.getByText('3. Motivo extra')).toBeInTheDocument();
    });

    it('exibe o bloco de motivos apenas com outros_motivos quando não há motivos cadastrados', () => {
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{}}
                handleChangeFormRecebimentoPelaDiretoria={jest.fn()}
                tabelaPrestacoes={{}}
                exibeMotivo={true}
                prestacaoDeContas={{
                    motivos_aprovacao_ressalva: [],
                    outros_motivos_aprovacao_ressalva: 'Só o motivo extra',
                }}
            />
        );
        expect(screen.getByText('1. Só o motivo extra')).toBeInTheDocument();
    });

    it('não exibe o bloco de motivos quando não há motivos nem outros motivos', () => {
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{}}
                handleChangeFormRecebimentoPelaDiretoria={jest.fn()}
                tabelaPrestacoes={{}}
                exibeMotivo={true}
                prestacaoDeContas={{ motivos_aprovacao_ressalva: [], outros_motivos_aprovacao_ressalva: '' }}
            />
        );
        expect(screen.queryByText('Motivo(s)')).not.toBeInTheDocument();
    });

    it('exibe o bloco de recomendações quando exibeRecomendacoes é true e há recomendações', () => {
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{}}
                handleChangeFormRecebimentoPelaDiretoria={jest.fn()}
                tabelaPrestacoes={{}}
                exibeRecomendacoes={true}
                prestacaoDeContas={{ recomendacoes: 'Ajustar tal item' }}
            />
        );
        expect(screen.getByText('Recomendações')).toBeInTheDocument();
        expect(screen.getByText('Ajustar tal item')).toBeInTheDocument();
    });

    it('não exibe o bloco de recomendações quando exibeRecomendacoes é false', () => {
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{}}
                handleChangeFormRecebimentoPelaDiretoria={jest.fn()}
                tabelaPrestacoes={{}}
                exibeRecomendacoes={false}
                prestacaoDeContas={{ recomendacoes: 'Ajustar tal item' }}
            />
        );
        expect(screen.queryByText('Recomendações')).not.toBeInTheDocument();
    });

    it('aceita nomes customizados para os campos de motivo, outros_motivos e recomendações', () => {
        render(
            <FormRecebimentoPelaDiretoria
                stateFormRecebimentoPelaDiretoria={{}}
                handleChangeFormRecebimentoPelaDiretoria={jest.fn()}
                tabelaPrestacoes={{}}
                exibeMotivo={true}
                exibeRecomendacoes={true}
                motivo="motivos_customizados"
                outros_motivos="outros_motivos_customizados"
                recomendacoes="recomendacoes_customizadas"
                prestacaoDeContas={{
                    motivos_customizados: [{ motivo: 'Motivo customizado' }],
                    recomendacoes_customizadas: 'Recomendação customizada',
                }}
            />
        );
        expect(screen.getByText('1. Motivo customizado')).toBeInTheDocument();
        expect(screen.getByText('Recomendação customizada')).toBeInTheDocument();
    });
});
