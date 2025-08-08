import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ResumoPorDre } from '../ResumoPorDre';

jest.mock('../../../../utils/FormataNomeDreParaTabelas', () => ({
    formataNomeDreParaTabelas: (nome) => nome.replace('DRE ', '')
}));

const resumoMock = [
    {
        dre: { uuid: '1234', nome: 'DRE Teste', sigla: 'DRE' },
        cards: {
            TOTAL_UNIDADES: 10,
            NAO_APRESENTADA: 29921,
            RECEBIDA: 1352,
            EM_ANALISE: 2468,
            NAO_RECEBIDA: 1689,
            DEVOLVIDA: 1187,
            APROVADA: 46961,
            APROVADA_RESSALVA: 11238,
            REPROVADA: 18441
        }
    }
];
describe('ResumoPorDre', () => {

    const renderComponent = (cor_idx = 1) => {
        return render(
            <MemoryRouter>
                <ResumoPorDre
                    resumoPorDre={resumoMock}
                    statusPeriodo={{ cor_idx }}
                    periodoEscolhido={'2024-2'}
                />
            </MemoryRouter>
        );
    };

    it('renderiza colunas comuns e específicas para período em andamento (cor_idx = 1)', () => {
        renderComponent(1);

        // Colunas visíveis
        expect(screen.getByText('DRE')).toBeInTheDocument();
        expect(screen.getByText('Total de Associações')).toBeInTheDocument();
        expect(screen.getByText('Não apresentadas')).toBeInTheDocument();
        expect(screen.getByText('Aguardando análise')).toBeInTheDocument();
        expect(screen.getByText('Aprovadas')).toBeInTheDocument();
        expect(screen.getByText('Aprovadas com ressalvas')).toBeInTheDocument();
        expect(screen.getByText('Reprovadas')).toBeInTheDocument();
        expect(screen.getByText('Ações')).toBeInTheDocument();

        // Valores
        expect(screen.getByText('DRE')).toBeInTheDocument(); // sigla da DRE
        expect(screen.getByText('10')).toBeInTheDocument(); // Total unidades
        expect(screen.getByText('1352')).toBeInTheDocument(); // RECEBIDA
        expect(screen.getByText('46961')).toBeInTheDocument(); // APROVADA
        // EM_ANALISE + NAO_RECEBIDA + DEVOLVIDA
        expect(screen.getByText(
            String(
                resumoMock[0].cards.EM_ANALISE +
                resumoMock[0].cards.NAO_RECEBIDA +
                resumoMock[0].cards.DEVOLVIDA)
            )
        ).toBeInTheDocument();
    })
        

    it('não renderiza colunas de RECEBIDA e EM_ANALISE se período não está em andamento (cor_idx != 1)', () => {
        renderComponent(2);

        expect(screen.queryByText('Aguardando análise')).not.toBeInTheDocument();
        expect(screen.queryByText('Em análise')).not.toBeInTheDocument();
    });

    it('renderiza corretamente o link de ação com o UUID e período', () => {
        renderComponent(1);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/acompanhamento-pcs-sme/1234/2024-2');
    });
});
