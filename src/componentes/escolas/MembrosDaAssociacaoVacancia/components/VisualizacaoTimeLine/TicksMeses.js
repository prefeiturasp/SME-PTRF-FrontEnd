export const TicksMeses = ({ ticks }) => (
    <div className="ticks-mes-timeline TicksMeses">
        {ticks.map((tick) => (
            <div key={tick.iso} className="tick-mes-timeline" style={{ left: `${tick.leftPct}%` }}>
                {tick.label}
            </div>
        ))}
    </div>
)