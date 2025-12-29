import * as React from "react";
import type { Data, Layout } from "plotly.js";
import Plotly from "react-plotly.js";
import { ApplicationContext } from "~/contexts/ApplicationContext";
import type { Measurand, Measurands } from "~/lib/Measurands";

export default function LiveData() {
  const { measurands } = React.useContext(ApplicationContext);
  const plots = usePlots(measurands);
  return <Plots plots={plots} />;
}

const usePlots = (provider: Measurands) => {
  const [plots, setPlots] = React.useState<Array<PlotProps>>(
    toPlotProps(provider.list())
  );

  React.useEffect(() => {
    return provider.onMeasurements((id, data) => {
      setPlots((prev) => {
        return prev.map((plot) => {
          if (plot.id !== id) return plot;
          return {
            ...plot,
            data: {
              x: [...(plot.data as any).x, ...data.timestamp],
              y: [...(plot.data as any).y, ...data.value],
            },
          };
        });
      });
    });
  }, [provider]);
  return plots;
};

const toPlotProps = (measurands: Array<Measurand>): Array<PlotProps> => {
  return measurands.map((m) => ({
    id: m.id,
    title: m.id,
    tags: m.tags,
    data: {
      x: [],
      y: [],
      xaxis: "x",
      yaxis: "y1",
      type: "scatter",
      mode: "lines",
      name: m.id,
    },
  }));
};

interface Props {
  plots: Array<PlotProps>;
}

function Plots({ plots }: Props) {
  console.log(plots.length);
  return (
    <>
      {plots.map((plot) => (
        <Plot key={plot.id} {...plot} />
      ))}
    </>
  );
}

interface PlotProps {
  id: string;
  tags: Array<string>;
  title?: string;
  data: Data;
}

function Plot({ data, id }: PlotProps) {
  const plotLayout: Partial<Layout> = React.useMemo(
    () => ({
      hovermode: "x unified",
      font: { family: "Inter, sans-serif", color: "#fff" },
      paper_bgcolor: "#1e293b",
      plot_bgcolor: "#0f172a",
      title: { text: id },
      xaxis: {
        type: "date",
        showgrid: true,
        gridcolor: "#475569",
        zeroline: true,
      },
    }),
    [id]
  );
  return (
    <Plotly
      data={[data]}
      layout={plotLayout}
      style={{ height: `400px` }}
      config={{ responsive: true, displaylogo: false }}
    />
  );
}
