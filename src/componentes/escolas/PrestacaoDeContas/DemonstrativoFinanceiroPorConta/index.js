import React, {Component} from "react";
import {previa, documentoFinal, getDemonstrativoInfo, documentoPrevia} from "../../../../services/escolas/DemonstrativoFinanceiro.service";
import {ModalPrevia} from "../ModalGerarPrevia";
import {ModalPreviaSendoGerada} from "../ModalGerarPreviaSendogerada";
import moment from "moment";
import Spinner from "../../../../assets/img/spinner.gif"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import { SplitButton } from 'primereact/splitbutton';

export default class DemonstrativoFinanceiroPorConta extends Component {
    _isMounted = false;

    _loading = Spinner

    state = {
        mensagem: "",
        show: false,
        data_inicio: null,
        data_fim: null,
        mensagemErro: "",
        status: "",
        showGerandoPreviaDoc: false,
        previaEmAndamento: false,
        mensagemAntesPreviaIniciar: "xxx"
    };


    paraMonitoramentoGeracao() {
        clearInterval(this.timer);
    }

    iniciaMonitoramentoGeracao() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
                this.demonstrativoFinanceiroInfo();
            }, 5000);
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.demonstrativoFinanceiroInfo();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.periodoPrestacaoDeConta !== this.props.periodoPrestacaoDeConta || prevProps.contaPrestacaoDeContas !== this.props.contaPrestacaoDeContas) {
            await this.demonstrativoFinanceiroInfo();
        }

        if (this.state.status !== prevState.status || (this.state.previaEmAndamento !== prevState.previaEmAndamento) ){

            if (this.state.status === 'EM_PROCESSAMENTO' || this.state.previaEmAndamento){
                this.iniciaMonitoramentoGeracao()
            }
            else {
                this.paraMonitoramentoGeracao()
            }

        }

        if (
            (this.state.mensagem !== prevState.mensagem || this.state.status !== prevState.status) &&
            this.state.status === "CONCLUIDO"&&
            this.state.previaEmAndamento &&
            this.state.mensagem !== this.state.mensagemAntesPreviaIniciar
        ){
            this.setState({previaEmAndamento: false})
            this.paraMonitoramentoGeracao()
        }


    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    demonstrativoFinanceiroInfo = async () => {
        const periodo = this.props.periodoPrestacaoDeConta.periodo_uuid;
        const conta = this.props.contaPrestacaoDeContas.conta_uuid;
        getDemonstrativoInfo(conta, periodo).then(
            (mensagem) => {
                if(this._isMounted) {
                    this.setState({mensagem: mensagem});
                    if (mensagem.includes('Aguarde')){
                        this.setState({status: 'EM_PROCESSAMENTO'})
                    }
                    else if(mensagem.includes('pendente')){
                        this.setState({status: 'PENDENTE'})
                    }
                    else {
                        this.setState({status: 'CONCLUIDO'})
                    }
                }

            }
        );

    };

    showPrevia = () => {
        this.setState({show: true});
        let data_inicio = this.props.periodoPrestacaoDeConta.data_inicial;
        let data_fim = this.props.periodoPrestacaoDeConta.data_final;
        this.setState({data_inicio: data_inicio, data_fim: data_fim})
    };

    handleOkGerandoPrevia = () => {
        this.setState({showGerandoPreviaDoc: false});
    };


    onHide = () => {
        this.setState({show: false});
    };

    handleChange = (name, value) => {
        this.setState({
            ...this.state,
            [name]: value !== "" && value !== null ? moment(value, "YYYY-MM-DD").format("YYYY-MM-DD"): ""
        });
        this.setState({mensagemErro: ""})
    };
    
    gerarPrevia = async () => {
        this.setState({show: false})
        this.setState({status: 'EM_PROCESSAMENTO', previaEmAndamento: true, mensagemAntesPrevia: this.state.mensagem})

        if (this.state.data_fim === null || this.state.data_fim === "") {
            this.setState({mensagemErro: "Data final não pode ser vazia!"});
            return

        }
        let data_inicio = new Date(this.state.data_inicio);
        let data_fim = new Date(this.state.data_fim);
        if (data_fim.getTime() < data_inicio.getTime()) {
            this.setState({mensagemErro: "Data final não pode ser menor que a Data inicial"});
            return

        }
        let data_fim_periodo_verifica = this.props.periodoPrestacaoDeConta.data_final;

        let data_fim_periodo = new Date(this.props.periodoPrestacaoDeConta.data_final);
        if (data_fim_periodo_verifica && data_fim.getTime() > data_fim_periodo.getTime()) {
            this.setState({mensagemErro: "Data final não pode ser maior que a data final do período."});
            return

        }
        const periodo = this.props.periodoPrestacaoDeConta.periodo_uuid;

        const conta = this.props.contaPrestacaoDeContas.conta_uuid;
        this.setState({showGerandoPreviaDoc: true})
        await previa(conta, periodo, this.state.data_inicio, this.state.data_fim);
    };

    downloadDocumentoFinal = async (formato) => {
        const periodo = this.props.periodoPrestacaoDeConta.periodo_uuid;
        const conta = this.props.contaPrestacaoDeContas.conta_uuid;
        await documentoFinal(conta, periodo, formato);
        await this.demonstrativoFinanceiroInfo();
    };

    downloadDocumentoPrevia = async (formato) => {
        const periodo = this.props.periodoPrestacaoDeConta.periodo_uuid;
        const conta = this.props.contaPrestacaoDeContas.conta_uuid;
        await documentoPrevia(conta, periodo, formato);
        await this.demonstrativoFinanceiroInfo();
    };

    render() {
        const {mensagem, status, previaEmAndamento} = this.state;
        const exibeLoading = status === 'EM_PROCESSAMENTO' || previaEmAndamento;
        const documentoPrevio = mensagem.includes('prévio');
        let classeMensagem = "documento-gerado";
        if (mensagem.includes('pendente') || mensagem.includes('Não houve')) {
            classeMensagem = "documento-pendente"
        }
        if (mensagem.includes('Aguarde')) {
            classeMensagem = "documento-processando"
        }
        const formatos = [
            {
                label: 'Baixar em .PDF',
                command: () => {this.downloadDocumentoFinal("PDF")}
            },
            {
                label: 'Baixar em .XLSX',
                command: () => {this.downloadDocumentoFinal("XLSX")}
            }
        ];
        return (
            <div className="relacao-bens-container mt-5">
                <p className="relacao-bens-title">Demonstrativo financeiro</p>
                <article>
                    <div className="info">
                    <p className="fonte-14 mb-1"><strong>Demonstrativo Financeiro da Conta</strong></p>
                    <p className={`fonte-12 mb-1 ${classeMensagem}`}>
                        {mensagem}
                        {exibeLoading ? <img src={Spinner} style={{height: "22px"}}/> : ''}

                        {status === 'CONCLUIDO' && documentoPrevio &&
                        <>
                            <button
                                className='btn-editar-membro'
                                type='button'
                                onClick={() => {this.downloadDocumentoPrevia("XLSX")}}
                            >
                                <FontAwesomeIcon
                                    style={{fontSize: '18px',}}
                                    icon={faDownload}
                                />
                                &nbsp;XLSX
                            </button>
                            <button className='btn-editar-membro'
                                    type='button'
                                    onClick={() => {this.downloadDocumentoPrevia("PDF")}}
                            >
                                <FontAwesomeIcon
                                    style={{fontSize: '18px',}}
                                    icon={faDownload}
                                />
                                &nbsp;PDF
                            </button>
                        </>
                        }
                    </p>

                    </div>
                    <div className="actions">
                        {this.props.podeGerarPrevias && !mensagem.includes('Não houve') && this.props.statusPrestacaoDeConta && this.props.statusPrestacaoDeConta.prestacao_contas_status && !this.props.statusPrestacaoDeConta.prestacao_contas_status.documentos_gerados &&
                            <button onClick={(e) => this.showPrevia()} type="button" disabled={this.props.statusPrestacaoDeConta && this.props.statusPrestacaoDeConta.prestacao_contas_status && this.props.statusPrestacaoDeConta.prestacao_contas_status.documentos_gerados} className="btn btn-outline-success mr-2">prévia </button>
                        }
                        {this.props.podeBaixarDocumentos &&
                            <SplitButton
                                className="btn-split"
                                label="documento final"
                                onClick={
                                    () => {
                                        this.downloadDocumentoFinal("XLSX");
                                        this.downloadDocumentoFinal("PDF");
                                    }
                                }
                                model={formatos}
                                menuStyle={{textAlign: "left"}}
                                disabled={(this.props.statusPrestacaoDeConta && this.props.statusPrestacaoDeConta.prestacao_contas_status && !this.props.statusPrestacaoDeConta.prestacao_contas_status.documentos_gerados) || mensagem.includes('Não houve')}
                            >
                            </SplitButton>
                        }

                    </div>
                </article>
                <ModalPrevia 
                            show={this.state.show} 
                            onHide={this.onHide} 
                            titulo="Geração de documento prévio"
                            data_inicio={this.state.data_inicio}
                            data_fim={this.state.data_fim}
                            mensagemErro={this.state.mensagemErro}
                            handleChange={this.handleChange}
                            primeiroBotaoOnclick={this.gerarPrevia}
                            primeiroBotaoTexto="OK"/>
                <ModalPreviaSendoGerada
                            show={this.state.showGerandoPreviaDoc}
                            primeiroBotaoOnClick={this.handleOkGerandoPrevia}
                />
            </div>
        )
    }
}