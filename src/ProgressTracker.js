import React from 'react';
import { useState, useEffect } from "react";
import { Tabs, Tab } from "./components/ui/tabs";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const CATEGORIES = ["Health", "Relationships", "Habits", "Work"];

export default function ProgressTracker() {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem("progressData");
    return stored ? JSON.parse(stored) : {};
  });
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
  const [task, setTask] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    localStorage.setItem("progressData", JSON.stringify(data));
  }, [data]);

  const today = new Date().toISOString().slice(0, 10);

  const handleAddScore = () => {
    if (!task || !score) return;
    const entry = parseFloat(score);
    setData(prev => {
      const categoryData = prev[currentCategory] || {};
      const dateData = categoryData[today] || {};
      dateData[task] = (dateData[task] || 0) + entry;
      return {
        ...prev,
        [currentCategory]: {
          ...categoryData,
          [today]: dateData,
        },
      };
    });
    setTask("");
    setScore("");
  };

  const buildChartData = () => {
    const categoryData = data[currentCategory] || {};
    const dates = Object.keys(categoryData).sort();
    const taskNames = new Set();
    dates.forEach(date => Object.keys(categoryData[date]).forEach(t => taskNames.add(t)));
    return dates.map(date => {
      const entry = { date };
      for (let task of taskNames) {
        entry[task] = categoryData[date][task] || 0;
      }
      return entry;
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Progress Tracker</h1>
      <Tabs defaultValue={CATEGORIES[0]} onValueChange={setCurrentCategory}>
        {CATEGORIES.map(cat => (
          <Tab key={cat} value={cat} className="capitalize">
            {cat}
          </Tab>
        ))}
      </Tabs>
      <Card>
        <CardContent className="flex flex-col gap-2 p-4">
          <Input
            placeholder="Task/Goal name"
            value={task}
            onChange={e => setTask(e.target.value)}
          />
          <Input
            placeholder="Score (e.g., -1, 0.25)"
            value={score}
            onChange={e => setScore(e.target.value)}
          />
          <Button onClick={handleAddScore}>Add Score</Button>
        </CardContent>
      </Card>
      <LineChart
        width={800}
        height={400}
        data={buildChartData()}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[-100, 100]} />
        <Tooltip />
        <Legend />
        {[...new Set(buildChartData().flatMap(d => Object.keys(d).filter(k => k !== "date")))].map(key => (
          <Line type="monotone" dataKey={key} key={key} stroke="#8884d8" dot={false} />
        ))}
      </LineChart>
    </div>
  );
}
