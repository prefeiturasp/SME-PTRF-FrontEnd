import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabsConferencia } from '../index';

jest.mock('../../../../../../utils/ValidacoesNumeros.js', () => ({
    Ordinais: jest.fn((n) => `${n}ª`)
}));

describe('TabsConferencia', () => {
    const baseProps = () => ({
        relatorioConsolidado: {
            status_sme: 'EM_ANALISE',
            analises_do_consolidado_dre: []
        },
        tabAtual: 'conferencia-atual',
        setTabAtual: jest.fn(),
        setAnaliseSequenciaVisualizacao: jest.fn()
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza apenas "Conferência atual" quando status é EM_ANALISE e há menos de 2 análises', () => {
        const props = baseProps();
        props.relatorioConsolidado.analises_do_consolidado_dre = [{ id: 1 }];

        render(<TabsConferencia {...props} />);

        expect(screen.getByText('Conferência atual')).toBeInTheDocument();
        expect(screen.queryByText('Histórico de conferência')).not.toBeInTheDocument();
    });

    it('renderiza "Conferência atual" e "Histórico de conferência" quando status é EM_ANALISE e há 2 ou mais análises', () => {
        const props = baseProps();
        props.relatorioConsolidado.analises_do_consolidado_dre = [{ id: 1 }, { id: 2 }];

        render(<TabsConferencia {...props} />);

        expect(screen.getByText('Conferência atual')).toBeInTheDocument();
        expect(screen.getByText('Histórico de conferência')).toBeInTheDocument();
    });

    it('renderiza apenas "Histórico de conferência" quando status não é EM_ANALISE', () => {
        const props = baseProps();
        props.relatorioConsolidado.status_sme = 'FINALIZADO';
        props.relatorioConsolidado.analises_do_consolidado_dre = [{ id: 1 }];

        render(<TabsConferencia {...props} />);

        expect(screen.getByText('Histórico de conferência')).toBeInTheDocument();
        expect(screen.queryByText('Conferência atual')).not.toBeInTheDocument();
    });

    it('clique em "Conferência atual" chama setTabAtual("conferencia-atual")', () => {
        const props = baseProps();
        props.relatorioConsolidado.analises_do_consolidado_dre = [{ id: 1 }, { id: 2 }];

        render(<TabsConferencia {...props} />);

        const abaAtual = screen.getByText('Conferência atual');
        fireEvent.click(abaAtual);

        expect(props.setTabAtual).toHaveBeenCalledWith('conferencia-atual');
    });

    it('clique em "Histórico de conferência" chama setTabAtual("historico")', () => {
        const props = baseProps();
        props.relatorioConsolidado.analises_do_consolidado_dre = [{ id: 1 }, { id: 2 }];

        render(<TabsConferencia {...props} />);

        const abaHistorico = screen.getByText('Histórico de conferência');
        fireEvent.click(abaHistorico);

        expect(props.setTabAtual).toHaveBeenCalledWith('historico');
    });

    it('useEffect calcula e chama setAnaliseSequenciaVisualizacao quando tabAtual muda e há análises (>=2) e tabAtual !== "historico"', () => {
        const { Ordinais } = require('../../../../../../utils/ValidacoesNumeros.js');
        Ordinais.mockImplementation((n) => (n === 1 ? '1ª' : `${n}ª`));

        const props = baseProps();
        props.relatorioConsolidado.analises_do_consolidado_dre = [
            { id: 11 },
            { id: 22 },
            { id: 33 }
        ];

        const { rerender } = render(<TabsConferencia {...props} />);

        act(() => {
            props.tabAtual = 'conferencia-atual';
            rerender(<TabsConferencia {...props} />);
        });

        expect(props.setAnaliseSequenciaVisualizacao).toHaveBeenCalledWith({
            sequenciaConferencia: { id: 22 },
            versao: '1ª',
            versao_numero: 2
        });
    });

    it('useEffect não chama setAnaliseSequenciaVisualizacao quando tabAtual é "historico"', () => {
        const props = baseProps();
        props.tabAtual = 'historico';
        props.relatorioConsolidado.analises_do_consolidado_dre = [{ id: 1 }, { id: 2 }];

        render(<TabsConferencia {...props} />);

        expect(props.setAnaliseSequenciaVisualizacao).not.toHaveBeenCalled();
    });

    it('useEffect não quebra quando analises_do_consolidado_dre está ausente ou tem menos de 2', () => {
        const props1 = baseProps();
        props1.tabAtual = 'historico';
        props1.relatorioConsolidado.analises_do_consolidado_dre = [];
        render(<TabsConferencia {...props1} />);
        expect(props1.setAnaliseSequenciaVisualizacao).not.toHaveBeenCalled();

        const props2 = baseProps();
        props2.tabAtual = 'historico';
        props2.relatorioConsolidado.analises_do_consolidado_dre = [{ id: 1 }];
        render(<TabsConferencia {...props2} />);
        expect(props2.setAnaliseSequenciaVisualizacao).not.toHaveBeenCalled();
    });

    it('atribui a classe "active" corretamente na aba atual', () => {
        const props = baseProps();
        props.relatorioConsolidado.analises_do_consolidado_dre = [{ id: 1 }, { id: 2 }];
        props.tabAtual = 'historico';

        render(<TabsConferencia {...props} />);

        const abaHistorico = screen.getByText('Histórico de conferência');
        const abaAtual = screen.getByText('Conferência atual');

        expect(abaHistorico).toHaveClass('active');
        expect(abaAtual).not.toHaveClass('active');
    });
});