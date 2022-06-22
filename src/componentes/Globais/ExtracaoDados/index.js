import React, {useState} from 'react';
import {DatePicker, Space } from "antd";
import {ExtracaoCard} from "./ExtracaoCard"
import {CardButton} from "./CardButton"
import {getExportaCreditos} from "../../../services/sme/ExtracaoDados.service"
import {toastCustom} from "../../Globais/ToastCustom";
import moment from "moment";
import './extracao-dados.scss'

export const ExtracaoDados = () => {
    const [dataInicial, setDataInicial] = useState('')
    const [dataFinal, setDataFinal] = useState('')
    const cards = [
        {
            titulo: 'Créditos das Unidades Educacionais no período',
            descricao: 'Arquivo com os créditos informados por todas as unidades educacionais no período. Arquivos: Principal e Motivos de estorno',
            tags: ['CSV'],
            action: () => 
                <CardButton onClick={handleExportaDados}> Exportar Dados </CardButton>
        },
        {
            titulo: 'Créditos das Unidades Educacionais no período',
            descricao: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
            molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
            numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
            optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
            obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
            nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
            tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
            quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos 
            sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam
            recusandae alias error harum maxime adipisci amet laborum. Perspiciatis 
            minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit`,
            tags: ['CSV', 'XLSX', 'TXT'],
            action: () => <CardButton>  Exportar Dados </CardButton>
        },
        {
            titulo: 'Créditos das Unidades Educacionais no período',
            descricao: 'Arquivo com os créditos informados por todas as unidades educacionais no período. Arquivos: Principal e Motivos de estorno',
            tags: ['CSV'],
            action: () => <CardButton > Exportar Dados </CardButton>
        }
    ]

    async function handleExportaDados() {
        await getExportaCreditos(dataInicial, dataFinal)
        toastCustom.ToastCustomSuccess('Geração solicitada com sucesso.', 'A geração foi solicitada. Em breve você receberá um aviso na central de downloads com o resultado.')
    }

    return (
     <>
      <h6 className="extracao-title">Dados disponíveis para extração</h6>
      <p className="extracao-title-filter">Filtrar por data</p>
      <div className="extracao-filter">
            <Space direction='vertical' style={{width: '100%'}}>
                <span>Selecione o período de criação (vazio para todos)</span>
                <DatePicker.RangePicker
                    format={'DD/MM/YYYY'}
                    className='extracao-filter-datepicker'
                    placeholder={['data inicial', 'data final']}
                    name="data_range"
                    id="data_range"
                    onChange={(dates) => {
                        setDataInicial(moment(dates[0]).format('YYYY-MM-DD'))
                        setDataFinal(moment(dates[1]).format('YYYY-MM-DD'))
                    }}
                />
                {
                dataInicial && dataFinal ?
                    <span className='extracao-date'>Exibindo dados de <b className='extracao-date-msg'>{moment(dataInicial).format('DD/MM/YYYY')}</b>,
                    á <b className='extracao-date-msg'>{moment(dataFinal).format('DD/MM/YYYY')}</b>.</span> : <span className='extracao-date'></span>
                }
            </Space>    
            { cards.map(( {titulo, descricao, tags, action}, index ) => (
                <ExtracaoCard
                    key={`cards-${index}`} 
                    titulo={titulo}
                    descricao={descricao}
                    tags={tags}
                    action={action}
                />
            ) )}

      </div>
     </>   
    )
}  