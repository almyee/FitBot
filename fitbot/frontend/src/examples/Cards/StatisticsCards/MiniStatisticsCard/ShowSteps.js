import React, { useMemo, useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import * as d3 from "d3";

function parseLocalDate(dateString) {
  return new Date(dateString);
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getWeekStart(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export default function ShowSteps() {
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
        const filtered = data.filter((log) => {
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

  // --- STEP COUNTS ARE DIVIDED BY 100 HERE ONCE ---

  // Total steps today (scaled)
  const totalStepsToday = useMemo(() => {
    const totalRaw = logs
      .filter((log) => {
        if (!log.timestamp) return false;
        const date = parseLocalDate(log.timestamp);
        return isSameDay(date, today);
      })
      .reduce((sum, log) => sum + Number(log.stepCount || 0), 0);
    return totalRaw / 10000;
  }, [logs, today]);

  // Weekly steps array Sun-Sat (scaled)
  const weeklySteps = useMemo(() => {
    const weekStart = getWeekStart(today);
    const steps = Array(7).fill(0);
    logs.forEach((log) => {
      if (!log.timestamp) return;
      const date = parseLocalDate(log.timestamp);
      if (date >= weekStart && date <= today) {
        steps[date.getDay()] += Number(log.stepCount || 0);
      }
    });
    // Divide by 100 once here
    return steps.map((v) => v / 100);
  }, [logs, today]);

  // Monthly steps for last 30 days (scaled)
  const monthlySteps = useMemo(() => {
    const stepsByDate = {};
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);

    logs.forEach((log) => {
      if (!log.timestamp) return;
      const date = parseLocalDate(log.timestamp);
      if (date >= start && date <= end) {
        const key = date.toISOString().slice(0, 10);
        stepsByDate[key] = (stepsByDate[key] || 0) + Number(log.stepCount || 0);
      }
    });

    const result = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      const value = stepsByDate[key] || 0;
      result.push({ date: key, value: value / 100 }); // scaled here
    }
    return result;
  }, [logs]);

  // Step goal scaled
  const stepGoal = 10000 / 100; // 100

  // ---------------- DOUGHNUT CHART ------------------
  useEffect(() => {
    if (loading || !doughnutRef.current) return;

    const width = 250,
      height = 250,
      radius = Math.min(width, height) / 2;

    const svg = d3
      .select(doughnutRef.current)
      .attr("width", width)
      .attr("height", height)
      .html("")
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const data = [totalStepsToday, Math.max(stepGoal - totalStepsToday, 0)];
    const color = d3.scaleOrdinal().range(["#388e3c", "#e0e0e0"]);

    const pie = d3.pie();
    const arc = d3.arc().innerRadius(70).outerRadius(radius);

    svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));

    // Show original step counts by multiplying back by 100
    svg
      .append("text")
      .text(`${Math.round(totalStepsToday * 100)}/${stepGoal * 100} steps`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "16px")
      .style("font-weight", "bold");
  }, [totalStepsToday, loading]);

  // ---------------- BAR CHART (WEEKLY) ------------------
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

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const x = d3
      .scaleBand()
      .domain(days)
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(weeklySteps) || 1])
      .nice()
      .range([height, 0]);

    g.append("g").call(d3.axisLeft(y));
    g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    g.selectAll("rect")
      .data(weeklySteps)
      .enter()
      .append("rect")
      .attr("x", (_, i) => x(days[i]))
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d))
      .attr("fill", "#4caf50");
  }, [weeklySteps, loading]);

  // ---------------- LINE CHART (MONTHLY) ------------------
  useEffect(() => {
    if (loading || !lineRef.current) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(lineRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .html("")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(monthlySteps, (d) => new Date(d.date)))
      .range([0, width]);

    const maxY = d3.max(monthlySteps, (d) => d.value) || 1;

    const y = d3
      .scaleLinear()
      .domain([0, maxY])
      .nice()
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const area = d3
      .area()
      .x((d) => x(new Date(d.date)))
      .y0(height)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    svg
      .append("path")
      .datum(monthlySteps)
      .attr("fill", "#c8e6c9")
      .attr("d", area);

    svg
      .append("path")
      .datum(monthlySteps)
      .attr("fill", "none")
      .attr("stroke", "#388e3c")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .selectAll("circle")
      .data(monthlySteps)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(new Date(d.date)))
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", "#388e3c")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);
  }, [monthlySteps, loading]);

  if (loading) return <p>Loading step count data…</p>;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Card>
          <SoftBox p={3} textAlign="center">
            <SoftTypography variant="h5" mb={2}>
              {"Today's Step Count"}
            </SoftTypography>
            <svg ref={doughnutRef}></svg>
          </SoftBox>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" mb={2}>
              Weekly Step Count
            </SoftTypography>
            <svg ref={barRef}></svg>
          </SoftBox>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" mb={2}>
              Monthly Step Count
            </SoftTypography>
            <svg ref={lineRef}></svg>
          </SoftBox>
        </Card>
      </Grid>
    </Grid>
  );
}
