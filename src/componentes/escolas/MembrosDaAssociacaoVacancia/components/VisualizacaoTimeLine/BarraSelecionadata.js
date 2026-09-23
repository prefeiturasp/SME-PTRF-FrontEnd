import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight, faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import { Flex, Space } from "antd";
import { DatePickerField } from "../../../../Globais/DatePickerField";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";


export const BarraSelecionaData = ({
    onSelecionarData,
    mandato,
    marcos,
    dataSelecionada,
}) => {
    const hoje = moment().format("YYYY-MM-DD");

    const dataTemplate = useDataTemplate();

    const hojeDentroDoMandato = moment().isBetween(mandato?.data_inicial, mandato?.data_final, "day", "[]");

    const marcoAtualIndex = (marcos || []).findIndex(
        (marco) => marco.inicio <= dataSelecionada && dataSelecionada <= marco.fim
    );
    const marcoAtual = marcos?.[marcoAtualIndex];

    const irParaMarco = (delta) => {
        const alvo = marcos?.[marcoAtualIndex - delta];
        if (alvo) onSelecionarData(alvo.inicio);
    };

    return (
        <Flex wrap justify="space-between" className="BarraSelecionaData">
            <div>
                <label className="d-block fonte-12 mb-1">Ir para uma data qualquer do mandato</label>
                <DatePickerField
                    dataQa="seletor-data-timeline"
                    name="dataSelecionada"
                    value={dataSelecionada}
                    minDate={moment(mandato?.data_inicial).toDate()}
                    maxDate={moment(mandato?.data_final).toDate()}
                    onChange={(_, val) => onSelecionarData?.(moment(val).format("YYYY-MM-DD"))}
                />
            </div>

            <div>
                <div>
                    <span className="fonte-14 text-muted mx-2" data-qa="marco-atual-timeline">
                        <strong>Movimentação no cargo:</strong>
                        <div>
                            {marcoAtual ? `${dataTemplate("", "", marcoAtual.inicio)} até ${dataTemplate("", "", marcoAtual.fim)}` : ""}
                        </div>
                    </span>
                </div>
                <div className="text-center">
                    <Space size="small">
                        {hojeDentroDoMandato && (
                            <button type="button" className="btn btn-success" onClick={() => onSelecionarData(hoje)}>
                                Hoje
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => irParaMarco(1)}
                            disabled={!(marcoAtualIndex > 0)}
                        >
                            <FontAwesomeIcon
                                style={{marginRight: "0", color: 'white'}}
                                icon={faChevronLeft}
                            />
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => irParaMarco(-1)}
                            disabled={!(marcoAtualIndex >= 0 && marcoAtualIndex < (marcos || []).length - 1)}
                        >
                            <FontAwesomeIcon
                                style={{marginRight: "0", color: 'white'}}
                                icon={faChevronRight}
                            />
                        </button>
                    </Space>
                </div>
                <div className="text-center">
                </div>
            </div>
        </Flex>
    )
}