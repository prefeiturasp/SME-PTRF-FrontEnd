import React, { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RepassesContext } from "../context/Repasse";

import { getAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";

import { useGetRepasses } from "../hooks/useGetRepasses";
import { usePostRepasse } from "../hooks/usePostRepasse";
import { usePatchRepasse } from "../hooks/usePatchRepasse";

import ReactTooltip from "react-tooltip";
import { round, trataNumericos } from "../../../../../../utils/ValidacoesAdicionaisFormularios";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../../utils/Loading";
import { ModalForm } from "./ModalForm";

export const Lista = () => {

    const { setShowModalForm, stateFormModal, setStateFormModal, setBloquearBtnSalvarForm, showModalConfirmacaoExclusao } = useContext(RepassesContext)
    const { isLoading, data, count } = useGetRepasses()

    const { mutationPost } = usePostRepasse();
    const { mutationPatch } = usePatchRepasse();

    // Este trecho é responsável pelo auto complete de unidades
    const [todasAsAssociacoesAutoComplete, setTodasAsAssociacoesAutoComplete] = useState([]);
    const [loadingAssociacoes, setLoadingAssociacoes] = useState(true);

    const fetchAssociacoes = async () => {
        let todas_associacoes = await getAssociacoes();
        setLoadingAssociacoes(false);
        setTodasAsAssociacoesAutoComplete(todas_associacoes);
    };

    useEffect(() => {
        fetchAssociacoes();
    }, [])
    // Fim trecho auto complete de unidades

    // Necessária pela paginação
    const {results} = data

    const handleEditFormModal = (rowData) => {
        let valor_capital = rowData.valor_capital ? Number(rowData.valor_capital).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }) : ""

        let valor_custeio = rowData.valor_custeio ? Number(rowData.valor_custeio).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }) : ""

        let valor_livre = rowData.valor_livre ? Number(rowData.valor_livre).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }) : ""

        setStateFormModal({
            ...stateFormModal,
            uuid: rowData.uuid,
            associacao: rowData.associacao.uuid,
            valor_capital: valor_capital,
            valor_custeio: valor_custeio,
            valor_livre: valor_livre,
            conta_associacao: rowData.conta_associacao.uuid,
            acao_associacao: rowData.acao_associacao.uuid,
            periodo: rowData.periodo.uuid,
            status: rowData.status,
            realizado_capital: rowData.realizado_capital,
            realizado_custeio: rowData.realizado_custeio,
            realizado_livre: rowData.realizado_livre,
            nome_unidade: rowData.associacao.unidade.nome_com_tipo,
            carga_origem: rowData.carga_origem,
            id_linha_carga: rowData.carga_origem_linha_id,
            id: rowData.id,
            campos_editaveis: rowData.campos_editaveis
        });
        setShowModalForm(true)
    };

    const handleSubmitFormModal = async (values) => {
        // Libera o botão somente após ter resolvido a mutation em usePostMotivoRejeicao e usePatchMotivoRejeicao
        setBloquearBtnSalvarForm(true)
        let payload = {
            acao_associacao: values.acao_associacao,
            conta_associacao: values.conta_associacao,
            periodo: values.periodo,
            realizado_capital: values.realizado_capital,
            realizado_custeio: values.realizado_custeio,
            realizado_livre: values.realizado_livre,
            status: values.status,
            associacao: values.associacao,
            valor_capital: round(trataNumericos(values.valor_capital), 2),
            valor_custeio: round(trataNumericos(values.valor_custeio), 2),
            valor_livre: round(trataNumericos(values.valor_livre), 2),
        };

        if(!values.uuid){
            mutationPost.mutate({payload: payload})
        }
        else{
            mutationPatch.mutate({uuid_repasse: values.uuid, payload: payload})
        }
    };

    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button className="btn-editar-membro" onClick={() => handleEditFormModal(rowData)}>
                    <span data-tip="Editar repasse" data-html={true}>
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                            icon={faEdit}
                        />
                        <ReactTooltip/>
                    </span>
                </button>
            </div>
        )
    };

    const valorCapitalTemplate = (rowData) => {
        return `R$ ${rowData.valor_capital}`
    }

    const valorCusteioTemplate = (rowData) => {
        return `R$ ${rowData.valor_custeio}`
    }

    const valorLivreTemplate = (rowData) => {
        return `R$ ${rowData.valor_livre}`
    }

    const statusTemplate = (rowData) => {
        if(rowData.status === 'REALIZADO'){
            return "Realizado"
        }
        else if(rowData.status === 'PENDENTE'){
            return "Pendente"
        }
    }

    if (isLoading) {
        return (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        );
    }
    return (
        <>
            {results && results.length > 0 ? (
                    <>
                    <p className='mb-0'>Exibindo <span className='total'>{count}</span> repasses</p>
                    <div className="mt-2">
                        <DataTable
                            value={results}
                            className='tabela-lista-motivos-rejeicao'
                            autoLayout={true}
                        >
                            <Column field="associacao.unidade.nome_com_tipo" header="Unidade Educacional" style={{width: '15%'}}/>
                            <Column field="periodo.referencia" header="Período"/>
                            <Column field="valor_capital" header="Valor capital" body={valorCapitalTemplate}/>
                            <Column field="valor_custeio" header="Valor custeio" body={valorCusteioTemplate}/>
                            <Column field="valor_livre" header="Valor livre aplicação" body={valorLivreTemplate}/>
                            <Column field="conta_associacao.nome" header="Tipo de conta"/>
                            <Column field="acao_associacao.nome" header="Ação"/>
                            <Column field="status" header="Status" body={statusTemplate}/>

                            <Column
                                field="acao"
                                header="Ação"
                                body={acoesTemplate}
                                style={{width: '10%', textAlign: "center",}}
                            />
                        </DataTable>
                    </div>
                    </>
                ) :
                <div className="p-2">
                    <p><strong>Nenhum resultado encontrado.</strong></p>
                </div>
            }

            <section>
                <ModalForm
                    handleSubmitFormModal={handleSubmitFormModal}
                    todasAsAssociacoesAutoComplete={todasAsAssociacoesAutoComplete}
                    loadingAssociacoes={loadingAssociacoes}
                />
            </section>
        </>
    )
}