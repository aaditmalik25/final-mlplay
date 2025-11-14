import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              ML Playground
            </span>
          </Link>
          <p className="text-white/70">
            Join thousands learning machine learning
          </p>
        </div>

        <Card className="p-6 bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-white/10" style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/50 border border-white/10">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white/90">Email</Label>
                  <Input 
                    id="signin-email"
                    name="email"
                    type="email" 
                    placeholder="your@email.com" 
                    required 
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20 transition-all duration-300 hover:border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white/90">Password</Label>
                  <Input 
                    id="signin-password"
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20 transition-all duration-300 hover:border-white/30"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-white/90 font-semibold shadow-lg shadow-white/20 hover:shadow-white/30 hover:scale-[1.02] transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-white/90">Full Name</Label>
                  <Input 
                    id="signup-name"
                    name="fullName"
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20 transition-all duration-300 hover:border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white/90">Email</Label>
                  <Input 
                    id="signup-email"
                    name="email"
                    type="email" 
                    placeholder="your@email.com" 
                    required 
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20 transition-all duration-300 hover:border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white/90">Password</Label>
                  <Input 
                    id="signup-password"
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    minLength={6}
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20 transition-all duration-300 hover:border-white/30"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-white/90 font-semibold shadow-lg shadow-white/20 hover:shadow-white/30 hover:scale-[1.02] transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-white/50">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </Card>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-1 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
