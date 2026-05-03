import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopCategoriesChart = ({ data }) => {
  const renderTooltip = (props) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0];
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{data.payload.category}</p>
          <p className="text-destructive">${data.value.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{data.payload.count} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            type="number"
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            type="category"
            dataKey="category"
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip content={renderTooltip} />
          <Bar
            dataKey="total"
            fill="#f97316"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCategoriesChart;