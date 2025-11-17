import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  acceptance_rate: number;
}

interface Topic {
  name: string;
  description: string;
}

const CACHE_PREFIX = "topic_page_v1:";

/** Run fn when the browser is idle (fallback to setTimeout) */
function scheduleIdle(fn: () => void, timeout = 2000) {
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(fn, { timeout });
  } else {
    setTimeout(fn, 300);
  }
}

/** Fetch wrapper with timeout and metrics */
async function fetchWithTimeoutAndMetrics<T>(
  fn: (signal?: AbortSignal) => Promise<T | null>,
  signal?: AbortSignal,
  timeoutMs = 10000
): Promise<{ data: T | null; timingMs: number; approxBytes: number }> {
  const ctrl = new AbortController();
  const outer = signal;
  if (outer) outer.addEventListener("abort", () => ctrl.abort(), { once: true });

  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const t0 = performance.now();
  try {
    const data = await fn(ctrl.signal);
    const t1 = performance.now();
    clearTimeout(timer);

    const approxBytes = data ? JSON.stringify(data).length : 0;
    return { data, timingMs: Math.round(t1 - t0), approxBytes };
  } catch (err) {
    const t1 = performance.now();
    clearTimeout(timer);
    return { data: null, timingMs: Math.round(t1 - t0), approxBytes: 0 };
  }
}

const TopicProblems = () => {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // The server call that returns the combined payload (topic + problems).
  // We keep the API exactly the same as you had previously.
  const fetchFromServer = useCallback(
    async (signal?: AbortSignal) => {
      // Fetch topic
      const { data: topicData, error: topicError } = await supabase
        .from("topics")
        .select("name, description")
        .eq("slug", slug)
        .single();

      if (topicError) throw topicError;

      // Fetch problems for this topic by topic id
      const topicIdResp = await supabase
        .from("topics")
        .select("id")
        .eq("slug", slug)
        .single();

      const topicId = topicIdResp?.data?.id;
      if (!topicId) {
        // no problems if topic not found
        return { topic: topicData as Topic, problems: [] as Problem[] };
      }

      const { data: problemsData, error: problemsError } = await supabase
        .from("problems")
        .select(`
          id,
          title,
          slug,
          difficulty,
          description,
          acceptance_rate,
          topic_id,
          order_index
        `)
        .eq("topic_id", topicId)
        .order("order_index");

      if (problemsError) throw problemsError;

      return { topic: topicData as Topic, problems: (problemsData || []) as Problem[] };
    },
    [slug]
  );

  useEffect(() => {
    if (!slug) return;
    let canceled = false;
    const controller = new AbortController();
    const cacheKey = `${CACHE_PREFIX}${slug}`;

    const load = async () => {
      setLoading(true);

      // Try cache first (read once)
      const cachedString = localStorage.getItem(cacheKey);
      if (cachedString) {
        try {
          const parsed = JSON.parse(cachedString) as {
            topic: Topic;
            problems: Problem[];
          };

          setTopic(parsed.topic);
          setProblems(parsed.problems || []);
          setLoading(false);

          // Schedule background refresh during idle time
          scheduleIdle(async () => {
            // background fetch with timeout and metrics
            const { data: fresh, timingMs, approxBytes } = await fetchWithTimeoutAndMetrics(
              fetchFromServer,
              controller.signal,
              8000
            );

            console.debug(`BG fetch timing: ${timingMs}ms, payload ~${approxBytes} bytes`);

            if (!fresh || controller.signal.aborted || canceled) return;

            const freshString = JSON.stringify(fresh);
            if (freshString !== cachedString) {
              try {
                localStorage.setItem(cacheKey, freshString);
              } catch (e) {
                console.warn("Could not write cache", e);
              }
              setTopic(fresh.topic);
              setProblems(fresh.problems || []);
              console.debug("Applied background update for topic page");
            } else {
              console.debug("BG refresh: no changes");
            }
          });

          return;
        } catch (err) {
          console.warn("Failed to parse cache, refetching", err);
          localStorage.removeItem(cacheKey);
          // fallthrough to fetch
        }
      }

      // No cache path (blocking fetch, but with timeout wrapper)
      try {
        const { data: fresh, timingMs, approxBytes } = await fetchWithTimeoutAndMetrics(
          fetchFromServer,
          controller.signal,
          10000
        );

        console.debug(`Main fetch timing: ${timingMs}ms, payload ~${approxBytes} bytes`);

        if (!fresh || controller.signal.aborted || canceled) {
          setLoading(false);
          return;
        }

        setTopic(fresh.topic);
        setProblems(fresh.problems || []);

        try {
          localStorage.setItem(cacheKey, JSON.stringify(fresh));
        } catch (e) {
          console.warn("Could not write cache", e);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast({
          title: "Error loading problems",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    load();

    return () => {
      canceled = true;
      controller.abort();
    };
  }, [slug, fetchFromServer, toast]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-easy";
      case "medium": return "text-medium";
      case "hard": return "text-hard";
      default: return "";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-easy/10 text-easy border-easy/20";
      case "medium": return "bg-medium/10 text-medium border-medium/20";
      case "hard": return "bg-hard/10 text-hard border-hard/20";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Decorative background (kept as-is) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/topics">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Link>
          </Button>

          {topic && (
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{topic.name}</h1>
              <p className="text-white/70">{topic.description}</p>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse bg-black/60 backdrop-blur-xl border-white/10">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                </Card>
              ))}
            </div>
          ) : problems.length === 0 ? (
            <Card className="p-8 text-center bg-black/60 backdrop-blur-xl border-white/10">
              <p className="text-white/70">No problems available yet for this topic.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {problems.map((problem) => (
                <Card
                  key={problem.id}
                  className="p-4 bg-black/60 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
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
                  <Link to={`/problem/${problem.slug}`}>
                    <div className="flex items-center gap-4">
                      <Circle className="h-5 w-5 text-white/60 flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 text-white">{problem.title}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={cn("bg-white/10 border-white/20 text-white", getDifficultyBg(problem.difficulty))}>
                            {problem.difficulty}
                          </Badge>
                          <span className="text-sm text-white/60">
                            {problem.acceptance_rate}% acceptance
                          </span>
                        </div>
                      </div>

                      <Button className="flex-shrink-0 bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black">
                        Solve
                      </Button>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicProblems;
