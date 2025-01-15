import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { TiposDocumento } from '..';
import { getTodosTiposDeDocumento } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postCreateTipoDeDocumento, patchAlterarTipoDeDocumento } from '../../../../../../services/sme/Parametrizacoes.service';
import * as service from "../../../../../../services/sme/Parametrizacoes.service";
import { Filtros } from '../Filtros';

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getTodosTiposDeDocumento: jest.fn(),
    postCreateTipoDeDocumento: jest.fn(),
    patchAlterarTipoDeDocumento: jest.fn(),
}));

jest.mock("../Filtros", () => ({
    Filtros: ({ handleChangeFiltros, handleSubmitFiltros, limpaFiltros }) => (
    <div>
      <button onClick={() => handleChangeFiltros("filtrar_por_nome", "test")}>Filtrar</button>
      <button onClick={handleSubmitFiltros}>Aplicar Filtros</button>
      <button onClick={limpaFiltros}>Limpar Filtros</button>
    </div>
  ),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

describe("Carrega página de Tipos de Documentos", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Renderiza a mensagem "Carregando..." ao abrir a página', () => {
        render(<TiposDocumento />);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("carrega no modo Listagem com itens", async () => {
        const mockData = [{ id: 1, nome: 'Tipo 1' }];
        getTodosTiposDeDocumento.mockResolvedValueOnce(mockData);
        render(
            <TiposDocumento />
        );
        expect(screen.getByText(/Tipo de Documento/i)).toBeInTheDocument();

        await waitFor(()=> expect(getTodosTiposDeDocumento).toHaveBeenCalledTimes(1));
        await waitFor(()=> expect(screen.getByText(/Tipo 1/i)).toBeInTheDocument());
    });

    it("carrega no modo Listagem vazia", async () => {
        const mockData = [];
        getTodosTiposDeDocumento.mockResolvedValue(mockData)
        render(
            <TiposDocumento />
        );

        await waitFor(()=> expect(getTodosTiposDeDocumento).toHaveBeenCalled());
        await waitFor(()=> {
            expect(screen.getByText(/Não existem tipos de documentos cadastrados, clique no botão "Adicionar tipo de documento" para começar./i)).toBeInTheDocument()
        });
    });
});

describe('Teste handleSubmitModalForm', () => {
    let carregaTodosMock;
    let setShowModalFormMock;
    let setErroExclusaoNaoPermitidaMock;
    let setShowModalInfoUpdateNaoPermitidoMock;

    beforeEach(() => {
        carregaTodosMock = jest.fn();
        setShowModalFormMock = jest.fn();
        setErroExclusaoNaoPermitidaMock = jest.fn();
        setShowModalInfoUpdateNaoPermitidoMock = jest.fn();
    });

    it('deve lidar com erro ao criar tipo de documento', async () => {
        postCreateTipoDeDocumento.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                try {
                    await postCreateTipoDeDocumento(payload);
                } catch (e) {
                    setErroExclusaoNaoPermitidaMock('Este tipo de documento já existe.');
                    setShowModalInfoUpdateNaoPermitidoMock(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);

        expect(postCreateTipoDeDocumento).toHaveBeenCalledWith({
            operacao: 'create',
            nome: 'Documento Teste',
        });
        expect(setErroExclusaoNaoPermitidaMock).toHaveBeenCalledWith('Este tipo de documento já existe.');
        expect(setShowModalInfoUpdateNaoPermitidoMock).toHaveBeenCalledWith(true);
    });

    it('deve atualizar tipo de documento com sucesso', async () => {
        patchAlterarTipoDeDocumento.mockResolvedValueOnce({});

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'update') {
                await patchAlterarTipoDeDocumento(values.uuid, payload);
            }
        });

        const values = { operacao: 'update', uuid: '1234', nome: 'Documento Atualizado' };

        await handleSubmitModalForm(values);

        expect(patchAlterarTipoDeDocumento).toHaveBeenCalledWith(
            '1234',
            { operacao: 'update', uuid: '1234', nome: 'Documento Atualizado' }
        );
    });

    it('deve criar um tipo de documento com sucesso quando operacao é "create"', async () => {
        const mockCarregaTodos = jest.fn();
        const setShowModalForm = jest.fn();

        postCreateTipoDeDocumento.mockResolvedValueOnce({});
        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                await postCreateTipoDeDocumento(payload);
                toastCustom.ToastCustomSuccess('Inclusão de tipo de documento realizado com sucesso.', 'O tipo de documento foi adicionado ao sistema com sucesso.');
                setShowModalForm(false);
                await mockCarregaTodos();
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);

        expect(postCreateTipoDeDocumento).toHaveBeenCalledWith({ operacao: 'create', nome: 'Documento Teste' });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Inclusão de tipo de documento realizado com sucesso.',
            'O tipo de documento foi adicionado ao sistema com sucesso.'
        );
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(mockCarregaTodos).toHaveBeenCalled();
        expect(values.operacao).toEqual('create');
    });

    it('deve lidar com erro de "non_field_errors" no create', async () => {
        postCreateTipoDeDocumento.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const setErroExclusaoNaoPermitida = jest.fn();
        const setShowModalInfoUpdateNaoPermitido = jest.fn();

        const handleSubmitModalForm = jest.fn(async (values) => {
            try {
                await postCreateTipoDeDocumento(values);
            } catch (e) {
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Este tipo de documento já existe.');
                    setShowModalInfoUpdateNaoPermitido(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);
        expect(setErroExclusaoNaoPermitida).toHaveBeenCalledWith('Este tipo de documento já existe.');
        expect(setShowModalInfoUpdateNaoPermitido).toHaveBeenCalledWith(true);
    });
});
