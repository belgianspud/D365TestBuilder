import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  TestTube, 
  FileText, 
  Calendar, 
  Settings, 
  Bot,
  Menu,
  X,
  User,
  LogOut,
  BarChart3
} from "lucide-react";

interface NavigationProps {
  children: React.ReactNode;
}

const navigationItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/test-cases", label: "Test Cases", icon: TestTube },
  { href: "/flow-builder", label: "Flow Builder", icon: FileText },
  { href: "/results", label: "Results", icon: BarChart3 },
  { href: "/scheduler", label: "Scheduler", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Navigation({ children }: NavigationProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo and Brand */}
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">D365 Test Automation</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location === item.href || 
                    (item.href !== "/" && location.startsWith(item.href));
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button 
                        variant={isActive ? "default" : "ghost"}
                        className="flex items-center gap-2"
                      >
                        <IconComponent className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
              {/* Status indicator */}
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online
                </Badge>
              </div>

              {/* User menu */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location === item.href || 
                  (item.href !== "/" && location.startsWith(item.href));
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}