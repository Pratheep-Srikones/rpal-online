"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Moon,
  Sun,
  Code,
  Play,
  ArrowRight,
  Terminal,
  GitBranch,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-foreground rounded-md">
                <Code className="h-5 w-5 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">RPAL Interpreter</h1>
                <p className="text-sm text-muted-foreground">
                  Online Programming Environment
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            RPAL Programming Environment
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            A clean, focused interpreter for the RPAL functional programming
            language. Write, execute, and analyze your code with real-time AST
            and ST visualization.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/interpreter">
              <Button size="lg" className="px-8">
                <Play className="h-4 w-4 mr-2" />
                Start Coding
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              View Documentation
            </Button>
          </div>

          {/* Code Preview */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="text-left font-mono text-sm space-y-1">
                <div className="text-muted-foreground">
                  // Factorial function in RPAL
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400">let</span>
                  <span className="text-purple-600 ml-2">
                    rec
                  </span> factorial {" n "}={" "}
                </div>
                <div className="ml-4">
                  n{" "}
                  <span className="text-orange-600 dark:text-orange-400">
                    eq
                  </span>{" "}
                  0 -&gt; 1 | n * factorial (n - 1)
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400">in</span>{" "}
                  factorial 5
                </div>
                <div className="text-muted-foreground pt-2">// Output: 120</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="mx-auto mb-4 p-3 bg-muted rounded-lg w-fit">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Interactive Execution
            </h3>
            <p className="text-muted-foreground text-sm">
              Execute RPAL programs instantly with immediate feedback and
              results.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 p-3 bg-muted rounded-lg w-fit">
              <GitBranch className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tree Visualization</h3>
            <p className="text-muted-foreground text-sm">
              View Abstract Syntax Trees and Standardized Trees to understand
              program structure.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 p-3 bg-muted rounded-lg w-fit">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Clean Interface</h3>
            <p className="text-muted-foreground text-sm">
              Minimal, distraction-free environment focused on your code and
              results.
            </p>
          </div>
        </div>

        {/* Language Reference */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Language Reference
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium mb-3">Functions</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-muted p-2 rounded font-mono">
                    fn x. x + 1
                  </div>
                  <div className="bg-muted p-2 rounded font-mono">
                    let f x = x * 2
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Conditionals</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-muted p-2 rounded font-mono">
                    x &gt; 0 -&gt; 'pos' | 'neg'
                  </div>
                  <div className="bg-muted p-2 rounded font-mono">
                    n eq 0 -&gt; 1 | n
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Operations</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-muted p-2 rounded font-mono">
                    +, -, *, /
                  </div>
                  <div className="bg-muted p-2 rounded font-mono">
                    eq, ne, ls, gr
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Data Types</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-muted p-2 rounded font-mono">
                    (1, 2, 3)
                  </div>
                  <div className="bg-muted p-2 rounded font-mono">
                    'strings'
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to start programming?
          </h2>
          <p className="text-muted-foreground mb-6">
            Jump into the interpreter and explore functional programming with
            RPAL.
          </p>
          <Link href="/interpreter">
            <Button size="lg" className="px-8">
              Launch Interpreter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-foreground rounded-md">
                <Code className="h-4 w-4 text-background" />
              </div>
              <span className="font-medium">RPAL Interpreter</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built for educational purposes
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
