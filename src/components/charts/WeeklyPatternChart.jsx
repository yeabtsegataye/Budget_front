import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyPatternChart = ({ data }) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formattedData = data.map(item => ({
    ...item,
    day: dayNames[item.day - 1] // MongoDB dayOfWeek is 1-7, array is 0-6
  }));

  const renderTooltip = (props) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0];
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{data.payload.day}</p>
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
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="day"
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={renderTooltip} />
          <Bar
            dataKey="total"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyPatternChart;