import { useMemo } from "react";
import "../../geracao-da-ata.scss";
import { TopoComBotoes } from "./TopoComBotoes";
import WatermarkPrevia from "../../../../Globais/WatermarkPrevia/WatermarkPrevia";
import { useVisualizacaoAtaPaa } from "./hooks/useVisualizacaoAtaPaa";
import { useGetPaaRetificacao } from "./hooks/useGetPaaRetificacao";

import { useParams } from "react-router-dom";
import { AtaElaboracao } from "./AtaElaboracao";
import { AtaRetificacao } from "./AtaRetificacao";
import { AtividadesEstatutarias } from "./AtividadesEstatutarias";
import { ListaPresentes } from "./ListaPresentes";
import { BlocoPrioridadesRetificacao } from "./BlocoPrioridades/BlocoPrioridadesRetificacao";
import { BlocoPrioridadesElaboracao } from "./BlocoPrioridades/BlocoPrioridadesElaboracao";
import { Manifestacoes } from "./Manifestacoes";

export const VisualizacaoAtaPaa = () => {
  const {
    dadosAta,
    tabelas,
    listaPresentes,
    alturaDocumento,
    referenciaDocumento,
    prioridadesAgrupadas,
    isLoadingPrioridades,
    atividades,
    isLoadingAtividades,
    handleClickFecharAta,
    handleClickEditarAta,
    getNomeUnidadeEducacional,
    getDiaPorExtenso,
    getMesPorExtenso,
    getAnoPorExtenso,
    getDataFormatada,
    getLocalReuniao,
    getNomeUnidade,
    getHoraInicio,
    getTipoReuniao,
    getTipoUnidadeComNome,
    getPeriodoPaaFormatado,
    formatarMesAno,
    formatarData,
    getNomeSecretarioReuniao,
    getNomePresidente,
  } = useVisualizacaoAtaPaa();

  const listaPresentesMembros = useMemo(
    () => listaPresentes.filter((participante) => participante.membro && participante.presente),
    [listaPresentes]
  );
  const listaPresentesNaoMembros = useMemo(
    () => listaPresentes.filter((participante) => participante.membro === false && participante.presente),
    [listaPresentes]
  );
  const { uuid_paa } = useParams();

  const { data: paaRetificacao, isLoading } = useGetPaaRetificacao(uuid_paa); 
  const dataReuniaoElaboracao = paaRetificacao?.ata_elaboracao?.data_reuniao;
  
  return (
    <>
      <div className="col-12 container-visualizacao-da-ata mb-5" ref={referenciaDocumento}>
        {alturaDocumento > 0 && <WatermarkPrevia alturaDocumento={alturaDocumento} icon="rascunho" />}
        <div className="col-12 mt-4">
          {dadosAta && Object.entries(dadosAta).length > 0 && !isLoading && (
            <TopoComBotoes
              dadosAta={dadosAta}
              paaRetificacao={paaRetificacao}
              handleClickEditarAta={handleClickEditarAta}
              handleClickFecharAta={handleClickFecharAta}
            />
          )}
        </div>
        
        { !paaRetificacao && !isLoading ? (
          <AtaElaboracao 
            getAnoPorExtenso={getAnoPorExtenso}
            getDiaPorExtenso={getDiaPorExtenso}
            getMesPorExtenso={getMesPorExtenso}
            getLocalReuniao={getLocalReuniao}
            getNomeUnidade={getNomeUnidade}
            getHoraInicio={getHoraInicio}
            getTipoReuniao={getTipoReuniao}
            getTipoUnidadeComNome={getTipoUnidadeComNome}
            getNomeUnidadeEducacional={getNomeUnidadeEducacional}
          />     
        ) : (
          <AtaRetificacao 
            getNomeUnidadeEducacional={getNomeUnidadeEducacional}
            getAnoPorExtenso={getAnoPorExtenso}
            getDiaPorExtenso={getDiaPorExtenso}
            getMesPorExtenso={getMesPorExtenso}
            getLocalReuniao={getLocalReuniao}
            getNomeUnidade={getNomeUnidade}
            getHoraInicio={getHoraInicio}
            getPeriodoPaaFormatado={getPeriodoPaaFormatado}
            getDataFormatada={getDataFormatada}
            dataReuniaoElaboracao={dataReuniaoElaboracao}
            getNomePresidente={getNomePresidente}
            getTipoUnidadeComNome={getTipoUnidadeComNome}
          />
        )}
        
        {!isLoadingPrioridades && prioridadesAgrupadas && !paaRetificacao && !isLoading ? (
          <BlocoPrioridadesElaboracao prioridadesAgrupadas={prioridadesAgrupadas} />
        ) : (
          <BlocoPrioridadesRetificacao prioridadesAgrupadas={prioridadesAgrupadas} />
        )}

        <div className="col-12 mt-4">
          <p>Foi apresentado o seguinte cronograma para as atividades de {getPeriodoPaaFormatado()}:</p>
        </div>
        
       { !isLoadingAtividades && atividades && atividades.length > 0 && (
        <AtividadesEstatutarias 
          atividades={atividades}
          isLoadingAtividades={isLoadingAtividades}
          paaRetificacao={paaRetificacao}
          isLoading={isLoading}
          formatarMesAno={formatarMesAno}
          formatarData={formatarData}
        />        
       )}


        { paaRetificacao && !isLoading && (
          <div className="col-12 mt-4">
            <h4 style={{ fontWeight: "bold", fontSize: "20px", color: "#42474A" }}>Justificativa da Retificação</h4>
            <p className="mt-3">{dadosAta.justificativa_retificacao}</p>
          </div>
        )}

        <Manifestacoes 
          dadosAta={dadosAta}
          paaRetificacao={paaRetificacao}
          tabelas={tabelas}
          isLoading={isLoading}
        />

        { !paaRetificacao && !isLoading ? (
          <div className="col-12 mt-4">
            <p>
              Esgotados os assuntos, o (a) senhor (a) presidente ofereceu a palavra a quem dela desejasse fazer uso e,
              como não houve manifestação, agradeceu a presença de todos e considerou encerrada a reunião, a qual eu,{" "}
              <strong>{getNomeSecretarioReuniao()}</strong> lavrei a presente ata, que vai por mim assinada.
            </p>
          </div>
        ) : (
          <div className="col-12 mt-4">
            <p>
              A seguir foi dada a palavra e, não havendo manifestação dos presentes, a reunião  foi declarada encerrada
              e eu, <strong>{getNomeSecretarioReuniao()}</strong>, lavrei a presente Ata, que foi por mim  assinada e pelos demais
              presentes.
            </p>
          </div>          
        )}

        {listaPresentes && listaPresentes.length > 0 && (
          <ListaPresentes 
            listaPresentesMembros={listaPresentesMembros}
            listaPresentesNaoMembros={listaPresentesNaoMembros}
          />
        )}
      </div>
    </>
  );
};
