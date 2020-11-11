import React from "react";

export const TrilhaDeStatus = ({retornaQtdeStatus, retornaQtdeStatusTotal}) => {
    return (
        <>
            <div className='row mt-3 mb-3'>
                <div className='col-12'>
                    <h5>Prestações de contas das Associações</h5>
                </div>
            </div>
            <div className='row'>
                <div className="col-12">
                    <div id="timeline">&nbsp;</div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className='container-circulo'>
                            <span className={`circulo ${retornaQtdeStatus('NAO_RECEBIDA').length < 3 ? 'circulo-ativo-relatorio-consolidado-dois-digitos' : 'circulo-ativo-relatorio-consolidado-tres-digitos'}`}>{retornaQtdeStatus('NAO_RECEBIDA')}</span>
                            <p className='mt-2'><strong>Não recebido</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className={`circulo circulo-relatorio-consolidado-em-analise ${retornaQtdeStatus('RECEBIDA').length < 3 ? 'circulo-ativo-relatorio-consolidado-dois-digitos' : 'circulo-ativo-relatorio-consolidado-tres-digitos'}`}>{retornaQtdeStatus('RECEBIDA')}</span>
                            <p className='mt-2'><strong>Recebida e <br/> aguardando análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className={`circulo circulo-relatorio-consolidado-em-analise ${retornaQtdeStatus('DEVOLVIDA').length < 3 ? 'circulo-ativo-relatorio-consolidado-dois-digitos' : 'circulo-ativo-relatorio-consolidado-tres-digitos'}`}>{retornaQtdeStatus('DEVOLVIDA')}</span>
                            <p className='mt-2'><strong>Devolvido <br/>para acertos</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className={`circulo circulo-relatorio-consolidado-em-analise ${retornaQtdeStatus('EM_ANALISE').length < 3 ? 'circulo-ativo-relatorio-consolidado-dois-digitos' : 'circulo-ativo-relatorio-consolidado-tres-digitos'}`}>{retornaQtdeStatus('EM_ANALISE')}</span>
                            <p className='mt-2'><strong>Em análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className={`circulo ${retornaQtdeStatusTotal().length < 3 ? 'circulo-ativo-relatorio-consolidado-dois-digitos' : 'circulo-ativo-relatorio-consolidado-tres-digitos'}`}>{retornaQtdeStatusTotal()}</span>
                            <p className='mt-2'><strong>Conclusão <br/> da análise</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};