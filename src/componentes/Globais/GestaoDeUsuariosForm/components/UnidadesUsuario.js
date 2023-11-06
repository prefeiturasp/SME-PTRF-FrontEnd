import React, {useContext} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import { useUnidadesUsuario } from "../hooks/useUnidadesUsuario";
import { useHabilitarAcesso } from "../hooks/useHabilitarAcesso";
import { useDesabilitarAcesso } from "../hooks/useDesabilitarAcesso";

import { GestaoDeUsuariosFormContext } from "../context/GestaoDeUsuariosFormProvider";
import { UnidadesUsuarioContext } from "../context/UnidadesUsuarioProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Switch } from 'antd';
import ReactTooltip from "react-tooltip";
import Loading from "../../../../utils/Loading";
import { MsgImgCentralizada } from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg"
import { BarraTopoListagem } from "./BarraTopoListagem";
import { ModalConfirmacao } from "./ModalConfirmacao";


export const UnidadesUsuario = ({usuario}) => {
    const { visaoBase, uuidUnidadeBase, modo } = useContext(GestaoDeUsuariosFormContext)
    const { showModalRemoverAcesso, setShowModalRemoverAcesso, textoModalRemoverAcesso, payloadRemoveAcessoConcedidoSme, setPayloadRemoveAcessoConcedidoSme,  } = useContext(UnidadesUsuarioContext)

    const {isLoading, data} = useUnidadesUsuario(usuario, visaoBase, uuidUnidadeBase);
    const rowsPerPage = 10;
    const {mutationHabilitarAcesso} = useHabilitarAcesso();
    const {mutationDesabilitarAcesso} = useDesabilitarAcesso();

    const membroTemplate = (rowData) => {
        if(rowData.membro){
            return(
                <div className='p-2'>
                    <FontAwesomeIcon style={
                        {
                            marginRight: "3px",
                            color: '#297805'
                        }
                    }
                    icon={faCheckCircle}/>
                </div>
            )
        }
        else{
            return '-'
        }
        
    }

    const disableSwitchTemAcesso = (rowData) => {
        if(rowData.acesso_concedido_sme){
            return false;
        }

        if(usuario?.e_servidor && rowData.membro && rowData.unidade_em_exercicio === false){
            return true;
        }

        return false;
    }

    const temAcessoTemplate = (rowData) => {
        let tooltip = 'Não é possível habilitar o acesso nesta unidade pois não é uma unidade de exercício do servidor informado.'
        return(
            <div data-tip={tooltip} data-for={`tooltip-id-${rowData.uuid_unidade}`}>
                <Switch
                    onChange={() => handleChangeSwitchTemAcesso(rowData)}
                    checked={rowData.tem_acesso}
                    name="temAcessoSwitch"
                    disabled={disableSwitchTemAcesso(rowData)}
                    className={`switch-tem-acesso ${rowData.tem_acesso ? "switch-tem-acesso-checked" : ""}`}
                />
                
                {disableSwitchTemAcesso(rowData) &&
                    <ReactTooltip id={`tooltip-id-${rowData.uuid_unidade}`} html={true}/>
                }
            </div>
            
        )
    }

    const handleChangeSwitchTemAcesso = (rowData) => {
        let payload = {
            "username": rowData.username,
            "uuid_unidade": rowData.uuid_unidade,
            "acesso_concedido_sme": rowData.acesso_concedido_sme
        }

        if(rowData.acesso_concedido_sme){
            setPayloadRemoveAcessoConcedidoSme(payload);
            setShowModalRemoverAcesso(true);
        }
        else{
            acaoSwitchTemAcesso(payload, rowData.tem_acesso);
        }
    }

    const acaoSwitchTemAcesso = (payload, tem_acesso=true) => {
        if(tem_acesso){
            mutationDesabilitarAcesso.mutate({payload: payload});
            setShowModalRemoverAcesso(false);
        }
        else{
            mutationHabilitarAcesso.mutate({payload: payload});
        }
    }

    const unidadeEscolarTemplate = (rowData) => {
        return (
            <div>
                <p className="pb-0 mb-0">{rowData.nome_com_tipo}</p>

                {rowData.acesso_concedido_sme &&
                    <div className={`tag-acesso-habilitado-sme mt-2`} key={rowData.uuid}>
                        <span key={rowData.uuid}><strong>Acesso habilitado pela SME</strong></span>
                    </div>
                }
                
            </div>
        )
    };

    if(visaoBase === 'UE'){
        return
    }

    return (
        <>
            <BarraTopoListagem/>

            <section className="row">
                <section className="col-12">
                    {modo === 'Adicionar Usuário' 
                        ? 
                            <div className="box-unidades-usuario">
                                <p className="mb-0 text-center texto-info">Informe um ID de usuário para visualizar as Unidades</p>
                                <p className="mb-0 text-center texto-info">que o usuário esta em exercício ou já possui acesso.</p>
                            </div>
                        : 
                            isLoading &&
                                <div className="box-unidades-usuario">
                                    <Loading
                                        corGrafico="black"
                                        corFonte="dark"
                                        marginTop="0"
                                        marginBottom="0"
                                    />
                                </div>
                    }

                    {modo === 'Editar Usuário' && data.length > 0 && usuario && !isLoading ?
                        <>
                            <DataTable
                                value={data}
                                className="mt-2 container-tabela-associacoes"
                                paginator={data.length > rowsPerPage}
                                rows={rowsPerPage}
                                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                                autoLayout={true}
                            >
                                <Column 
                                    header="Nome" 
                                    body={unidadeEscolarTemplate}
                                />
                                <Column 
                                    header="Membro"
                                    body={membroTemplate}
                                    className="align-middle text-left borda-coluna"
                                    style={
                                        {
                                            borderRight: 'none',
                                            width: '10%'
                                        }
                                    }
                                />
                                <Column 
                                    header="Acesso"
                                    body={temAcessoTemplate}
                                    className="align-middle text-left borda-coluna"
                                />
                            </DataTable>
                        </>

                        :
                            !isLoading && modo === 'Editar Usuário' &&
                                <MsgImgCentralizada
                                    texto='Não encontramos resultados'
                                    img={Img404}
                                />
                    }
                    
                </section>
            </section>

            <section>
                <ModalConfirmacao
                    show={showModalRemoverAcesso}
                    titulo="Exclusão de unidade"
                    texto={textoModalRemoverAcesso}
                    botaoCancelarTexto="Cancelar"
                    botaoCancelarHandle={() => setShowModalRemoverAcesso(false)}
                    botaoConfirmarTexto="Salvar"
                    botaoConfirmarHandle={() => acaoSwitchTemAcesso(payloadRemoveAcessoConcedidoSme)}
                />
            </section>
            
        </>
    )
}