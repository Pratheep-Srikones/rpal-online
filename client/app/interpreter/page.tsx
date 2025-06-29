"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Moon,
  Sun,
  Play,
  Trash2,
  Code,
  GitBranch,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { changeTree } from "@/utils/convertTree";
import VisualTree from "@/components/tree";

// Mock RPAL interpreter functions
const parseRPAL = (code: string) => {
  if (!code.trim()) return null;

  return {
    type: "Program",
    body: {
      type: "Expression",
      operator: "let",
      bindings: [
        {
          type: "Binding",
          identifier: "x",
          value: { type: "Number", value: "5" },
        },
      ],
      expression: {
        type: "BinaryOp",
        operator: "+",
        left: { type: "Identifier", name: "x" },
        right: { type: "Number", value: "3" },
      },
    },
  };
};

const standardizeTree = (ast: any) => {
  if (!ast) return null;

  return {
    type: "StandardizedProgram",
    body: {
      type: "Gamma",
      left: {
        type: "Lambda",
        parameter: "x",
        body: {
          type: "Gamma",
          left: { type: "Operator", name: "+" },
          right: {
            type: "Tuple",
            elements: [
              { type: "Identifier", name: "x" },
              { type: "Number", value: "3" },
            ],
          },
        },
      },
      right: { type: "Number", value: "5" },
    },
  };
};

const executeRPAL = (code: string) => {
  if (!code.trim()) return "";

  if (code.includes("let x = 5 in x + 3")) {
    return "8";
  } else if (code.includes("1 + 2")) {
    return "3";
  } else if (code.includes("Print")) {
    return "Hello, RPAL!";
  } else if (code.includes("factorial")) {
    return "120";
  }

  return "Program executed successfully";
};

const formatTree = (tree: any, indent = 0): string => {
  if (!tree) return "";

  const spaces = "  ".repeat(indent);
  let result = "";

  if (typeof tree === "object") {
    if (tree.type) {
      result += `${spaces}${tree.type}`;
      if (tree.name) result += `: ${tree.name}`;
      if (tree.value) result += `: ${tree.value}`;
      if (tree.operator) result += `: ${tree.operator}`;
      if (tree.parameter) result += `: ${tree.parameter}`;
      result += "\n";

      Object.keys(tree).forEach((key) => {
        if (
          key !== "type" &&
          key !== "name" &&
          key !== "value" &&
          key !== "operator" &&
          key !== "parameter"
        ) {
          if (Array.isArray(tree[key])) {
            tree[key].forEach((item: any) => {
              result += formatTree(item, indent + 1);
            });
          } else if (typeof tree[key] === "object") {
            result += formatTree(tree[key], indent + 1);
          }
        }
      });
    }
  }

  return result;
};

export default function RPALInterpreter() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [ast, setAst] = useState<any>(null);
  const [st, setSt] = useState<any>(null);
  const [showAst, setShowAst] = useState(false);
  const [showSt, setShowSt] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load code from localStorage on component mount
  useEffect(() => {
    const savedCode = localStorage.getItem("rpal-code");
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Save code to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rpal-code", code);
  }, [code]);

  const runProgram = async () => {
    setIsRunning(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const astResult = parseRPAL(code);
      const stResult = standardizeTree(astResult);
      const executionResult = executeRPAL(code);

      setAst(astResult);
      setSt(stResult);
      setOutput(executionResult);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }

    setIsRunning(false);
  };

  const clearEditor = () => {
    setCode("");
    setOutput("");
    setAst(null);
    setSt(null);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  const sendCodeToServer = async () => {
    try {
      setIsRunning(true);
      const response = await fetch(`${api_url}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code, ast: showAst, st: showSt }),
      });

      if (!response.ok) {
        throw new Error("Failed to run code on server");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setOutput(data.result);
      if (data.ast) {
        setAst(data.ast);
        changeTree(ast);
      }
      if (data.st) {
        setSt(data.st);
        changeTree(st);
      }
    } catch (error) {
      setOutput(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsRunning(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-foreground rounded-md">
                  <Code className="h-5 w-5 text-background" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">RPAL Interpreter</h1>
                  <p className="text-sm text-muted-foreground">
                    Interactive Environment
                  </p>
                </div>
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

      <div className="container mx-auto p-6 space-y-6">
        {/* Main Editor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Code Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your RPAL program here...

Examples:
let x = 5 in x + 3

let factorial = fn n =>
  n eq 0 -> 1 | n * factorial (n - 1)
in factorial 5

Print 'Hello, RPAL!'"
                className="min-h-[300px] font-mono text-sm resize-none"
              />

              {/* Control Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={sendCodeToServer}
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isRunning ? "Running..." : "Run"}
                </Button>

                <Button
                  variant="outline"
                  onClick={clearEditor}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-ast"
                      checked={showAst}
                      onCheckedChange={(checked) =>
                        setShowAst(checked === true)
                      }
                    />
                    <label
                      htmlFor="show-ast"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Show AST
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-st"
                      checked={showSt}
                      onCheckedChange={(checked) => setShowSt(checked === true)}
                    />
                    <label
                      htmlFor="show-st"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Show ST
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md min-h-[300px] font-mono text-sm whitespace-pre-wrap">
                {output || "Run your program to see output here..."}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tree Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Abstract Syntax Tree */}
          {showAst && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GitBranch className="h-5 w-5" />
                  Abstract Syntax Tree
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md min-h-[200px] font-mono text-sm whitespace-pre-wrap overflow-auto">
                  {ast ? (
                    <VisualTree node={changeTree(ast)} />
                  ) : (
                    "No AST generated. Run your program first."
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Standardized Tree */}
          {showSt && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GitBranch className="h-5 w-5" />
                  Standardized Tree
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md min-h-[200px] font-mono text-sm whitespace-pre-wrap overflow-auto">
                  {st ? (
                    <VisualTree node={changeTree(st)} />
                  ) : (
                    "No ST generated. Run your program first."
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Language Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">Variables & Functions</h4>
                <div className="space-y-1">
                  <div className="bg-muted p-2 rounded font-mono">
                    let x = 5
                  </div>
                  <div className="bg-muted p-2 rounded font-mono">
                    fn x =&gt; x + 1
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Operations</h4>
                <div className="space-y-1">
                  <div className="bg-muted p-2 rounded font-mono">
                    +, -, *, /
                  </div>
                  <div className="bg-muted p-2 rounded font-mono">
                    eq, ne, ls, gr
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Control Flow</h4>
                <div className="space-y-1">
                  <div className="bg-muted p-2 rounded font-mono">
                    x -&gt; y | z
                  </div>
                  <div className="bg-muted p-2 rounded font-mono">or, &</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Data Types</h4>
                <div className="space-y-1">
                  <div className="bg-muted p-2 rounded font-mono">
                    (1, 2, 3)
                  </div>
                  <div className="bg-muted p-2 rounded font-mono">'string'</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
