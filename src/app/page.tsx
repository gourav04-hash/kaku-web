"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Pill,
  ShieldCheck,
  Video,
  Activity,
  ArrowRight,
  Users,
  FileText,
  MousePointer2
} from "lucide-react"

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Activity className="h-3 w-3" /> Now HIPAA Compliant & Interoperable
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8 bg-gradient-to-b from-zinc-950 to-zinc-600 bg-clip-text text-transparent">
              Healthcare, <br />
              <span className="text-primary italic">Reimagined</span> & <span className="underline decoration-primary/30 underline-offset-8">Unified</span>.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-500 mb-12 max-w-2xl font-medium leading-relaxed">
              Connect with specialists, manage medical records, and fulfill prescriptions in one seamless digital ecosystem. High-fidelity healthcare at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 group" asChild>
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold border-2" asChild>
                <Link href="/login">Explore Platform</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Secure EMR"
              desc="Longitudinal health history with patient-managed consent and document encryption."
            />
            <FeatureCard
              icon={<Video className="h-8 w-8" />}
              title="Teleconsultation"
              desc="High-fidelity video sessions with integrated clinical note-taking and e-prescribing."
            />
            <FeatureCard
              icon={<Pill className="h-8 w-8" />}
              title="Smart Pharmacy"
              desc="Instant fulfillment of digital prescriptions with one-click payment and tracking."
            />
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary p-1 rounded-3xl"
          >
            <div className="bg-white rounded-[1.4rem] p-12 md:p-20 text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Trusted by the Future of Medicine.</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">Join thousands of physicians and patients delivering modern care today.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                <StatItem label="Consultations" val="50K+" />
                <StatItem label="Physicians" val="2.5K+" />
                <StatItem label="Prescriptions" val="100K+" />
                <StatItem label="Security" val="99.9%" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="bg-primary p-1.5 rounded-xl">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span>Kaku Pharmacy</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-zinc-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">About</Link>
            <Link href="#" className="hover:text-primary transition-colors">API</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <motion.div
      variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
      className="bg-white p-10 rounded-[2.5rem] border border-zinc-200 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 group"
    >
      <div className="p-4 bg-primary/5 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform text-primary">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-zinc-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function StatItem({ label, val }: { label: string, val: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black text-primary">{val}</span>
      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">{label}</span>
    </div>
  )
}

function Badge({ children, className }: { children: any, className: string }) {
  return <div className={`inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</div>
}
