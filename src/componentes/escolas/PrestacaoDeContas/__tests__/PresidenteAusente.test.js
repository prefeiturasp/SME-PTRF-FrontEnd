import { render, screen } from '@testing-library/react';
import { PresidenteAusente } from '../PresidenteAusente';

jest.mock('../../../Globais/BarraMensagem', () => ({
  barraMensagemCustom: {
    BarraMensagemSucessAzul: (msg) => <div>{msg}</div>,
  },
}));

const textoDaBarra = /O Presidente da Diretoria Executiva consta como ausente/;

const renderBarra = (prestacaoContasStatus) => {
  render(
    <PresidenteAusente
      statusPC={{
        prestacao_contas_status: prestacaoContasStatus,
      }}
    />,
  );
};

describe('PresidenteAusente', () => {
  describe('exibição', () => {
    it('não deve exibir a barra quando o presidente está presente no período', () => {
      renderBarra({
        documentos_gerados: true,
        status_presidente: 'PRESENTE',
      });

      expect(screen.queryByText(textoDaBarra)).not.toBeInTheDocument();
    });

    it('não deve exibir a barra antes da conclusão com sucesso', () => {
      renderBarra({
        documentos_gerados: false,
        status_presidente: 'AUSENTE',
        cargo_substituto_presidente_ausente_value: 'Vogal 3',
      });

      expect(screen.queryByText(textoDaBarra)).not.toBeInTheDocument();
    });

    it('não deve exibir a barra quando o status do período não foi carregado', () => {
      render(<PresidenteAusente statusPC={undefined} />);

      expect(screen.queryByText(textoDaBarra)).not.toBeInTheDocument();
    });

    it('deve exibir a barra depois da conclusão, com Vogal sem número e sem a orientação da tela de membros', () => {
      renderBarra({
        documentos_gerados: true,
        status_presidente: 'AUSENTE',
        cargo_substituto_presidente_ausente_value: 'Vogal 3',
      });

      const mensagem = screen.getByText(textoDaBarra);
      expect(mensagem).toHaveTextContent('habilitados para o Vogal da Diretoria Executiva.');
      expect(mensagem).not.toHaveTextContent('Vogal 3');
      expect(mensagem).not.toHaveTextContent('tela dos membros da Associação');
    });

    it('deve exibir o cargo do substituto quando ele não é vogal', () => {
      renderBarra({
        documentos_gerados: true,
        status_presidente: 'AUSENTE',
        cargo_substituto_presidente_ausente_value: 'Vice-Presidente da Diretoria Executiva',
      });

      expect(screen.getByText(textoDaBarra)).toHaveTextContent(
        'habilitados para o Vice-Presidente da Diretoria Executiva.',
      );
    });
  });
});
