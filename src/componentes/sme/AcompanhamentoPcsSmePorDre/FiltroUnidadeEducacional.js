import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import {getTabelasPrestacoesDeContas} from "../../../services/dres/PrestacaoDeContas.service"
import {getResumoDRE} from "../../../services/sme/AcompanhamentoSME.service"
import {visoesService} from "../../../services/visoes.service";
import {getTabelaAssociacoes} from "../../../services/dres/Associacoes.service";
import {mantemEstadoAcompanhamentoDePcUnidade as meapcservice} from "../../../services/mantemEstadoAcompanhamentoDePcUnidadeEducacional.service";
import { Select } from 'antd';

export const FiltroUnidadeEducacional = (props) => {

    const { Option } = Select;
    const [termo, setTermo] = useState();
    const [tipoUnidade, setTipoUnidade] = useState("");
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [devolucaoAoTesouro, setDevolucaoAoTesouro] = useState(false);
    const [status, setStatus] = useState({'status': []});
    const [tabelaStatusUnidade, setTabelaStatusUnidade] = useState({});


    const carregaTabelaPrestacaoDeContas = useCallback(async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaStatusUnidade(tabela_prestacoes);
    }, [getTabelasPrestacoesDeContas]);

    useEffect(() => {
        const acompanhamento = meapcservice.getAcompanhamentoDePcUnidadeUsuarioLogado(props.dreUuid);
        if (acompanhamento) {
            setTermo(acompanhamento.filtra_por_termo);
            setTipoUnidade(acompanhamento.filtra_por_tipo_unidade);
            setDevolucaoAoTesouro(acompanhamento.filtra_por_devolucao_tesouro);
            setStatus({status:acompanhamento?.filtra_por_status ? acompanhamento.filtra_por_status?.split(',') : []});
        }
    }, []);

    const salvaAcompanhamentoDePcUnidadeLocalStorage = (filtra_por_termo, filtra_por_tipo_unidade, filtra_por_devolucao_tesouro, filtra_por_status) => {
    let objetoAcompanhamentoDePcUnidade = {
        filtra_por_termo: filtra_por_termo,
        filtra_por_tipo_unidade: filtra_por_tipo_unidade,
        filtra_por_devolucao_tesouro: filtra_por_devolucao_tesouro,
        filtra_por_status: filtra_por_status,
    }
        meapcservice.setAcompanhamentoPcUnidadePorUsuario(visoesService.getUsuarioLogin(), {[props.dreUuid]: objetoAcompanhamentoDePcUnidade})
    }
    

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    useEffect(() => {
        carregaTabelaPrestacaoDeContas();
    }, [carregaTabelaPrestacaoDeContas])

    useEffect(() => {
        buscaTabelaAssociacoes();
    }, []);

    const handleOnChangeMultipleSelectStatus =  async (value) => {
        let name = "status"

        setStatus({
            ...status,
            [name]: value
        });
    }

    const handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name === 'nome') {
            setTermo(value);
            salvaAcompanhamentoDePcUnidadeLocalStorage(value, tipoUnidade, devolucaoAoTesouro, status);
        } else if (name === 'tipo_unidade') {
            setTipoUnidade(value);
            salvaAcompanhamentoDePcUnidadeLocalStorage(termo, value, devolucaoAoTesouro, status);
        } else if (name === 'devolucaoAoTesouro') {
            setDevolucaoAoTesouro(value);
            salvaAcompanhamentoDePcUnidadeLocalStorage(termo, tipoUnidade, value, status);
        } else if (name === 'status') {
            setStatus(value);
            salvaAcompanhamentoDePcUnidadeLocalStorage(termo, tipoUnidade, devolucaoAoTesouro, value);
        }
    }

    const handleSubmit = async (event) => {
        props.setLoadingDataTable(true);
        event.preventDefault();
    
    let params = {
        dre_uuid: props.dreUuid,
        periodo_uuid: props.periodoUuid,
        nome: termo,
        tipo_unidade: tipoUnidade
    };
    if (devolucaoAoTesouro) {
        params.devolucao_ao_tesouro = devolucaoAoTesouro;
    }
    
    if (status.status) {
        params.status = status.status.join(',');
    }
    
    let unidadesEducacionais = await getResumoDRE(params.dre_uuid, params.periodo_uuid, params.nome, params.tipo_unidade, devolucaoAoTesouro, params.status);
    props.setUnidadesEducacionais(unidadesEducacionais)
    salvaAcompanhamentoDePcUnidadeLocalStorage(params.nome, params.tipo_unidade, params.devolucao_ao_tesouro, params.status);
    props.setLoadingDataTable(false);
    }


return (
    <Form onSubmit={handleSubmit}>
    <div className="row">
        <FormGroup className="col-md-6">
            <Label for="nome" className="mr-sm-2">Filtrar por termo</Label>
            <Input
                type="text"
                name="nome"
                id="nome"
                value={termo}
                placeholder="Filtrar por termo"
                onChange={handleChange}
            />
        </FormGroup>
        <FormGroup className="col-md-6">
            <Label for="tipo_unidade" className="mr-sm-2">Filtrar por tipo de unidade</Label>
            <Input
                type="select"
                name="tipo_unidade"
                id="tipo_unidade"
                value={tipoUnidade}
                onChange={handleChange}
                placeholder="Filtrar por tipo de unidade"
            >
            <option disabled value="">Selecione o tipo de unidade</option>
            {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.filter(element=> element.id !== 'ADM' && element.id !== 'DRE' && element.id !== 'IFSP' && element.id !== 'CMCT').map(item => (
                <option key={item.id} value={item.id}>{item.nome}</option>
            ))}
            </Input>
        </FormGroup>
    </div>
    <div className="row">
    <FormGroup className="col-md-6">
        <label htmlFor="devolucao_tesouro">Filtrar por devolução ao tesouro</label>
        <select
            value={devolucaoAoTesouro}
            onChange={(event) => setDevolucaoAoTesouro(event.target.value)}
            name="devolucao_tesouro"
            id="devolucao_tesouro"
            className="form-control"
        >
            <option disabled value="false">Selecione um tipo</option>
            <option value="1">Sim</option>
            <option value="0">Não</option>
        </select>
    </FormGroup>
        <FormGroup className="col-md-5">
        <Label for="status" className="mr-sm-2">Filtrar por status</Label>
        <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Selecione o status"
            name="status"
            id="status"
            value={status.status}
            onChange={handleOnChangeMultipleSelectStatus}
            className='multiselect-lista-valores-reprogramados'
        >
            <Option value=''>Selecione um status</Option>
                {tabelaStatusUnidade.status && tabelaStatusUnidade.status.length >  0 && tabelaStatusUnidade.status.map(item => (
            <Option key={item.id} value={item.id}>{item.nome}</Option>
        ))}
        </Select>
        </FormGroup>
        <Button type="submit" className="col-md-1 h-50 mr-0" style={{marginTop: '30px', background: '#00585D'}}>Filtrar</Button>
    </div>
    </Form>
)
}
