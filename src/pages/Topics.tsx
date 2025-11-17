import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { DepthCard } from "@/components/ui/depth-card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Topic {
  id: string;
  name: string;
  description: string;
  slug: string;
  order_index: number;
  icon: string;
}

const TopicCard = React.memo(function TopicCard({
  topic,
}: { topic: Topic }) {
  return (
    <Link to={`/topics/${topic.slug}`} aria-label={`Open ${topic.name}`}>
      <motion.div
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        transition={{ duration: 0.3 }}
      >
        <DepthCard className="p-6 group cursor-pointer" depth="md" hoverLift glassEffect>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{topic.icon}</div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {topic.name}
                </h3>

                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {topic.description}
              </p>

              <Badge variant="secondary" className="text-xs">
                Step {topic.order_index + 1}
              </Badge>
            </div>
          </div>
        </DepthCard>
      </motion.div>
    </Link>
  );
});
TopicCard.displayName = "TopicCard";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const CACHE_KEY = "topics_v1";

function scheduleIdle(fn: () => void) {
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(fn, { timeout: 2000 });
  } else {
    setTimeout(fn, 300);
  }
}

const Topics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFromServer = useCallback(
    async (signal?: AbortSignal): Promise<Topic[] | null> => {
      const t0 = performance.now();

      const { data, error } = await supabase
        .from("topics")
        .select("id, name, description, slug, order_index, icon")
        .order("order_index", { ascending: true });

      if (error) {
        console.error(error);
        return null;
      }
      if (signal?.aborted) return null;

      const t1 = performance.now();
      console.log(`SERVER FETCH: ${(t1 - t0).toFixed(1)}ms`);

      return data as Topic[];
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);

      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        try {
          const parsed = JSON.parse(cached) as Topic[];
          setTopics(parsed);
          setLoading(false);

          scheduleIdle(async () => {
            const fresh = await fetchFromServer(controller.signal);
            if (!fresh || cancelled) return;

            const freshString = JSON.stringify(fresh);
            if (freshString !== cached) {
              localStorage.setItem(CACHE_KEY, freshString);
              setTopics(fresh);
            }
          });

          return;
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      }

      // No cache → blocking fetch
      const fresh = await fetchFromServer(controller.signal);

      if (!fresh || cancelled) {
        setLoading(false);
        return;
      }

      setTopics(fresh);
      localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [fetchFromServer]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Light grid background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Learning Path
            </h1>
            <p className="text-white/70">
              Master machine learning from fundamentals to advanced topics
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <DepthCard key={i} className="p-6 animate-pulse" glassEffect>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </DepthCard>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 gap-4"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {topics.map((topic) => (
                <motion.div
                  key={topic.id}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                >
                  <TopicCard topic={topic} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topics;
