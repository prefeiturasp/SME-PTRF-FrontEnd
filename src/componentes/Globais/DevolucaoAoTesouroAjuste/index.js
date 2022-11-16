import React, {useEffect, useState, useCallback} from "react";
import { useHistory } from "react-router-dom";
import {DatePickerField} from "../DatePickerField";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {useLocation} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {toastCustom} from "../ToastCustom"
import { marcarDevolucaoTesouro, desmarcarDevolucaoTesouro, getSalvarDevoulucoesAoTesouro, deleteDevolucaoAoTesouro } from '../../../services/dres/PrestacaoDeContas.service.js'
import {ModalBootstrapDeleteDevolucaoAoTesouro} from "../ModalBootstrap"
import moment from "moment";

import './../../../componentes/escolas/GeracaoDaAta/geracao-da-ata.scss'

export const DevolucaoAoTesouroAjuste = () => {
    const { state } = useLocation();

    const history = useHistory();
    const [devolucao, setDevolucao] = useState([]);
    const [despesa, setDespesas] = useState([]);
    const [dateDevolucao, setDateDevolucao] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [ModalDevolucaoAoTesouro, setModalDevolucaoAoTesouro] = useState(false)

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            setDespesas(state.analise_lancamento.acertos[0].devolucao_ao_tesouro.despesa);
            setDevolucao(state.analise_lancamento.acertos[0].devolucao_ao_tesouro)
            setDateDevolucao(state.analise_lancamento.acertos[0].devolucao_ao_tesouro.data)
        }
        return () =>{
            mounted = false
        }
    }, [state.uuid_pc, state.uuid_despesa])

    const validateDate = (value) => {
        if (!(value instanceof Date)) {
        setErrorMessage('Data é um campo obrigatório')
        }
    }

    const handleChangeDataDevolucao = useCallback((name, value) => {
        validateDate(value)
        setDateDevolucao(value)
    }, [])

    const handleCancelar = () => {
        history.push(`${state.origem}/${state.uuid_pc}`)
    }

    const handleModalDevolucaoAoTesouro = () => {
        setModalDevolucaoAoTesouro(false)
    }

    const temDataDevolucao = () => {
        const data = state.analise_lancamento.acertos[0].devolucao_ao_tesouro.data
        return data
    }

    const deleteDevolucaoTesouro = async () => {
        const payload = {
            'devolucoes_ao_tesouro_a_apagar': [
                {
                    'uuid': devolucao.uuid_registro_devolucao,
                }
            ]
        }
        await deleteDevolucaoAoTesouro(state.uuid_pc, payload)
        await desmarcarDevolucaoTesouro(state.uuid_analise_lancamento)
        toastCustom.ToastCustomSuccess('Devolução ao tesouro removida com sucesso.')
        history.push(`${state.origem}/${state.uuid_pc}`)
    }

    const submitAlteracaoDevolucaoTesouro = async () => {
        let payload = {
            devolucoes_ao_tesouro_da_prestacao: [
                {
                    uuid: devolucao.uuid_registro_devolucao,
                    data: new Date(dateDevolucao).toISOString().slice(0, 10),
                    devolucao_total: devolucao.devolucao_total,
                    motivo: devolucao.motivo,
                    valor: devolucao.valor,
                    tipo: devolucao.tipo.uuid,
                    despesa: despesa.uuid,
                    visao_criacao: devolucao.visao_criacao,
                }
            ]
        }
        await getSalvarDevoulucoesAoTesouro(state.uuid_pc, payload);
        await marcarDevolucaoTesouro(state.uuid_analise_lancamento);
        toastCustom.ToastCustomSuccess('Data de devolução ao tesouro alterada com sucesso.')
        history.push(`${state.origem}/${state.uuid_pc}`)
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Devolução ao tesouro</h1>
            <div className="page-content-inner">
                <table className="table table-bordered tabela-devolucoes-ao-tesouro">
                    <thead>
                    <tr>
                        <th scope="col">Razão Social</th>
                        <th scope="col">CNPJ ou CPF</th>
                        <th scope="col">Tipo de Doc.</th>
                        <th scope="col">Nº do Doc.</th>
                        <th scope="col">Data Doc.</th>
                        <th scope="col">Valor da Devolução</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr key="devolucao">
                            <td>{despesa.nome_fornecedor}</td>
                            <td>{despesa.cpf_cnpj_fornecedor}</td>
                            <td>{despesa.tipo_documento ? despesa.tipo_documento.nome : ''}</td>
                            <td>{despesa.numero_documento}</td>
                            <td>{moment(new Date(despesa.data_documento), "YYYY-MM-DD").format("DD/MM/YYYY")}</td>
                            <td>{typeof(devolucao.valor) === 'string' ? devolucao.valor.replace('.', ',') : ''}</td>
                        </tr>
                    </tbody>
                </table>
                {<div className="row">
                    <div
                        className="col-md-3 mt-2 pr-0 mr-xl-n3 mr-lg-n2">
                        <label htmlFor="data">Insira a data de realização da devolução:</label>
                    </div>
                    <div className="col-md-2 col-sm-12 col-md-1 pl-0">
                        <div className="form-group">
                            <DatePickerField
                                name='devolucoes_ao_tesouro_da_prestacao'
                                placeholderText='dd/mm/aaaa'
                                value={dateDevolucao}
                                onChange={handleChangeDataDevolucao}
                                disabled={!state.tem_permissao_de_edicao}
                                required={true}
                            />
                            {errorMessage.length > 0 && <span className="text-danger mt-1">{errorMessage}</span>}
                        </div>
                    </div>
                    <div
                        className="col-md-6 col-sm-6 w-100">
                        <button 
                            className="btn btn-outline-success mr-1"
                            onClick={handleCancelar}>
                            Cancelar
                        </button>
                        <Button 
                            variant="success"
                            className="btn btn-sucess ml-1"
                            onClick={submitAlteracaoDevolucaoTesouro}
                            disabled={!state.tem_permissao_de_edicao || !dateDevolucao}
                        >
                            Salvar
                        </Button>
                        <Button
                            variant="danger"
                            className="btn btn-danger ml-1"
                            onClick={() => setModalDevolucaoAoTesouro(true)}
                            disabled={!state.tem_permissao_de_edicao || temDataDevolucao() === null}
                        >
                            Desfazer dev. tesouro
                        </Button>
                    </div>
                </div>
                }
            </div>
            <ModalBootstrapDeleteDevolucaoAoTesouro
                show={ModalDevolucaoAoTesouro}
                onHide={handleModalDevolucaoAoTesouro}
                titulo="Deseja desfazer o registro de depósito da devolução ao tesouro? "
                bodyText={"Isso significará que essa devolução não foi realizada. Você poderá fazer um novo registro se desejar."}
                primeiroBotaoOnclick={() => setModalDevolucaoAoTesouro(false)}
                primeiroBotaoTexto="Cancelar"
                primeiroBotaoCss="outline-success"
                segundoBotaoOnclick={deleteDevolucaoTesouro}
                segundoBotaoTexto="Confirmar"
                segundoBotaoCss="success"
            />
            
        </PaginasContainer>
    )
};