import React, { useEffect, useState } from 'react'
import './dashboard.scss'
import '../../paginas/404/pagina-404.scss'
import { MsgImgLadoDireito } from '../Mensagens/MsgImgLadoDireito'
import Img404 from '../../assets/img/img-404.svg'
import {
  exibeDataPT_BR,
  exibeDateTimePT_BR,
  exibeValorFormatadoPT_BR,
} from '../../utils/ValidacoesAdicionaisFormularios'
import Loading from '../../utils/Loading'

export const DashboardCard = ({ acoesAssociacao }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setInterval(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <>
      {loading ? (
        <Loading
          corGrafico="black"
          corFonte="dark"
          marginTop="0"
          marginBottom="0"
        />
      ) : null}
      {!loading &&
      acoesAssociacao.info_acoes &&
      acoesAssociacao.info_acoes.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2">
          {acoesAssociacao.info_acoes.map((acao, index) => (
            <div key={index} className="col mb-4 container-dashboard-card">
              <div className="card h-100">
                <div className="card-header bg-white">
                  {acao.acao_associacao_nome ? (
                    <span>
                      <strong>{acao.acao_associacao_nome}</strong>{' '}
                    </span>
                  ) : null}
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-5 align-self-center">
                      <div className="col-12 container-lado-esquerdo pt-1 pb-1">
                        <p className="pt-1 mb-1">
                          Custeio:{' '}
                          <strong>
                            {exibeValorFormatadoPT_BR(acao.saldo_atual_custeio)}
                          </strong>
                        </p>
                        <p className="pt-1 mb-1">
                          Capital:{' '}
                          <strong>
                            {exibeValorFormatadoPT_BR(acao.saldo_atual_capital)}
                          </strong>
                        </p>
                        <p className="pt-1 pb-1 mb-0">
                          Total:{' '}
                          <strong>
                            {exibeValorFormatadoPT_BR(acao.saldo_atual_total)}
                          </strong>
                        </p>
                      </div>
                    </div>
                    <div className="col-12 col-md-7 container-lado-direito align-self-center ">
                      <p className="pt-1 mb-1">
                        Saldo reprogramado:{' '}
                        <strong>
                          {exibeValorFormatadoPT_BR(acao.saldo_reprogramado)}
                        </strong>
                      </p>
                      <p className="pt-1 mb-1">
                        Repasses no período:{' '}
                        <strong>
                          {exibeValorFormatadoPT_BR(acao.repasses_no_periodo)}
                        </strong>
                      </p>
                      <p className="pt-1 mb-1">
                        Outras receitas:{' '}
                        <strong>
                          {exibeValorFormatadoPT_BR(
                            acao.outras_receitas_no_periodo
                          )}
                        </strong>
                      </p>
                      <p className="pt-1 pb-1 mb-0">
                        Despesa declarada:{' '}
                        <strong>
                          {exibeValorFormatadoPT_BR(acao.despesas_no_periodo)}
                        </strong>
                      </p>
                      {acao.acao_associacao_nome.trim() === 'PTRF' ? (
                        <p className="pt-1 pb-1 mb-0">
                          Próx. repasse a partir de:{' '}
                          <strong>
                            {exibeDataPT_BR(
                              acoesAssociacao.data_prevista_repasse
                            )}
                          </strong>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading ? (
        <>
          <MsgImgLadoDireito
            texto="A sua escola não possui ações ativas nesse período."
            img={Img404}
          />
        </>
      ) : null}
      <div className="d-flex justify-content-end pb-3 mt-5">
        <p className="ultima-atualizacao">
          Última atualização:{' '}
          {exibeDateTimePT_BR(acoesAssociacao.ultima_atualizacao)}
        </p>
      </div>
    </>
  )
}
