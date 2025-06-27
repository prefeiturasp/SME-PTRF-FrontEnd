import React, { useState } from 'react';
import { Flex } from 'antd';
import ModalFormAdicionarPrioridade from './ModalFormAdicionarPrioridade';
import { useGetPrioridadeTabelas } from "./hooks/useGetPrioridadeTabelas";
import { useGetTiposDespesaCusteio } from "./hooks/useGetTiposDespesaCusteio";


const Prioridades = () => {

  const [modalForm, setModalForm] = useState({ open: false, data: null });
  const {isLoading: isLoadingPrioridadesTabelas, prioridades, recursos, tipos_aplicacao} = useGetPrioridadeTabelas();
  const { isLoading: isLoadingTiposDespesaCusteio, tipos_despesa_custeio } = useGetTiposDespesaCusteio();

  const modalFormData = {
    prioridades: prioridades,
    recursos: recursos,
    tipos_aplicacao: tipos_aplicacao,
    tipos_despesa_custeio: tipos_despesa_custeio
  }

  const abrirModal = async () => {
    setModalForm({ open: true, data: modalFormData });
  };

  return (
    <div>
      <Flex gutter={8} justify="space-between" align="flex-end" className="mb-4">
        <h5 className="mb-0">Prioridades</h5>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => abrirModal()}
          style={{ marginTop: '20px' }}
        >
          Adicionar nova prioridade
        </button>
      </Flex>

      {modalForm.open && (
        <ModalFormAdicionarPrioridade
          open={modalForm.open}
          data={modalForm.data}
          onClose={() => setModalForm({ open: false, data: null })}
        />
      )}
    </div>
  );
};

export default Prioridades;