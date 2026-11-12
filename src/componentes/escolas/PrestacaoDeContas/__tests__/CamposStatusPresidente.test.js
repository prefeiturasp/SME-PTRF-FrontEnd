import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CamposStatusPresidente } from '../CamposStatusPresidente';
import * as prestacaoService from '../../../../services/escolas/PrestacaoDeContas.service';
import * as mandatosService from '../../../../services/MandatosVacancia.service';

jest.mock('../../../../services/escolas/PrestacaoDeContas.service');
jest.mock('../../../../services/MandatosVacancia.service');
jest.mock('../../../../services/auth.service', () => ({
  ASSOCIACAO_UUID: 'UUID_FAKE',
}));

const substitutosOcupados = [
  { id: 'VICE_PRESIDENTE_DIRETORIA_EXECUTIVA', cargo: 'Vice-Presidente', nome: 'Ana Vice' },
  { id: 'VOGAL_1', cargo: 'Vogal', nome: 'Bruno Vogal' },
];

const conselheirosOcupados = [
  { id: 'PRESIDENTE_CONSELHO_FISCAL', nome: 'Ana Goncalves Barros' },
  { id: 'CONSELHEIRO_1', nome: 'Carlos Conselheiro' },
];

const CamposComConclusao = () => {
  const [podeConcluir, setPodeConcluir] = useState(false);

  return (
    <>
      <CamposStatusPresidente onDefinir={(_dados, valido) => setPodeConcluir(valido)} />
      <button type="button" disabled={!podeConcluir}>Concluir período</button>
    </>
  );
};

const promessaPendente = () => new Promise(() => {});

describe('CamposStatusPresidente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('UUID_FAKE', 'uuid-assoc');
    mandatosService.getSubstitutosPresidenteVacancia.mockResolvedValue(substitutosOcupados);
    mandatosService.getConselheirosAssinaturaVacancia.mockResolvedValue(conselheirosOcupados);
    prestacaoService.getStatusPresidente.mockResolvedValue({
      status_presidente: 'AUSENTE',
      cargo_substituto_presidente_ausente: 'VOGAL_1',
      cargo_conselheiro_assinatura: 'PRESIDENTE_CONSELHO_FISCAL',
    });
  });

  describe('carregamento', () => {
    it('deve desabilitar o status, o conselheiro e a conclusão enquanto os dados carregam', () => {
      prestacaoService.getStatusPresidente.mockReturnValue(promessaPendente());
      mandatosService.getSubstitutosPresidenteVacancia.mockReturnValue(promessaPendente());
      mandatosService.getConselheirosAssinaturaVacancia.mockReturnValue(promessaPendente());

      render(<CamposComConclusao />);

      expect(screen.getByRole('switch')).toBeDisabled();
      expect(screen.getByRole('combobox', { name: 'Conselheiro da assinatura' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();
      expect(screen.queryByLabelText('Responsável pelas atribuições:')).not.toBeInTheDocument();
    });
  });

  describe('edição', () => {
    it('deve exibir o substituto e o conselheiro salvos e habilitar a conclusão', async () => {
      render(<CamposComConclusao />);

      expect(await screen.findByLabelText('Responsável pelas atribuições:')).toHaveDisplayValue('Vogal - Bruno Vogal');
      expect(screen.getByRole('option', { name: 'Vogal - Bruno Vogal' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Ana Goncalves Barros' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeEnabled();
    });

    it('deve ocultar o responsável e manter a conclusão habilitada ao marcar o presidente como presente', async () => {
      const user = userEvent.setup();
      render(<CamposComConclusao />);

      await screen.findByLabelText('Responsável pelas atribuições:');
      await user.click(screen.getByRole('switch'));

      expect(screen.queryByLabelText('Responsável pelas atribuições:')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Conselheiro da assinatura' })).toHaveDisplayValue(
        'Ana Goncalves Barros',
      );
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeEnabled();
    });

    it('deve desabilitar a conclusão quando o presidente está ausente e nenhum responsável foi escolhido', async () => {
      const user = userEvent.setup();
      prestacaoService.getStatusPresidente.mockResolvedValue({
        status_presidente: 'PRESENTE',
        cargo_substituto_presidente_ausente: null,
        cargo_conselheiro_assinatura: 'PRESIDENTE_CONSELHO_FISCAL',
      });
      render(<CamposComConclusao />);

      await screen.findByRole('option', { name: 'Ana Goncalves Barros' });
      await user.click(screen.getByRole('switch'));

      expect(screen.getByLabelText('Responsável pelas atribuições:')).toHaveDisplayValue('Escolha o responsável');
      expect(screen.getByRole('option', { name: 'Escolha o responsável' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();
    });

    it('deve desabilitar a conclusão enquanto nenhum conselheiro está selecionado', async () => {
      const user = userEvent.setup();
      prestacaoService.getStatusPresidente.mockResolvedValue({
        status_presidente: 'AUSENTE',
        cargo_substituto_presidente_ausente: 'VOGAL_1',
        cargo_conselheiro_assinatura: null,
      });
      render(<CamposComConclusao />);

      await screen.findByRole('option', { name: 'Carlos Conselheiro' });
      const conselheiro = screen.getByRole('combobox', { name: 'Conselheiro da assinatura' });
      expect(conselheiro).toHaveDisplayValue('Escolha o conselheiro');
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();

      await user.selectOptions(conselheiro, 'CONSELHEIRO_1');

      expect(conselheiro).toHaveDisplayValue('Carlos Conselheiro');
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeEnabled();
    });

    it('deve deixar o responsável em branco quando o cargo salvo não está mais ocupado', async () => {
      prestacaoService.getStatusPresidente.mockResolvedValue({
        status_presidente: 'AUSENTE',
        cargo_substituto_presidente_ausente: 'VOGAL_1',
        cargo_conselheiro_assinatura: 'PRESIDENTE_CONSELHO_FISCAL',
      });
      mandatosService.getSubstitutosPresidenteVacancia.mockResolvedValue([
        { id: 'VICE_PRESIDENTE_DIRETORIA_EXECUTIVA', cargo: 'Vice-Presidente', nome: 'Ana Vice' },
      ]);
      render(<CamposComConclusao />);

      expect(await screen.findByLabelText('Responsável pelas atribuições:')).toHaveDisplayValue(
        'Escolha o responsável',
      );
      expect(screen.queryByRole('option', { name: 'Vogal - Bruno Vogal' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();
    });

    it('deve exibir só a opção de escolha quando não há substituto ocupado', async () => {
      mandatosService.getSubstitutosPresidenteVacancia.mockResolvedValue([]);
      render(<CamposComConclusao />);

      const responsavel = await screen.findByLabelText('Responsável pelas atribuições:');

      expect(responsavel).toHaveDisplayValue('Escolha o responsável');
      expect(screen.getByRole('option', { name: 'Escolha o responsável' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'Vogal - Bruno Vogal' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();
    });
  });
});
