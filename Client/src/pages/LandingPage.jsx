import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Leaf, Shield, MapPin, FileText, Zap, CheckCircle2,
  ArrowRight, ChevronRight, Star, BarChart3,
  Microscope, Smartphone, Cloud, Users
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { CROP_TYPES } from '../utils/constants'

// ── Animation hook using IntersectionObserver ────────────────────────────────
function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ number, label, icon: Icon }) {
  return (
    <div className="glass rounded-2xl p-6 text-center flex flex-col items-center gap-2
                    hover:scale-105 transition-transform duration-300">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-1">
        <Icon size={20} className="text-emerald-300" />
      </div>
      <div className="text-3xl font-bold text-white">{number}</div>
      <div className="text-sm text-emerald-200 font-medium">{label}</div>
    </div>
  )
}

// ── Feature Card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, color, delay }) {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border
                 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1
                 transition-all duration-300 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4
                   group-hover:scale-110 transition-transform duration-300"
        style={{ background: `${color}18`, border: `1.5px solid ${color}30` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <h3 className="font-bold text-text-primary text-base mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// ── Step Card ─────────────────────────────────────────────────────────────────
function StepCard({ number, title, description, icon: Icon }) {
  return (
    <div className="flex gap-5 group">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center
                        font-bold text-white text-lg shadow-lg shadow-primary/30
                        group-hover:scale-110 transition-transform duration-300 shrink-0">
          {number}
        </div>
        {number < 4 && <div className="w-0.5 flex-1 bg-gradient-to-b from-primary-mid to-transparent mt-3" />}
      </div>
      <div className="pb-10">
        <div className="flex items-center gap-2 mb-2">
          <Icon size={18} className="text-primary-mid" />
          <h3 className="font-bold text-text-primary text-base">{title}</h3>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ── Hero Mockup Cards ─────────────────────────────────────────────────────────
function DashboardCard() {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl p-4 w-64 shadow-xl animate-float">
      <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">
        Inspection Dashboard
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[{ n: '5', l: 'Pending', c: '#F59E0B', bg: '#FFFBEB' }, { n: '12', l: 'Done', c: '#10B981', bg: '#ECFDF5' }, { n: '2', l: 'Rejected', c: '#EF4444', bg: '#FEF2F2' }].map((s) => (
          <div key={s.l} className="rounded-xl p-2 text-center" style={{ background: s.bg }}>
            <div className="text-lg font-extrabold" style={{ color: s.c }}>{s.n}</div>
            <div className="text-[10px] font-medium text-text-secondary">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="w-full bg-primary text-white text-xs font-bold
                      rounded-xl py-2.5 text-center flex items-center justify-center gap-1 shadow-sm">
        <span>Start New Inspection</span>
        <ArrowRight size={12} />
      </div>
    </div>
  )
}

function StageCard() {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-border rounded-2xl p-4 w-56 shadow-xl animate-float-slow"
      style={{ animationDelay: '1s' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="bg-primary-lighter text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary-light">
          Stage 2
        </span>
        <span className="text-text-secondary text-[10px] font-semibold">Flowering</span>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-[11px] text-text-primary font-semibold mb-1">
          <span>Uniformity</span>
          <span className="text-primary">78%</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '78%' }} />
        </div>
      </div>
      <div className="space-y-2">
        {['Rust', 'Smut'].map((d) => (
          <div key={d} className="flex items-center justify-between text-[11px]">
            <span className="text-text-secondary font-medium">{d} Disease</span>
            <div className="w-8 h-4 bg-gray-200 rounded-full shadow-inner" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportCard() {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 w-52 shadow-xl animate-float"
      style={{ animationDelay: '2s' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-success-bg border border-success/20 rounded-lg flex items-center justify-center">
          <CheckCircle2 size={14} className="text-success" />
        </div>
        <span className="text-xs font-bold text-success">Approved</span>
      </div>
      <div className="text-text-secondary text-xs mb-3 leading-relaxed font-medium">
        Wheat • Hybrid <br /> 4/4 Stages Completed
      </div>
      <div className="bg-accent-blue/10 border border-accent-blue/20
                      text-accent-blue text-[10px] font-bold
                      rounded-xl py-1.5 text-center transition-colors hover:bg-accent-blue hover:text-white">
        Download PDF Report
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const statsRef = useFadeIn()
  const featuresRef = useFadeIn()
  const howRef = useFadeIn()
  const cropsRef = useFadeIn()
  const aboutRef = useFadeIn()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ═══════════════════════════════════ HERO ══════════════════════════════ */}
      <section id="home" className="relative pt-32 pb-20 bg-white overflow-hidden flex flex-col items-center">
        
        {/* Local Style for Vine Animation */}
        <style>{`
          @keyframes gentle-wind {
            0%, 100% { transform: skewX(-1.5deg); }
            50% { transform: skewX(1.5deg); }
          }
        `}</style>
        
        {/* Hanging Foliage / Vines Decorative Top Border */}
        {/* <div 
          className="absolute inset-x-[-5%] top-[-30px] md:top-0 h-[250px] md:h-[400px] w-[110%] z-10 opacity-90 pointer-events-none bg-repeat-x bg-top mix-blend-multiply filter brightness-110 contrast-125 saturate-150"
          style={{ 
            backgroundImage: 'url("/assets/images/hanging_vines.png")',
            backgroundSize: 'contain',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            transformOrigin: 'top center',
            animation: 'gentle-wind 4s ease-in-out infinite'
          }}
        /> */}

        {/* Realistic Greenery Texture Background */}
        <div 
          className="absolute inset-x-0 top-0 h-[800px] w-full -z-10 opacity-30 pointer-events-none bg-cover bg-center mix-blend-multiply"
          style={{ 
            backgroundImage: 'url("/assets/images/greenery_bg.png")', 
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
          }}
        />

        {/* Professional Greenery Effects & Ambient Glows */}
        <div className="absolute top-[-10%] inset-x-0 h-[600px] w-full 
                        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
                        from-emerald-100/60 via-emerald-50/20 to-white blur-3xl -z-10" />
        
        {/* Ambient Emerald Orbs */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-emerald-300/20 rounded-full blur-[80px] animate-pulse pointer-events-none -z-10" />
        <div className="absolute top-40 right-[10%] w-72 h-72 bg-primary-light/20 rounded-full blur-[80px] animate-pulse delay-700 pointer-events-none -z-10" />
        <div className="absolute top-80 left-[20%] w-48 h-48 bg-green-400/20 rounded-full blur-[80px] animate-pulse delay-1000 pointer-events-none -z-10" />

        {/* Decorative Sketches in Hero Area */}
        <div className="absolute top-63 left-[-30vw] md:left-[-15vw] lg:left-[-10vw] xl:left-[-5vw] 2xl:left-[0vw] z-0 pointer-events-none transform -rotate-3">
          {/* Inspector on Left */}
          <img 
            src="/assets/images/inspector_drawing.png" 
            alt="" 
            className="w-80 h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] object-contain mix-blend-multiply brightness-110 contrast-150" 
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center z-10 pt-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-border bg-white shadow-sm mb-8 animate-fade-up">
            <span className="text-primary text-[11px] font-extrabold tracking-widest pl-1 uppercase">v1.0</span>
            <span className="w-px h-3 bg-border" />
            <span className="text-text-secondary text-xs font-semibold pr-1">Patent Pending Innovation</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-extrabold text-text-primary tracking-tight leading-[1.1] mb-6 animate-fade-up delay-100">
            Next-Gen Seed Quality,<br />
            built for Inspectors.
          </h1>

          {/* Subtitle */}
          <p className="text-text-secondary text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
            Engineered to eliminate paper trails using native digital workflows.
            <br className="hidden md:block" />
            Includes multi-stage checklists and GPS-enabled field tracking.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <Link
              to="/register"
              className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-full font-bold
                         flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Inspecting <ArrowRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-white hover:bg-gray-50 text-text-primary border border-border px-8 py-3.5 
                         rounded-full font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <FileText size={18} className="text-text-muted" /> View workflow
            </a>
          </div>
        </div>

        {/* Browser Mockup Image containing Floating Cards */}
        <div className="w-full max-w-5xl mx-auto mt-20 px-4 sm:px-6 relative animate-fade-up delay-400">
          {/* Crop peeking from behind the browser box */}
          <div className="absolute -top-[330px] -right-10 md:-right-32 lg:-right-48 xl:-right-40 z-0 transform rotate-[15deg] pointer-events-none hidden sm:block">
            {/* <img 
              src="/assets/images/crops_drawing.png" 
              alt="" 
              className="w-64 h-64 md:w-[400px] md:h-[400px] object-contain mix-blend-multiply brightness-110 contrast-150" 
            /> */}
          </div>

          <div className="rounded-t-2xl rounded-b-2xl border border-border bg-white shadow-2xl overflow-hidden relative z-10 flex flex-col pointer-events-none sm:pointer-events-auto">

            {/* Browser top bar */}
            <div className="bg-gray-50 border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80 border border-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80 border border-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-400/80 border border-green-500/20" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bg-white border border-border rounded-lg px-20 py-1.5 text-[10px] text-text-muted font-semibold shadow-sm flex items-center gap-1.5">
                🔒 seedinspect.app/dashboard
              </div>
              <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Browser Window Content (whiteboard/dots background) */}
            <div className="bg-[#fafafa] w-full h-[380px] md:h-[500px] relative overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}>

              {/* Floating Cards simulating interactive canvas */}

              {/* Functional Mockup Cards */}
              <div className="absolute top-8 left-4 md:left-24 z-10 scale-[0.85] md:scale-100 hover:z-50 transition-transform cursor-pointer hidden sm:block">
                <DashboardCard />
              </div>
              <div className="absolute top-24 right-4 md:right-24 z-20 scale-[0.85] md:scale-100 hover:z-50 transition-transform cursor-pointer">
                <StageCard />
              </div>
              <div className="absolute bottom-6 left-[10%] md:left-1/2 md:translate-x-[-80%] md:bottom-16 z-30 scale-[0.85] md:scale-100 hover:z-50 transition-transform cursor-pointer">
                <ReportCard />
              </div>

            </div>
          </div>
        </div>
      </section >

      {/* ═══════════════════════════════════ STATS ═════════════════════════════ */}
      <section ref={statsRef} className="fade-section py-20 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-card rounded-3xl p-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard number="5" label="Crop Types" icon={Leaf} />
            <StatCard number="4" label="Insp. Stages" icon={BarChart3} />
            <StatCard number="100%" label="Paperless" icon={Cloud} />
            <StatCard number="GPS" label="Field Tracking" icon={MapPin} />
          </div>
        </div>
      </section >

      {/* ════════════════════════════════ FEATURES ═════════════════════════════ */}
      <section id="features" ref={featuresRef} className="fade-section py-24 bg-app-bg" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-primary-lighter text-primary
                             text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-primary-light">
              <Zap size={14} />
              Powerful Features
            </span>
            <h2 className="text-4xl font-extrabold text-text-primary mb-4">
              Everything an Inspector Needs
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              From crop registration to digital report generation — all in one mobile-first app.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Microscope, title: 'Stage-by-Stage Inspection', color: '#065F46',
                description: 'Walk through Vegetative, Flowering, Pre-Harvest, and Final stages with guided checklists.'
              },
              {
                icon: MapPin, title: 'GPS Field Mapping', color: '#0EA5E9',
                description: 'Drop a GPS pin or draw field boundaries directly in the app.'
              },
              {
                icon: FileText, title: 'PDF Report Generation', color: '#8B5CF6',
                description: 'Generate professional inspection reports and download them as PDF instantly.'
              },
              {
                icon: Leaf, title: 'Multi-Crop Support', color: '#10B981',
                description: 'Supports Wheat, Rice, Maize, Sorghum, and Sunflower with crop-specific checks.'
              },
              {
                icon: Shield, title: 'Disease Monitoring', color: '#EF4444',
                description: 'Track Rust, Smut, Blight and more with toggle-based disease monitoring forms.'
              },
              {
                icon: Cloud, title: 'Authority Submission', color: '#F59E0B',
                description: 'Submit final reports directly to the authority via email with one tap.'
              },
            ].map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      < section id="how-it-works" ref={howRef} className="fade-section py-24 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: steps */}
            <div>
              <span className="inline-flex items-center gap-2 bg-primary-lighter text-primary
                               text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary-light">
                <Smartphone size={14} />
                Simple Workflow
              </span>
              <h2 className="text-4xl font-extrabold text-text-primary mb-4">
                How It Works
              </h2>
              <p className="text-text-secondary mb-10 leading-relaxed">
                Four simple steps from field to certified, submission-ready report.
              </p>

              <div>
                {[
                  { icon: Users, title: 'Register & Login', description: 'Create your inspector account and get a unique Inspector ID automatically assigned.' },
                  { icon: Leaf, title: 'Select Crop & Register Field', description: 'Choose the crop type, production method, and register farmer and GPS field details.' },
                  { icon: Microscope, title: 'Conduct Stage Inspections', description: 'Walk through each growth stage, fill checklist forms with sliders, toggles, and photo uploads.' },
                  { icon: FileText, title: 'Generate & Submit Report', description: 'Review the final verdict, download the PDF, and submit it directly to the certification authority.' },
                ].map((step, i) => (
                  <StepCard key={step.title} number={i + 1} {...step} />
                ))}
              </div>
            </div>

            {/* Right: visual - Farmer sketch only */}
            <div className="sticky top-24 flex items-center justify-center min-h-[500px] md:min-h-[700px]">
              <div className="z-0 pointer-events-none transform rotate-3">
                <img 
                  src="/assets/images/farmer_drawing.png" 
                  alt="Farmer" 
                  className="w-auto h-[400px] md:h-[550px] lg:h-[750px] object-contain mix-blend-multiply brightness-90 contrast-175 opacity-80 transition-all duration-700 hover:scale-105 transform scale-x-[-1]" 
                />
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ═══════════════════════════════════ CROPS ═════════════════════════════ */}
      < section id="crops" ref={cropsRef} className="fade-section py-24 bg-app-bg" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-primary-lighter text-primary
                           text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-primary-light">
            <Leaf size={14} />
            Crop Coverage
          </span>
          <h2 className="text-4xl font-extrabold text-text-primary mb-4">
            5 Major Crop Types Supported
          </h2>
          <p className="text-text-secondary mb-12 max-w-xl mx-auto leading-relaxed">
            Tailored inspection forms for each crop — ensuring accurate, relevant assessments across varieties.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            {CROP_TYPES.map((crop) => (
              <div
                key={crop.id}
                className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3
                           shadow-sm border border-border w-36
                           hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ background: crop.bg, border: `1.5px solid ${crop.color}30` }}
                >
                  {crop.emoji}
                </div>
                <span className="font-bold text-text-primary text-sm">{crop.label}</span>
                <span
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${crop.color}15`, color: crop.color }}
                >
                  Supported
                </span>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════ ABOUT ══════════════════════════════ */}
      < section id="about" ref={aboutRef} className="fade-section py-24 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-2 bg-primary-lighter text-primary
                               text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary-light">
                <Shield size={14} />
                Patent Pending
              </span>
              <h2 className="text-4xl font-extrabold text-text-primary mb-6">
                About the Invention
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                SeedInspect Pro is a patent-pending digital platform developed by agriculture
                research students for field quality assurance of certified seeds. The system
                digitizes the traditional paper-based inspection workflow that seed certification
                authorities use across India.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                The invention enables GPS-tagged field inspections, multi-stage quality
                assessments with standardized checklists, real-time data capture, and direct
                digital report submission to regulatory authorities.
              </p>

              {/* Patent status badge */}
              <div className="inline-flex items-center gap-3 bg-warning-bg border border-warning/30
                              px-5 py-3 rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-warning animate-pulse" />
                <span className="text-warning font-bold text-sm">Patent Application Filed</span>
              </div>
            </div>

            {/* Right: info cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Category', value: 'Agricultural Tech', icon: '🌾' },
                { label: 'Domain', value: 'Seed Certification', icon: '🔬' },
                { label: 'Target Users', value: 'Field Inspectors', icon: '👤' },
                { label: 'Status', value: 'Patent Pending', icon: '📋' },
                { label: 'Platform', value: 'Mobile PWA', icon: '📱' },
                { label: 'Development', value: 'MERN / MySQL Stack', icon: '⚙️' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-app-bg rounded-2xl p-4 border border-border
                             hover:border-primary-light hover:shadow-sm transition-all"
                >
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <div className="text-text-muted text-xs font-medium mb-1">{item.label}</div>
                  <div className="text-text-primary text-sm font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* ════════════════════════════════════ CTA ══════════════════════════════ */}
      < section className="py-24 gradient-hero relative overflow-hidden" >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-40 h-40 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="glass rounded-3xl p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Ready to Modernize
              <br />
              <span className="gradient-text">Seed Inspection?</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join field inspectors who are already using SeedInspect Pro for accurate,
              paperless, GPS-tagged seed quality assessments.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                id="cta-register"
                className="flex items-center gap-2 bg-primary-mid hover:bg-success
                           text-white font-bold px-8 py-4 rounded-2xl
                           transition-all duration-300 glow-button hover:scale-105"
              >
                Create Inspector Account
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                id="cta-login"
                className="flex items-center gap-2 glass text-white font-semibold
                           px-8 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
              >
                Inspector Login
              </Link>
            </div>
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════ FOOTER ═════════════════════════════ */}
      < footer className="bg-gray-950 text-white py-16" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <Leaf size={18} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg text-white">SeedInspect Pro</span>
                  <span className="block text-[10px] text-emerald-400 tracking-widest uppercase">
                    Patent Pending
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                A digital seed quality inspection platform built for field inspectors and
                seed certification authorities.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-sm text-gray-300 mb-4 uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {['Features', 'How It Works', 'Crops', 'About'].map((l) => (
                  <li key={l}>
                    <button
                      onClick={() => {
                        const id = l.toLowerCase().replace(/ /g, '-')
                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auth */}
            <div>
              <h4 className="font-semibold text-sm text-gray-300 mb-4 uppercase tracking-wider">
                Access
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link to="/login" className="hover:text-emerald-400 transition-colors">
                    Inspector Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-emerald-400 transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row
                          items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} SeedInspect Pro · All rights reserved · Patent Pending
            </p>
            <p className="text-gray-600 text-xs">
              Built for Achyuttam Research · Seed Field Quality Assurance System
            </p>
          </div>
        </div>
      </footer >
    </div >
  )
}
