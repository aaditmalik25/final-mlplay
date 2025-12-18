import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DepthCard } from "@/components/ui/depth-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { AnimatedBackground } from "@/components/3d/AnimatedBackground";
import { motion } from "framer-motion";
import { PlusGrid } from "@/components/ui/plus-grid";

const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const signinSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === "SIGNED_IN") {
        navigate("/problems");
      }
    });

    // THEN check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/problems");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const validated = signupSchema.parse(data);
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: validated.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Account created!",
          description: "You can now sign in with your credentials.",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const validated = signinSchema.parse(data);

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      } else {
        navigate("/problems");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* 3D Animated Background */}
      <AnimatedBackground />

      {/* Grid pattern overlay */}
      {/* Grid pattern overlay */}
      <PlusGrid spacing={40} radius={140} color="#bc13fe" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <motion.div
              className={`p-2 rounded-lg bg-black/40 backdrop-blur-sm border transition-colors duration-300 ${activeTab === "signin"
                ? "border-neon-cyan/50 group-hover:border-neon-cyan"
                : "border-neon-pink/50 group-hover:border-neon-pink"
                }`}
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              style={{
                boxShadow: activeTab === "signin"
                  ? "0 0 15px rgba(0,243,255,0.2)"
                  : "0 0 15px rgba(255,0,68,0.2)"
              }}
            >
              <Code2 className={`h-8 w-8 transition-colors duration-300 ${activeTab === "signin" ? "text-neon-cyan" : "text-neon-pink"
                }`} />
            </motion.div>
            <span className="text-2xl font-bold text-white">
              ML Playground
            </span>
          </Link>
          <p className="text-white/70">
            Join thousands learning machine learning
          </p>
        </div>

        <DepthCard
          className={`p-6 !bg-black/10 backdrop-blur-sm shadow-xl transition-all duration-300 ${activeTab === "signin"
            ? "border-neon-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.1)]"
            : "border-neon-pink/30 shadow-[0_0_30px_rgba(255,0,68,0.1)]"
            }`}
          depth="lg"
          hoverLift={true}
          tiltEffect={true}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/40 border border-white/10">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-neon-pink data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-[0_0_20px_rgba(255,0,68,0.4)] transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="bg-black/40 border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-black/40 border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-300"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-neon-cyan text-black hover:bg-neon-cyan/90 font-bold shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </motion.div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="bg-black/40 border-white/10 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="bg-black/40 border-white/10 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="bg-black/40 border-white/10 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all duration-300"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-neon-pink text-white hover:bg-neon-pink/90 font-bold shadow-[0_0_20px_rgba(255,0,68,0.3)] hover:shadow-[0_0_30px_rgba(255,0,68,0.5)] transition-all duration-300 border border-neon-pink"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </motion.div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-white/70">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </DepthCard>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-1 group">
            <motion.span
              className="inline-block"
              animate={{ x: [-2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            >
              ←
            </motion.span>
            <span>Back to home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
