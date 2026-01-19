import React from 'react';
import { render, screen } from '@testing-library/react';
import { TagModalLegendaInformacao } from '../TagModalLegendaInformacao';
import { coresTagsDespesas } from '../../../../utils/CoresTags';

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
});

