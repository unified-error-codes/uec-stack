import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Data, Layout } from 'plotly.js';
import Plotly from 'react-plotly.js';
import { ApplicationContext } from '../contexts/ApplicationContext';
import type { Measurand, Measurands } from '../lib/Measurands';
import type { Cleanup } from '../lib/utils/Cleanup';

export function Plot() {
    const [plotData, yaxies] = usePlotData();
    const plotLayout: Partial<Layout> = useMemo(
        () => ({
            hovermode: 'x unified',
            font: { family: 'Roboto Mono, monospace', color: '#cbd5e1' },
            grid: { rows: plotData.length, columns: 1 },
            paper_bgcolor: '#1e293b',
            plot_bgcolor: '#0f172a',
            xaxis: {
                type: 'date',
                showgrid: true,
                gridcolor: '#475569',
                zeroline: true,
            },
            ...yaxies,
        }),
        [yaxies],
    );

    const [height, changed] = useHeight(plotData);

    // force rerender when number of measurand changed to set high correctly
    if (changed) {
        return null;
    }
    return (
        <Plotly
            data={plotData}
            layout={plotLayout}
            style={{ width: '2048px', height: `${height}px` }}
            config={{ responsive: true, displaylogo: false }}
        />
    );
}

type DataMap = Map<
    string /*measurandId*/,
    {
        x: Array<Date>;
        y: Array<number | string>;
        xaxis: string;
        yaxis: string;
        name: string;
        line: { shape?: string };
    }
>;

class PlotData {
    private data: DataMap = new Map();
    private layout: Partial<Layout> = {};
    private yIdx = 1;
    private dataListener: (data: DataMap) => void = () => {};
    private measurands: Measurands;

    constructor(measurands: Measurands) {
        this.measurands = measurands;
    }

    public onData(l: (data: DataMap) => void): Cleanup {
        this.dataListener = l;
        const cleanup = this.measurands.onMeasurements((timestamp, data) =>
            this.handleMeasurements(timestamp, data),
        );
        return () => {
            this.dataListener = () => {};
            cleanup();
        };
    }

    public getLayout() {
        return this.layout;
    }

    private handleMeasurements(
        timestamp: Date,
        data: Array<{ measurand: Measurand; value: number | string }>,
    ) {
        data.forEach((d, idx) => {
            const id = meaurandId(d.measurand);
            const samples = this.data.get(id);
            if (samples) {
                samples.x = [...samples.x, timestamp];
                samples.y = [...samples.y, d.value];
            } else {
                const line = { shape: getShape(d.measurand) };
                this.data.set(id, {
                    x: [timestamp],
                    y: [d.value],
                    xaxis: 'x',
                    yaxis: `y${idx + 1}`,
                    name: getMeasurandName(d.measurand),
                    line,
                });
                this.layout = {
                    ...this.layout,
                    [`yaxis${this.yIdx++}`]: {
                        title: { text: getYText(d.measurand) },
                    },
                };
            }
        });
        this.dataListener(this.data);
    }
}

const meaurandId = (measurand: Measurand): string => {
    return `${measurand.type}-${measurand.location}-${measurand.connectors?.join('')}`;
};

const usePlotData = (): [Data[], Partial<Layout>] => {
    const app = useContext(ApplicationContext);
    const [plotData, setPlotData] = useState<Array<Data>>([]);
    const [layout, setLayout] = useState<Partial<Layout>>({});
    useEffect(() => {
        const pd = new PlotData(app.measurands);
        return pd.onData(data => {
            setPlotData(Array.from(data.values()));
            setLayout(pd.getLayout());
        });
    }, [app]);

    return [plotData, layout];
};

const useHeight = (plotData: Array<Data>): [number, boolean] => {
    const [changed, setChanged] = useState(false);
    const height = useRef(plotData.length * 200);

    useEffect(() => {
        height.current = plotData.length * 200;
        setChanged(true);
    }, [plotData.length]);

    useEffect(() => {
        setChanged(false);
    }, [changed]);

    return [height.current, changed];
};

const getMeasurandName = (m: Measurand): string => {
    if (m.location === 'ControlPilotPositive') {
        return 'CP Voltage +';
    }
    if (m.location === 'ControlPilotNegative') {
        return 'CP Voltage -';
    }
    if (m.location === 'ControlPilot' && m.type === 'State') {
        return 'CP State';
    }
    if (m.location === 'ControlPilot' && m.type === 'DutyCycle') {
        return 'CP Duty';
    }
    if (m.location === 'Supply12VPositive') {
        return 'Supply +12V';
    }
    if (m.location === 'Supply12VNegative') {
        return 'Supply -12V';
    }
    return 'unkown';
};

const getShape = (m: Measurand): string | undefined => {
    if (m.type === 'State') {
        return 'hv';
    }
};

const getYText = (m: Measurand): string | undefined => {
    if (m.type === 'State') {
        return 'State';
    }
    if (m.type === 'DutyCycle') {
        return 'Duty (%)';
    }
    if (m.type === 'Voltage') {
        return 'Voltage (V)';
    }
};
