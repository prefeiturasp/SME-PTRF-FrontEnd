import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataUltimaConciliacao } from '../DataUltimaConciliacao';

describe('DataUltimaConciliacao', () => {
  const defaultProps = {
    statusPrestacaoConta: 'FINALIZADA',
    dataUltimaConciliacao: '29/07/2025',
  };

  it('renderiza a data da última conciliação quando status está definido', () => {
    render(<DataUltimaConciliacao {...defaultProps} />);

    expect(
      screen.getByText(/Última conciliação feita em 29\/07\/2025/i)
    ).toBeInTheDocument();
  });

  it('não renderiza nada quando statusPrestacaoConta é undefined', () => {
    render(<DataUltimaConciliacao {...defaultProps} statusPrestacaoConta={undefined} />);

    expect(
      screen.queryByText(/Última conciliação feita/i)
    ).not.toBeInTheDocument();
  });

  it('exibe corretamente outra data informada', () => {
    render(
      <DataUltimaConciliacao
        statusPrestacaoConta="FINALIZADA"
        dataUltimaConciliacao="01/01/2025"
      />
    );

    expect(
      screen.getByText(/Última conciliação feita em 01\/01\/2025/i)
    ).toBeInTheDocument();
  });
});
