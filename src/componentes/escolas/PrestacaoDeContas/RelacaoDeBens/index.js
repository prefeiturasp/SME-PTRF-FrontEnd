import React, {Component} from "react";
import {previa, documentoFinal, getRelacaoBensInfo} from "../../../../services/escolas/RelacaoDeBens.service";
import {ModalPrevia} from "../ModalGerarPrevia";
import moment from "moment";


export default class RelacaoDeBens extends Component {
    _isMounted = false;

    state = {
        mensagem: "",
        show: false,
        data_inicio: null,
        data_fim: null,
        mensagemErro: ""
    };

    async componentDidMount() {
        this._isMounted = true;
        await this.relacaoBensInfo();
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.periodoPrestacaoDeConta !== this.props.periodoPrestacaoDeConta || prevProps.contaPrestacaoDeContas !== this.props.contaPrestacaoDeContas) {
            await this.relacaoBensInfo();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    relacaoBensInfo = async () => {
        const periodo = this.props.periodoPrestacaoDeConta.periodo_uuid;
        const conta = this.props.contaPrestacaoDeContas.conta_uuid;

        getRelacaoBensInfo(conta, periodo).then(
            (mensagem) => {
                if(this._isMounted) {
                    this.setState({mensagem: mensagem});
                }
            }
        );

    };

    showPrevia = () => {
        this.setState({show: true});
        let data_inicio = this.props.periodoSelecionado.data_inicio_realizacao_despesas
        let data_fim = this.props.periodoSelecionado.data_fim_realizacao_despesas
        this.setState({data_inicio: data_inicio, data_fim: data_fim})
    }

    onHide = () => {
        this.setState({show: false});
    }

    handleChange = (name, value) => {
        console.log("")
        this.setState({
            ...this.state,
            [name]: value !== "" && value !== null ? moment(value, "YYYY-MM-DD").format("YYYY-MM-DD"): ""
        });
        this.setState({mensagemErro: ""})
    };
    
    gerarPrevia = async () => {
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

        let data_fim_periodo = new Date(this.props.periodoSelecionado.data_fim_realizacao_despesas)
        if (data_fim.getTime() > data_fim_periodo.getTime()) {
            this.setState({mensagemErro: "Data final não pode ser maior que a data final do período."});
            return
        }

        this.props.setLoading(true);
        const periodo = this.props.periodoPrestacaoDeConta.periodo_uuid;
        const conta = this.props.contaPrestacaoDeContas.conta_uuid;
        
        await previa(conta, periodo, this.state.data_inicio, this.state.data_fim);
        this.props.setLoading(false);
    };

    gerarDocumentoFinal = async () => {
        this.props.setLoading(true);
        const periodo = this.props.periodoPrestacaoDeConta.periodo_uuid;
        const conta = this.props.contaPrestacaoDeContas.conta_uuid;
        await documentoFinal(conta, periodo);
        await this.relacaoBensInfo();
        this.props.setLoading(false);
    };

    render() {
        const {mensagem} = this.state;
        return (
            <div className="relacao-bens-container mt-5">
                <p className="relacao-bens-title">Relação de Bens adquiridos ou produzidos</p>
                <article>
                    <div className="info">
                    <p className="fonte-14 mb-1"><strong>Bens adquiridos ou produzidos</strong></p>
                    <p className={`fonte-12 mb-1 ${mensagem.includes('pendente') ? "documento-pendente" :"documento-gerado"}`}>{mensagem}</p>
                    </div>
                    <div className="actions">
                        {this.props.statusPrestacaoDeConta && this.props.statusPrestacaoDeConta.prestacao_contas_status && !this.props.statusPrestacaoDeConta.prestacao_contas_status.documentos_gerados &&
                            <button onClick={(e) => this.showPrevia()} type="button" disabled={this.props.statusPrestacaoDeConta && this.props.statusPrestacaoDeConta.prestacao_contas_status && this.props.statusPrestacaoDeConta.prestacao_contas_status.documentos_gerados} className="btn btn-outline-success mr-2">prévia </button>
                        }
                        {/*<button type="button" onClick={this.gerarPrevia} className="btn btn-outline-success mr-2">prévia </button>*/}
                        <button disabled={this.props.statusPrestacaoDeConta && this.props.statusPrestacaoDeConta.prestacao_contas_status && !this.props.statusPrestacaoDeConta.prestacao_contas_status.documentos_gerados} onClick={this.gerarDocumentoFinal} type="button" className="btn btn-success">documento final</button>
                        {/*<button disabled={false} onClick={this.gerarDocumentoFinal} type="button" className="btn btn-success">documento final</button>*/}
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
            </div>
        )
    }
}