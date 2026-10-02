const CargoTimeline = ({ cargoRow }) => (
    <div className="timeline-rotulo-cargo CargoTimeline" title={cargoRow.cargo_associacao_label} key={cargoRow.cargo_associacao}>
        {cargoRow.cargo_associacao_label}
    </div>
)

export const CargosTimeline = ({ cargos, secao }) => {
    return (
        <>
            <div className="timeline-rotulo-secao CargosTimeline">{ secao }</div>
            {cargos.map((cargoRow) => (
                <CargoTimeline
                    key={cargoRow.cargo_associacao}
                    cargoRow={cargoRow}
                />
                ))
            }
        </>
    );
};
