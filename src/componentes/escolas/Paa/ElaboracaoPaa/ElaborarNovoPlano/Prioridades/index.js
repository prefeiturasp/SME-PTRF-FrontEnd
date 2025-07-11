import React, { useState } from 'react';
import { Flex, Button, Spin } from 'antd';
import { Paginator } from "primereact/paginator";
import ModalFormAdicionarPrioridade from './ModalFormAdicionarPrioridade';
import { useGetPrioridadeTabelas } from "./hooks/useGetPrioridadeTabelas";
import { useGetPrioridades } from "./hooks/useGetPrioridades";
import { useGetTiposDespesaCusteio } from "./hooks/useGetTiposDespesaCusteio";
import { FormFiltros } from './FormFiltros';
import { MsgImgCentralizada } from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { Tabela } from './Tabela';


const filtroInicial = {
  prioridade: "",
  programa_pdde__uuid: undefined,
  acao_pdde__uuid: undefined,
  acao_associacao__uuid: undefined,
  tipo_aplicacao: "",
  tipo_despesa_custeio: "",
  especificacao_material__uuid: undefined,
};

const Prioridades = () => {
  const [filtros, setFiltros] = useState(filtroInicial);
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const [modalForm, setModalForm] = useState({ open: false, data: null });
  const { prioridadesTabelas, recursos, tipos_aplicacao } = useGetPrioridadeTabelas();
  const { tipos_despesa_custeio } = useGetTiposDespesaCusteio();
  const { isLoading: isLoadingPrioridades, prioridades, quantidade, refetch } = useGetPrioridades(filtros, currentPage);

  const modalFormData = {
    prioridades: prioridadesTabelas,
    recursos: recursos,
    tipos_aplicacao: tipos_aplicacao,
    tipos_despesa_custeio: tipos_despesa_custeio
  }

  const onPageChange = (event) => {
    setFirstPage(event.first);
    setCurrentPage(event.page + 1);
  };

  const onFiltrar = () => {
    refetch();
    setCurrentPage(1);
    setFirstPage(0);
  };

  const onFiltrosChange = (campo, valor) => {
    setFiltros((prev) => {
      return { ...prev, [campo]: valor };
    });
  };

  const limpaFiltros = () => {
    setFiltros(filtroInicial);
    setTimeout(() => refetch(), 0);
    setCurrentPage(1);
    setFirstPage(0);
  };

  const abrirModal = async () => {
    setModalForm({ open: true, data: modalFormData });
  };

  return (
    <div>
      <Flex gutter={8} justify="space-between" align="flex-end" className="mb-4">
        <h5 className="mb-0">Prioridades</h5>
        <Button
          type="primary"
          onClick={abrirModal}
          style={{ marginTop: '20px' }}
        >
          Adicionar nova prioridade
        </Button>
      </Flex>

      {/* Bloco de filtros com 7 selects */}
      {recursos && prioridadesTabelas && tipos_aplicacao && tipos_despesa_custeio && (
        <FormFiltros
          recursos={recursos}
          prioridadesTabelas={prioridadesTabelas}
          tipos_aplicacao={tipos_aplicacao}
          tipos_despesa_custeio={tipos_despesa_custeio}
          onFiltrar={onFiltrar}
          onFiltrosChange={onFiltrosChange}
          onLimparFiltros={limpaFiltros}
        />
      )}

      <Spin spinning={isLoadingPrioridades}>
        {prioridades && quantidade > 0 ? (
        <>
          <p className="mb-2 mt-4">
            <Flex justify="space-between" align="center">
              <span>
                Exibindo <span className="total">{prioridades?.length}</span> de{" "}
                <span className="total">{quantidade}</span>
              </span>

            </Flex>
          </p>
          <Tabela data={prioridades} />
          {quantidade > 10 && (
            <Paginator
              first={firstPage}
              rows={10}
              totalRecords={quantidade}
              template="PrevPageLink PageLinks NextPageLink"
              onPageChange={onPageChange}
              alwaysShow={false}
            />
          )}
        </>
      ) : (
        <MsgImgCentralizada
            texto={
              "Nenhum resultado encontrado."
            }
            img={Img404}
          />
      )}
    </Spin>

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