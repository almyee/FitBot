import React, { useEffect, useState, useMemo, useRef } from "react";
import * as d3 from "d3";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

function getWeekStart(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export default function ShowWaterIntake() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const doughnutRef = useRef(null);
  const barRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("http://localhost:3001/activitylogs");
        const data = await res.json();
        const filtered = data.filter(log => {
          const user = log.user || log["﻿user"];
          return user === "alyssa";
        });
        setLogs(filtered);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const totalCupsToday = useMemo(() => {
    return logs.filter(log => {
      if (!log.timestamp) return false;
      const date = parseLocalDate(log.timestamp);
      return isSameDay(date, today);
    }).reduce((sum, log) => sum + Number(log.waterIntake || 0) / 8, 0);
  }, [logs, today]);

  const weeklyCups = useMemo(() => {
    const weekStart = getWeekStart(today);
    const cups = Array(7).fill(0);

    logs.forEach(log => {
      if (!log.timestamp) return;
      const date = parseLocalDate(log.timestamp);
      if (date >= weekStart && date <= today) {
        cups[date.getDay()] += Number(log.waterIntake || 0) / 8;
      }
    });

    return cups;
  }, [logs, today]);

  const monthlyCups = useMemo(() => {
    const cups = {};
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);

    logs.forEach(log => {
      if (!log.timestamp) return;
      const date = parseLocalDate(log.timestamp);
      if (date >= start && date <= end) {
        const key = date.toISOString().slice(0, 10);
        cups[key] = (cups[key] || 0) + Number(log.waterIntake || 0) / 8;
      }
    });

    const result = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      result.push({ date: key, value: cups[key] || 0 });
    }

    return result;
  }, [logs]);

  useEffect(() => {
    if (loading || !doughnutRef.current) return;

    const width = 250, height = 250, radius = Math.min(width, height) / 2;
    const svg = d3.select(doughnutRef.current)
      .attr("width", width)
      .attr("height", height)
      .html("")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const goal = 8;
    const data = [totalCupsToday, Math.max(goal - totalCupsToday, 0)];
    const color = d3.scaleOrdinal().range(["#1976d2", "#e0e0e0"]);

    const pie = d3.pie();
    const arc = d3.arc().innerRadius(70).outerRadius(radius);

    svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));

    svg.append("text")
      .text(`${totalCupsToday.toFixed(1)}/${goal} cups`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "16px")
      .style("font-weight", "bold");
  }, [totalCupsToday, loading]);

  useEffect(() => {
    if (loading || !barRef.current) return;

    const svg = d3.select(barRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 10, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(weeklyCups) || 1])
      .nice()
      .range([height, 0]);

    g.append("g").call(d3.axisLeft(y));
    g.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));

    g.selectAll("rect")
      .data(weeklyCups)
      .enter()
      .append("rect")
      .attr("x", (_, i) => x(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]))
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d))
      .attr("fill", "#42a5f5");
  }, [weeklyCups, loading]);

  useEffect(() => {
    if (loading || !lineRef.current) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(lineRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .html("")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(monthlyCups, d => new Date(d.date)))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(monthlyCups, d => d.value) || 1])
      .nice()
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const area = d3.area()
      .x(d => x(new Date(d.date)))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));

    svg.append("path")
      .datum(monthlyCups)
      .attr("fill", "#bbdefb")
      .attr("d", area);

    svg.append("path")
      .datum(monthlyCups)
      .attr("fill", "none")
      .attr("stroke", "#1976d2")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg.selectAll("circle")
      .data(monthlyCups)
      .enter()
      .append("circle")
      .attr("cx", d => x(new Date(d.date)))
      .attr("cy", d => y(d.value))
      .attr("r", 3)
      .attr("fill", "#1976d2")
      .attr("stroke", "white")
      .attr("stroke-width", 1);
  }, [monthlyCups, loading]);

  if (loading) return <p>Loading water intake data…</p>;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Card>
          <SoftBox p={3} textAlign="center">
            <SoftTypography variant="h5" mb={2}>{"Today's Water Intake"}</SoftTypography>
            <svg ref={doughnutRef}></svg>
          </SoftBox>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" mb={2}>Weekly Water Intake</SoftTypography>
            <svg ref={barRef}></svg>
          </SoftBox>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" mb={2}>Monthly Water Intake (Zoom Coming Soon)</SoftTypography>
            <svg ref={lineRef}></svg>
          </SoftBox>
        </Card>
      </Grid>
    </Grid>
  );
}
