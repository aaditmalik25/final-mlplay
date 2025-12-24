import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Trophy, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useUserXP } from "@/hooks/useUserXP";
import { LightningZap } from "@/components/LightningZap";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { xp } = useUserXP(); // Use the hook

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link
        to="/topics"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          isActive("/topics")
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-secondary"
        )}
      >
        <Code2 className="h-4 w-4" />
        Topics
      </Link>
      <Link
        to="/problems"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          isActive("/problems")
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-secondary"
        )}
      >
        <Code2 className="h-4 w-4" />
        Problems
      </Link>
      <Link
        to="/leaderboard"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          isActive("/leaderboard")
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-secondary"
        )}
      >
        <Trophy className="h-4 w-4" />
        Leaderboard
      </Link>
      <Link
        to="/dashboard"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          isActive("/dashboard")
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-secondary"
        )}
      >
        <User className="h-4 w-4" />
        Dashboard
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md supports-[backdrop-filter]:bg-black/20">
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-50" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ML Playground
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks />
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {/* XP Display */}
                {/* XP Display */}
                <div className="flex items-center gap-1.5 mr-2 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-yellow-500/30 backdrop-blur-xl shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:border-yellow-500/60 transition-all duration-300 group cursor-default">
                  <LightningZap />
                  <span className="font-bold text-sm bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent font-mono tracking-wider drop-shadow-sm">
                    {xp} XP
                  </span>
                </div>

                <Button asChild variant="ghost">
                  <Link to="/problems">Go to Problems</Link>
                </Button>
                <Button variant="secondary" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks mobile />
                <div className="flex flex-col gap-2 mt-4">
                  {isLoggedIn ? (
                    <>
                      <Button asChild variant="outline">
                        <Link to="/problems">Go to Problems</Link>
                      </Button>
                      <Button onClick={handleSignOut}>Sign Out</Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link to="/auth">Sign In</Link>
                      </Button>
                      <Button asChild>
                        <Link to="/auth">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
