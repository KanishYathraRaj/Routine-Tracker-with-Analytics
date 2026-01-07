
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { DailyStats } from "../../types/todo";

interface TaskCompletionTrendProps {
    data: DailyStats[];
}

export function TaskCompletionTrend({ data }: TaskCompletionTrendProps) {
    return (
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Completion Trend</h3>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickMargin={10}
                            tickFormatter={(value) => {
                                // Parse "7/1/2026" -> ["7", "1", "2026"]
                                const [day, month] = value.split('/');
                                if (!day || !month) return value;
                                // Return "7/1" or generic weekday if preferred. keeping it simple.
                                return `${day}/${month}`;
                            }}
                        />
                        <YAxis 
                            hide
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ 
                                borderRadius: '12px', 
                                border: 'none', 
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                            }}
                        />
                        <Bar 
                            dataKey="total" 
                            fill="#3B82F6" 
                            radius={[4, 4, 4, 4]}
                            barSize={12}
                            name="Total Tasks"
                        />
                        <Bar 
                            dataKey="completed" 
                            fill="#22C55E" 
                            radius={[4, 4, 4, 4]}
                            barSize={12}
                            name="Completed"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
