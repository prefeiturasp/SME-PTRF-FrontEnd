import { Row, Col } from "antd";

const CargoTimelineItemLista = ({ cargoRow }) => (
    <Row key={cargoRow.cargo_associacao}
        className="linha-composicao-data CargoTimelineItemLista">
        <Col sm={12} md={8} lg={4} xl={4} className="text-muted">
            {cargoRow.cargo_associacao_label}
        </Col>
        <Col className={cargoRow.nomeOuVago === "Vago" ? "text-muted font-weight-bold" : "font-weight-bold"}>
            {cargoRow.nomeOuVago}
        </Col>
    </Row>
)

export const CargosTimelineModoListagem = ({ cargos, secao }) => {
    return (
        <>
            <p className="titulo-secao-composicao CargosTimelineModoListagem">
                <strong>{secao}</strong>
            </p>
            {cargos.map((cargoRow) => (
                <CargoTimelineItemLista
                    key={cargoRow.cargo_associacao} cargoRow={cargoRow} />
            ))}
           
        </>
    );
};