import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Trophy, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <nav className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/80">
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
