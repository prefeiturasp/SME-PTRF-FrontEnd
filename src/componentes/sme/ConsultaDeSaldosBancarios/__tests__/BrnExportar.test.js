import { render, screen } from '@testing-library/react';
import { BtnExportar } from '../BtnExportar';

describe('ElaborarNovoPlano Component', () => {
  test('renderiza o botão', () => {
    render(<BtnExportar />);
    expect(screen.getByText('Exportar planilha')).toBeInTheDocument();
  });
});