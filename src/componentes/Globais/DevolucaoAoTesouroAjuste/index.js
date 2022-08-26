import React, {useEffect, useState, useCallback} from "react";
import {DatePickerField} from "../DatePickerField";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import { getPrestacaoDeContasDetalhe } from "../../../services/dres/PrestacaoDeContas.service"
import {useLocation} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {toastCustom} from "../../../componentes/Globais/ToastCustom"
import { marcarDevolucaoTesouro, getSalvarDevoulucoesAoTesouro } from '../../../services/dres/PrestacaoDeContas.service.js'

import './../../../componentes/escolas/GeracaoDaAta/geracao-da-ata.scss'

export const DevolucaoAoTesouroAjuste = ({}) => {
    const { state } = useLocation();
    const [devolucao, setDevolucao] = useState([]);
    const [despesa, setDespesas] = useState([]);
    const [dateDevolucao, setDateDevolucao] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let mounted = true;
        getPrestacaoDeContasDetalhe(state.uuid_pc).then(prestacao => {
            prestacao.devolucoes_ao_tesouro_da_prestacao.forEach(devolucao => {
                if (devolucao.despesa.uuid === state.uuid_despesa) {
                    if (mounted) {
                      setDevolucao(devolucao)
                      setDespesas(devolucao.despesa)
                      if (devolucao.data) {
                          setDateDevolucao(devolucao.data)
                      }
                    }
                }
            });
        }).catch(error => {
            console.log("Erro: ", error);
        });
        return () =>{
            mounted = false
        }
    }, [])

    const validateDate = (value) => {
        if (!value) {
            setErrorMessage("é Necessário um campo de data para a ação.")
        }
        if (!(value instanceof Date)) {
          setErrorMessage('precisa ser uma data valida.')
        }
    }

    const handleChangeDataDevolucao = useCallback((name, value) => {
        validateDate(value)
        setDateDevolucao(value)
    }, [])

    const handleCancelar = () => {
        window.history.go(-1);
    }

    const submitAlteracaoDevolucaoTesouro = async () => {
        let payload = {
            devolucoes_ao_tesouro_da_prestacao: [
                {
                    data: new Date(dateDevolucao).toISOString().slice(0, 10),
                    devolucao_total: devolucao.devolucao_total,
                    motivo: devolucao.motivo,
                    valor: devolucao.valor,
                    tipo: devolucao.tipo.uuid,
                    despesa: despesa.uuid,
                    visao_criacao: devolucao.visao_criacao,
                    uuid: devolucao.uuid,
                }
            ]
        }
        await getSalvarDevoulucoesAoTesouro(state.uuid_pc, payload);
        await marcarDevolucaoTesouro(state.uuid_analise_lancamento);
        toastCustom.ToastCustomSuccess('Data de devolução ao tesouro alterada com sucesso.')
        window.history.go(-1);
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Devolução ao tesouro table</h1>
            <div className="page-content-inner">
                <table className="table table-bordered tabela-devolucoes-ao-tesouro">
                    <thead>
                    <tr>
                        <th scope="col">Razão Social</th>
                        <th scope="col">CNPJ ou CPF</th>
                        <th scope="col">Tipo de Doc.</th>
                        <th scope="col">Nº do Doc.</th>
                        <th scope="col">Data Doc.</th>
                        <th scope="col">Vr. Devolução</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr key="devolucao">
                            <td>{despesa.nome_fornecedor}</td>
                            <td>{despesa.cpf_cnpj_fornecedor}</td>
                            <td>{despesa.tipo_documento ? despesa.tipo_documento.nome : ''}</td>
                            <td>{despesa.numero_documento}</td>
                            <td>{despesa.data_documento}</td>
                            <td>{despesa.valor_total}</td>
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
                        className="col-md-3 col-sm-2 w-100">
                        <button 
                            className="btn btn-outline-success mr-4"
                            onClick={handleCancelar}>
                            Cancelar
                        </button>
                        <Button
                            variant="success"
                            className="btn btn-sucess pr-4 pl-4"
                            onClick={submitAlteracaoDevolucaoTesouro}
                        >
                            Salvar
                        </Button>
                    </div>
                </div>
                }
            </div>
            
        </PaginasContainer>
    )
};