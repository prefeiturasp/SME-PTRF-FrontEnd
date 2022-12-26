import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import {getTabelasPrestacoesDeContas} from "../../../services/dres/PrestacaoDeContas.service"
import {getResumoDRE} from "../../../services/sme/AcompanhamentoSME.service"
import {getTabelaAssociacoes} from "../../../services/dres/Associacoes.service";
import { Select } from 'antd';

export const FiltroUnidadeEducacional = (props) => {
    const { Option } = Select;
    const [termo, setTermo] = useState('');
    const [tipoUnidade, setTipoUnidade] = useState('');
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [devolucaoAoTesouro, setDevolucaoAoTesouro] = useState(false);
    const [status, setStatus] = useState([]);
    const [tabelaStatusUnidade, setTabelaStatusUnidade] = useState({});

    const carregaTabelaPrestacaoDeContas = useCallback(async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaStatusUnidade(tabela_prestacoes);
    }, [getTabelasPrestacoesDeContas]);

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
        } else if (name === 'tipo_unidade') {
            setTipoUnidade(value);
        } else if (name === 'devolucaoAoTesouro') {
            setDevolucaoAoTesouro(value);
        } else if (name === 'status') {
            setStatus(value);
        }
    }

    const handleSubmit = async (event) => {
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
                defaultValue={termo}
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
                defaultValue={tipoUnidade}
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
        <Label for="status_pc" className="mr-sm-2">Filtrar por status</Label>
        <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Selecione o status"
            name="status_pc"
            id="status_pc"
            defaultValue={status}
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
