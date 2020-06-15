import React, {Component} from "react";
import {previa, documentoFinal, getRelacaoBensInfo} from "../../../services/RelacaoDeBens.service";

export default class RelacaoDeBens extends Component {
    _isMounted = false;

    state = {
        mensagem: "",
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.relacaoBensInfo();
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.periodoConta !== this.props.periodoConta) {
            await this.relacaoBensInfo();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    relacaoBensInfo = async () => {
        const {periodo, conta} = this.props.periodoConta;
        getRelacaoBensInfo(conta, periodo).then(
            (mensagem) => {
                if(this._isMounted) {
                    this.setState({mensagem: mensagem});
                }
            }
        );
        ;
    }
    
    gerarPrevia = async () => {
        const {periodo, conta} = this.props.periodoConta;

        await previa(conta, periodo);
    }

    gerarDocumentoFinal = async () => {
        const {periodo, conta} = this.props.periodoConta;
        
        await documentoFinal(conta, periodo);
        await this.relacaoBensInfo();
    }

    render() {
        const {mensagem} = this.state;
        return (
            <div className="relacao-bens-container mt-5">
                <p className="relacao-bens-title">Relação de Bens adquiridos ou produzidos por período</p>
                <article>
                    <div className="info">
                    <p className="title"><strong>Bens adquiridos ou produzidos</strong></p>
                    <p className={mensagem.includes('pendente') ? "documento-pendente" :"documento-gerado"}>{mensagem}</p>
                    </div>
                    <div className="actions">
                        <button type="button" onClick={this.gerarPrevia} className="btn btn-outline-success mr-2">prévia </button>
                        <button disabled={false} onClick={this.gerarDocumentoFinal} type="button" className="btn btn-success">documento final</button>
                    </div>
                </article>
            </div>
        )
    }
}