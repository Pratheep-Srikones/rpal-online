"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, Play, Trash2, Code, GitBranch } from "lucide-react"
import { useTheme } from "next-themes"

// Mock RPAL interpreter functions
const parseRPAL = (code: string) => {
  // Simulate AST generation
  if (!code.trim()) return null

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
  }
}

const standardizeTree = (ast: any) => {
  // Simulate ST generation from AST
  if (!ast) return null

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
  }
}

const executeRPAL = (code: string) => {
  // Simulate program execution
  if (!code.trim()) return ""

  // Simple pattern matching for demo
  if (code.includes("let x = 5 in x + 3")) {
    return "8"
  } else if (code.includes("1 + 2")) {
    return "3"
  } else if (code.includes("Print")) {
    return "Hello, RPAL!"
  }

  return "Program executed successfully"
}

const formatTree = (tree: any, indent = 0): string => {
  if (!tree) return ""

  const spaces = "  ".repeat(indent)
  let result = ""

  if (typeof tree === "object") {
    if (tree.type) {
      result += `${spaces}${tree.type}`
      if (tree.name) result += `: ${tree.name}`
      if (tree.value) result += `: ${tree.value}`
      if (tree.operator) result += `: ${tree.operator}`
      if (tree.parameter) result += `: ${tree.parameter}`
      result += "\n"

      Object.keys(tree).forEach((key) => {
        if (key !== "type" && key !== "name" && key !== "value" && key !== "operator" && key !== "parameter") {
          if (Array.isArray(tree[key])) {
            tree[key].forEach((item: any) => {
              result += formatTree(item, indent + 1)
            })
          } else if (typeof tree[key] === "object") {
            result += formatTree(tree[key], indent + 1)
          }
        }
      })
    }
  }

  return result
}

export default function RPALIde() {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [ast, setAst] = useState<any>(null)
  const [st, setSt] = useState<any>(null)
  const [showAst, setShowAst] = useState(false)
  const [showSt, setShowSt] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const { theme, setTheme } = useTheme()

  // Load code from localStorage on component mount
  useEffect(() => {
    const savedCode = localStorage.getItem("rpal-code")
    if (savedCode) {
      setCode(savedCode)
    }
  }, [])

  // Save code to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rpal-code", code)
  }, [code])

  const runProgram = async () => {
    setIsRunning(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      // Parse and execute
      const astResult = parseRPAL(code)
      const stResult = standardizeTree(astResult)
      const executionResult = executeRPAL(code)

      setAst(astResult)
      setSt(stResult)
      setOutput(executionResult)
    } catch (error) {
      setOutput(`Error: ${error}`)
    }

    setIsRunning(false)
  }

  const clearEditor = () => {
    setCode("")
    setOutput("")
    setAst(null)
    setSt(null)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <h1 className="text-2xl font-bold">RPAL IDE</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-4">
        {/* Main Editor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Editor */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your RPAL program here...

Example:
let x = 5 in x + 3

or

Print 'Hello, RPAL!'"
                className="min-h-[300px] font-mono text-sm"
              />

              {/* Control Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={runProgram} disabled={isRunning} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  {isRunning ? "Running..." : "Run"}
                </Button>

                <Button variant="outline" onClick={clearEditor} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center space-x-2">
                  <Checkbox id="show-ast" checked={showAst} onCheckedChange={setShowAst} />
                  <label htmlFor="show-ast" className="text-sm font-medium">
                    Show AST
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="show-st" checked={showSt} onCheckedChange={setShowSt} />
                  <label htmlFor="show-st" className="text-sm font-medium">
                    Show ST
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md min-h-[300px] font-mono text-sm whitespace-pre-wrap">
                {output || "Run your program to see output here..."}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tree Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Abstract Syntax Tree */}
          {showAst && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Abstract Syntax Tree (AST)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md min-h-[200px] font-mono text-sm whitespace-pre-wrap overflow-auto">
                  {ast ? formatTree(ast) : "No AST generated. Run your program first."}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Standardized Tree */}
          {showSt && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Standardized Tree (ST)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md min-h-[200px] font-mono text-sm whitespace-pre-wrap overflow-auto">
                  {st ? formatTree(st) : "No ST generated. Run your program first."}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>RPAL Language Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Basic Syntax:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • Variables: <code className="bg-muted px-1 rounded">let x = 5</code>
                  </li>
                  <li>
                    • Functions: <code className="bg-muted px-1 rounded">fn x =&gt; x + 1</code>
                  </li>
                  <li>
                    • Conditionals: <code className="bg-muted px-1 rounded">x -&gt; y | z</code>
                  </li>
                  <li>
                    • Tuples: <code className="bg-muted px-1 rounded">(1, 2, 3)</code>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Operations:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • Arithmetic: <code className="bg-muted px-1 rounded">+, -, *, /</code>
                  </li>
                  <li>
                    • Comparison: <code className="bg-muted px-1 rounded">eq, ne, ls, gr</code>
                  </li>
                  <li>
                    • Logical: <code className="bg-muted px-1 rounded">or, &</code>
                  </li>
                  <li>
                    • Application: <code className="bg-muted px-1 rounded">f x</code>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
