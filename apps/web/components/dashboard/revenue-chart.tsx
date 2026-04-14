"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { revenueSeries } from "../../lib/mock-data";

export function RevenueChart() {
  return (
    <section className="glass-card rounded-[28px] p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Revenue Flow</p>
      <h3 className="display-heading mt-3 text-2xl font-semibold text-white">Same-day revenue acceleration</h3>
      <div className="mt-6 h-72">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={revenueSeries}>
            <defs>
              <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
            <XAxis axisLine={false} dataKey="hour" stroke="#94a3b8" tickLine={false} />
            <YAxis axisLine={false} stroke="#94a3b8" tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.96)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                borderRadius: 20,
              }}
            />
            <Area
              dataKey="revenue"
              fill="url(#revenueFill)"
              stroke="#38bdf8"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
