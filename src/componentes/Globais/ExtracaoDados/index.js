import React, {useState} from 'react';
import {DatePicker, Space } from "antd";
import {ExtracaoCard} from "./ExtracaoCard"
import {CardButton} from "./CardButton"
import {getExportaCreditos} from "../../../services/sme/ExtracaoDados.service"
import {toastCustom} from "../../Globais/ToastCustom";
import moment from "moment";
import {cards} from "./Cards"
import './extracao-dados.scss'

export const ExtracaoDados = () => {
    const [dataInicial, setDataInicial] = useState('')
    const [dataFinal, setDataFinal] = useState('')

    // ajustar a data para ser unica, ajustar o cards para um arquivo separado, handleExportaDados generico com url
    // pegar e enviar para uma pasta, git stash, ir para git development git pull e jogar os arquivos

    async function handleExportaDados(endpoint) {
        try {
            await getExportaCreditos(endpoint, dataInicial, dataFinal)
            toastCustom.ToastCustomSuccess('Geração solicitada com sucesso.', 'A geração foi solicitada. Em breve você receberá um aviso na central de downloads com o resultado.')
        }
        catch (err) {
            console.log(`erro ao exportar dados de creditos ${err}`)
        }
    }

    return (
     <>
      <h6 className="extracao-title">Dados disponíveis para extração</h6>
      <p className="extracao-title-filter">Filtrar por data</p>
      <div className="extracao-filter">
            <Space className='extracao-space' direction='vertical'>
                <span>Selecione o período de criação (vazio para todos)</span>
                <DatePicker.RangePicker
                    format={'DD/MM/YYYY'}
                    allowEmpty={[false, true]}
                    className='extracao-filter-datepicker'
                    placeholder={['data inicial', 'data final']}
                    name="data_range"
                    id="data_range"
                    onCalendarChange={(dates) => {
                        setDataInicial(dates?.[0] ? dates[0].format('YYYY-MM-DD'): '')
                        setDataFinal(dates?.[1] ? dates[1].format('YYYY-MM-DD'): '')
                    }}
                />
                {
                dataInicial && dataFinal ?
                    <span className='extracao-date'>Exibindo dados de <b className='extracao-date-msg'>{moment(dataInicial).format('DD/MM/YYYY')}</b>,
                    á <b className='extracao-date-msg'>{moment(dataFinal).format('DD/MM/YYYY')}</b>.</span> : <span className='extracao-date'></span>
                }
            </Space>    
            { cards.map(( {titulo, descricao, tags, endpoint}, index ) => (
                <ExtracaoCard
                    key={`cards-${index}`} 
                    titulo={titulo}
                    descricao={descricao}
                    tags={tags}
                    action={
                        () => <CardButton onClick={() => handleExportaDados(endpoint)}> Exportar Dados </CardButton>
                    }
                />
            ) )}

      </div>
     </>   
    )
}  