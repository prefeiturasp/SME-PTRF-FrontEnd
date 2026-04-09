import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TagModalLegendaInformacao } from '../TagModalLegendaInformacao';
import { coresTagsDespesas } from '../../../../utils/CoresTags';

jest.mock('../scss/tagModalLegendaInformacao.scss', () => {});
jest.mock('../../TagPeriodoConciliacao/scss/TagPeriodoConciliacao.scss', () => {});

describe('TagModalLegendaInformacao', () => {
  it('renderiza tag com texto e descrição', () => {
    const data = {
      id: 1,
      texto: 'Antecipado',
      descricao: 'Descrição da tag',
    };

    render(<TagModalLegendaInformacao data={data} coresTags={coresTagsDespesas} />);

    expect(screen.getByText('Antecipado')).toBeInTheDocument();
    expect(screen.getByText('Descrição da tag')).toBeInTheDocument();
  });

  it('aplica classe CSS correta baseada no id', () => {
    const data = {
      id: 1,
      texto: 'Antecipado',
      descricao: 'Descrição',
    };

    const { container } = render(
      <TagModalLegendaInformacao data={data} coresTags={coresTagsDespesas} />
    );

    expect(container.querySelector('.tag-purple')).toBeInTheDocument();
  });

  it('deve renderizar TagPeriodoConciliacao quando texto for "Conciliada"', () => {
    const data = {
      id: 9,
      index: 2,
      texto: 'Conciliada',
      descricao: 'Despesa conciliada com extrato bancário',
    };

    render(<TagModalLegendaInformacao data={data} coresTags={coresTagsDespesas} />);

    expect(screen.getByTestId('td-periodo-conciliacao-2')).toBeInTheDocument();
    expect(screen.getByText('Período: XXXX.X')).toBeInTheDocument();
  });

  it('não deve renderizar TagPeriodoConciliacao quando texto for diferente de "Conciliada"', () => {
    const data = {
      id: 1,
      index: 1,
      texto: 'Não conciliada',
      descricao: 'Despesa antecipada',
    };

    render(<TagModalLegendaInformacao data={data} coresTags={coresTagsDespesas} />);

    expect(screen.queryByTestId('td-periodo-conciliacao-1')).not.toBeInTheDocument();
    expect(screen.queryByText(/Período:/)).not.toBeInTheDocument();
  });
});

