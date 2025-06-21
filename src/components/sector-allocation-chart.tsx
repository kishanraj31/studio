'use client';

import { Pie, PieChart, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

interface SectorAllocationChartProps {
  data: {
    sector: string;
    weight: number;
    fill: string;
  }[];
}

export function SectorAllocationChart({ data }: SectorAllocationChartProps) {
  const chartConfig = data.reduce((acc, item) => {
    acc[item.sector] = {
      label: item.sector,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="sector" />}
        />
        <Pie
          data={data}
          dataKey="weight"
          nameKey="sector"
          innerRadius={60}
          strokeWidth={5}
        >
            {data.map((entry) => (
                <Cell key={`cell-${entry.sector}`} fill={entry.fill} />
            ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="sector" />} className="flex-wrap" />
      </PieChart>
    </ChartContainer>
  );
}
