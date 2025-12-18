import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Brain, Code2, TrendingUp, Users, Award, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useMemo } from "react";


function PlusGrid({ spacing = 40, radius = 100, color = "#94a3b8" }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const refs = useRef<HTMLDivElement[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const [size, setSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 0,
    h: typeof document !== "undefined" ? document.documentElement.scrollHeight : 0,
  });

  // update size on resize and scroll (scroll affects document height if content changes)
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      // full document height (covers entire page)
      const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      setSize({ w, h });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    window.addEventListener("scroll", updateSize); // update if content/layout changes on scroll
    // optional: mutation observer could be added if DOM changes dynamically, but scroll+resize covers most cases

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("scroll", updateSize);
    };
  }, []);

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const cols = Math.ceil(size.w / spacing) + 1;
    const rows = Math.ceil(size.h / spacing) + 1;
    // optional center offset so grid lines align with your tiled SVG if you use one:
    const xOffset = spacing / 2;
    const yOffset = spacing / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pts.push({ x: c * spacing + xOffset, y: r * spacing + yOffset });
      }
    }
    return pts;
  }, [size.w, size.h, spacing]);

  useEffect(() => {
    let raf = 0;
    let running = false;

    const animate = () => {
      running = true;
      const mx = mouse.current.x;
      const my = mouse.current.y + window.scrollY;

      for (let i = 0; i < refs.current.length; i++) {
        const el = refs.current[i];
        if (!el) continue;

        const px = Number(el.dataset.x);
        const py = Number(el.dataset.y);
        const dx = px - mx;
        const dy = py - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, (radius - dist) / radius);

        const scale = 1 + proximity * 0.6;
        const brightness = 0.6 + proximity * 1.4;
        const opacity = 0.3 + proximity * 0.4;

        el.style.transform = `translate(${px}px, ${py}px) translate(-50%,-50%) scale(${scale})`;
        el.style.filter = `brightness(${brightness})`;
        el.style.opacity = opacity.toString();
      }

      raf = requestAnimationFrame(animate);
    };

    // ⭐ START THE LOOP IMMEDIATELY — FIXES FIRST-TIME LAG
    raf = requestAnimationFrame(animate);
    running = true;

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [radius]);


  return (
    // container covers entire document height so pluses are placed across the full page
    <div
      ref={containerRef}
      className="pointer-events-none"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: size.h, // crucial: set container height to document height
        overflow: "hidden",
      }}
    >
      {points.map((p, i) => (
        <div
          key={i}
          ref={(el) => (refs.current[i] = el as HTMLDivElement)}
          data-x={p.x}
          data-y={p.y}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 18,
            height: 18,
            transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`,
            opacity: 0.2,
            transition: "transform 120ms linear, filter 120ms linear, opacity 120ms linear",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="6" y1="1" x2="6" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="6" x2="11" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      ))}
    </div>
  );
}

const Index = () => {
  const [startPath, setStartPath] = useState("/auth");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStartPath(session ? "/problems" : "/auth");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setStartPath(session ? "/problems" : "/auth");
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Animated 3D background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating elements - kept subtle for depth without washing out black */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
      </div>

      {/* Grid pattern overlay */}
      <PlusGrid spacing={40} radius={140} color="#bc13fe" />


      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-neon-cyan to-neon-purple bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,242,254,0.3)] animate-gradient-x bg-[length:200%_auto]">
                Master Machine Learning
              </span>
              <span className="block bg-gradient-to-r from-neon-purple via-neon-pink to-white bg-clip-text text-transparent mt-2 animate-gradient-x bg-[length:200%_auto]">
                One Problem at a Time
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8">
              Practice real-world ML algorithms, compete with others, and level up your data science skills with curated challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg bg-white text-black hover:bg-white/90 font-semibold shadow-[0_0_15px_rgba(0,242,254,0.5)] hover:shadow-[0_0_25px_rgba(0,242,254,0.8)] hover:scale-105 transition-all duration-300">
                <Link to={startPath}>Start Learning</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg border-white/20 text-white hover:text-white hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-300 !text-white !hover:text-white"
              >
                <Link to="/auth">Sign Up Free</Link>
              </Button>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Why ML Playground?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-neon-cyan/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,242,254,0.3)] hover:-translate-y-2"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
              }}
            >
              <Brain className="h-12 w-12 text-neon-cyan mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Real ML Problems</h3>
              <p className="text-white/70">
                Tackle classification, regression, clustering, and more with real datasets and industry-relevant scenarios.
              </p>
            </Card>

            <Card
              className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-neon-purple/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(192,132,252,0.3)] hover:-translate-y-2"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
              }}
            >
              <Code2 className="h-12 w-12 text-neon-purple mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Interactive Code Editor</h3>
              <p className="text-white/70">
                Write, test, and submit your solutions directly in the browser with instant feedback.
              </p>
            </Card>

            <Card
              className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-neon-pink/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(240,46,170,0.3)] hover:-translate-y-2"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
              }}
            >
              <TrendingUp className="h-12 w-12 text-neon-pink mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Track Your Progress</h3>
              <p className="text-white/70">
                Monitor your improvement with detailed statistics, solve rates, and skill assessments.
              </p>
            </Card>

            <Card
              className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-neon-cyan/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,242,254,0.3)] hover:-translate-y-2"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
              }}
            >
              <Users className="h-12 w-12 text-neon-cyan mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Competitive Leaderboards</h3>
              <p className="text-white/70">
                Compete with data scientists worldwide and see how you rank on problem-solving challenges.
              </p>
            </Card>

            <Card
              className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-neon-purple/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(192,132,252,0.3)] hover:-translate-y-2"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
              }}
            >
              <Award className="h-12 w-12 text-neon-purple mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Earn Badges</h3>
              <p className="text-white/70">
                Unlock achievements as you solve problems and reach new milestones in your ML journey.
              </p>
            </Card>

            <Card
              className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-neon-pink/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(240,46,170,0.3)] hover:-translate-y-2"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
              }}
            >
              <BookOpen className="h-12 w-12 text-neon-pink mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Curated Content</h3>
              <p className="text-white/70">
                Learn from problems designed by ML experts, with difficulty levels from beginner to advanced.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <Card className="p-8 md:p-12 bg-black/60 backdrop-blur-xl border-white/10 text-white" style={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Level Up Your ML Skills?
              </h2>
              <p className="text-lg mb-8 text-white/70">
                Join thousands of data scientists practicing and improving their machine learning skills every day.
              </p>
              <Button asChild size="lg" className="text-lg bg-white text-black hover:bg-white/90 font-semibold shadow-[0_0_15px_rgba(0,242,254,0.5)] hover:shadow-[0_0_25px_rgba(0,242,254,0.8)] hover:scale-105 transition-all duration-300">
                <Link to="/auth">Start Your Journey</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-white" />
              <span className="font-semibold text-white">ML Playground</span>
            </div>
            <p className="text-sm text-white/60">
              © 2024 ML Playground. Built for ML enthusiasts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
