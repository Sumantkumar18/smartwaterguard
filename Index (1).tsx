import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Thermometer, Waves, Wind, Gauge, Zap } from "lucide-react";
import heroImage from "@/assets/hero-water.jpg";
import SensorGauge from "@/components/SensorGauge";
import BluetoothStatus from "@/components/BluetoothStatus";
import DiseaseWarnings from "@/components/DiseaseWarnings";
import MineralAnalysis from "@/components/MineralAnalysis";
import WaterQualityChart from "@/components/WaterQualityChart";
import WaterSampleSelector from "@/components/WaterSampleSelector";
import ScrollReveal from "@/components/ScrollReveal";
import AquaBot from "@/components/AquaBot";

const sampleData: Record<string, { ph: number; temp: number; tds: number; turbidity: number; do2: number }> = {
  S1: { ph: 7.2, temp: 25.4, tds: 310, turbidity: 1.8, do2: 7.5 },
  S2: { ph: 6.1, temp: 28.7, tds: 520, turbidity: 4.2, do2: 5.1 },
  S3: { ph: 5.3, temp: 31.2, tds: 780, turbidity: 8.9, do2: 3.2 },
};

const getStatus = (value: number, safeLow: number, safeHigh: number): "safe" | "warning" | "danger" => {
  if (value >= safeLow && value <= safeHigh) return "safe";
  const distLow = Math.abs(value - safeLow);
  const distHigh = Math.abs(value - safeHigh);
  const range = safeHigh - safeLow;
  if (Math.min(distLow, distHigh) < range * 0.5) return "warning";
  return "danger";
};

const Index = () => {
  const [selectedSample, setSelectedSample] = useState("S1");
  const [data, setData] = useState(sampleData.S1);

  useEffect(() => {
    setData(sampleData[selectedSample]);
  }, [selectedSample]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ph: prev.ph + (Math.random() - 0.5) * 0.05,
        temp: prev.temp + (Math.random() - 0.5) * 0.1,
        tds: prev.tds + (Math.random() - 0.5) * 5,
        turbidity: Math.max(0, prev.turbidity + (Math.random() - 0.5) * 0.1),
        do2: Math.max(0, prev.do2 + (Math.random() - 0.5) * 0.05),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedSample]);

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[360px] overflow-hidden flex items-center justify-center">
        <img
          src={heroImage}
          alt="Water monitoring visualization"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="water-ripple absolute w-96 h-96 rounded-full" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-display font-medium text-primary tracking-widest uppercase">
              IoT Powered
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground text-glow-primary mb-4 tracking-tight">
            AquaGuard
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground max-w-xl mx-auto font-light">
            Smart Water Quality Monitoring System
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Real-time analysis of pH, minerals, impurities & disease risk via Bluetooth-connected sensors
          </p>
        </motion.div>
      </section>

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto px-4 pb-16 -mt-8 relative z-10 space-y-6">
        {/* Top controls */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <WaterSampleSelector selected={selectedSample} onSelect={setSelectedSample} />
            <div className="md:w-72">
              <BluetoothStatus />
            </div>
          </div>
        </ScrollReveal>

        {/* Sensor Gauges */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <SensorGauge
              value={data.ph}
              min={0} max={14}
              label="pH Level"
              unit="pH"
              status={getStatus(data.ph, 6.5, 8.5)}
              icon={<Droplets className="w-4 h-4 text-primary" />}
            />
            <SensorGauge
              value={data.temp}
              min={0} max={50}
              label="Temperature"
              unit="°C"
              status={getStatus(data.temp, 20, 30)}
              icon={<Thermometer className="w-4 h-4 text-primary" />}
            />
            <SensorGauge
              value={data.tds}
              min={0} max={1000}
              label="TDS"
              unit="ppm"
              status={getStatus(data.tds, 0, 500)}
              icon={<Waves className="w-4 h-4 text-primary" />}
            />
            <SensorGauge
              value={data.turbidity}
              min={0} max={10}
              label="Turbidity"
              unit="NTU"
              status={getStatus(data.turbidity, 0, 5)}
              icon={<Wind className="w-4 h-4 text-primary" />}
            />
            <SensorGauge
              value={data.do2}
              min={0} max={14}
              label="Dissolved O₂"
              unit="mg/L"
              status={getStatus(data.do2, 5, 14)}
              icon={<Gauge className="w-4 h-4 text-primary" />}
            />
          </div>
        </ScrollReveal>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ScrollReveal delay={0.15}>
              <WaterQualityChart />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <DiseaseWarnings />
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.15}>
            <MineralAnalysis />
          </ScrollReveal>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground font-display tracking-wider">
          AquaGuard — IoT Water Quality Monitoring System © 2026
        </p>
      </footer>

      {/* AI Chatbot */}
      <AquaBot />
    </div>
  );
};

export default Index;
