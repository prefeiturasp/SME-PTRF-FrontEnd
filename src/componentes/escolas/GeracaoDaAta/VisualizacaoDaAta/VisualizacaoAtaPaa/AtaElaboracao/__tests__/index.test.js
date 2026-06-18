import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AtaElaboracao } from '../index';

describe('Componente <AtaElaboracao />', () => {
    const createMockProps = () => ({
        getNomeUnidadeEducacional: jest.fn(() => 'EMEF Castro Alves'),
        getDiaPorExtenso: jest.fn(() => 'dezesseis'),
        getMesPorExtenso: jest.fn(() => 'outubro'),
        getAnoPorExtenso: jest.fn(() => 'dois mil e vinte e seis'),
        getLocalReuniao: jest.fn(() => 'Auditório Principal'),
        getNomeUnidade: jest.fn(() => 'Unidade Centro'),
        getHoraInicio: jest.fn(() => 'quatorze horas'),
        getTipoReuniao: jest.fn(() => 'Ordinária'),
        getTipoUnidadeComNome: jest.fn(() => 'CEI Espaço Infantil'),
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o título principal e o subtítulo corretamente', () => {
        const mockProps = createMockProps();
        render(<AtaElaboracao {...mockProps} />);

        const tituloPrincipal = screen.getByText(/Ata de Reunião Conjunta Ordinária/i);
        const nomeUnidadeEducacional = screen.getByText(/EMEF Castro Alves/i);
        const subTitulo = screen.getByText(/Plano Anual de Atividades – PAA/i);

        expect(tituloPrincipal).toBeInTheDocument();
        expect(nomeUnidadeEducacional).toBeInTheDocument();
        expect(subTitulo).toBeInTheDocument();
    });

    it('deve renderizar o parágrafo descritivo contendo todas as variáveis injetadas corretamente', () => {
        const mockProps = createMockProps();
        render(<AtaElaboracao {...mockProps} />);

        const paragrafoDinamico = screen.getByText(/Aos dezesseis do mês de outubro de dois mil e vinte e seis/i);
        
        expect(paragrafoDinamico).toBeInTheDocument();

        expect(paragrafoDinamico).toHaveTextContent('no (a) Auditório Principal');
        expect(paragrafoDinamico).toHaveTextContent('da Unidade Educacional Unidade Centro');
        expect(paragrafoDinamico).toHaveTextContent('às quatorze horas');
        expect(paragrafoDinamico).toHaveTextContent('realizou-se a reunião Ordinária');
        expect(paragrafoDinamico).toHaveTextContent('Pais e Mestres do(a) CEI Espaço Infantil');
    });

    it('deve renderizar os textos jurídicos e estáticos obrigatórios da ata', () => {
        const mockProps = createMockProps();
        render(<AtaElaboracao {...mockProps} />);

        expect(screen.getByText(/inciso XIII do artigo 118, da Lei nº 14\.660\/2007/i)).toBeInTheDocument();
        expect(screen.getByText(/Projeto Pedagógico da Unidade, o qual serviu de base para a elaboração do Plano acima citado/i)).toBeInTheDocument();
        expect(screen.getByText(/verba do PTRF e conforme art\. 3º, da Lei Municipal nº 13\.991\/2005/i)).toBeInTheDocument();
        expect(screen.getByText(/I – na aquisição de material permanente; II – na aquisição de material de consumo/i)).toBeInTheDocument();
        expect(screen.getByText(/Após análise e discussão, foram estabelecidos pelos presentes as seguintes prioridades/i)).toBeInTheDocument();
    });
});