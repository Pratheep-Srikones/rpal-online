from Interpreter.Tokenizer.tokenizer import tokenize
from Interpreter.Parser.parser import Parser
from Interpreter.Parser.standardizer import StandardizeAST
from Interpreter.CSE.generateCS import CSGenerator
from Interpreter.Environment.Environment import Environment
from Interpreter.CSE.CSEMachine import CSEMachine
import copy

# Predefined primitive environment variables for the interpreter
PRIMITIVE_ENVIRONMENT_VARIABLES = {
    "Print": "print",
    "nil": "nil",
    "Y": "Y",
    "print": "print",
    "Conc": "conc",
    "Stem": "stem",
    "Stern": "stern",
    "Isinteger": "isInteger",
    "Isstring": "isString",
    "Istruthvalue": "isTruthValue",
    "Isfunction": "isFunction",
    "Istuple": "isTuple",
    "Isdummy": "isDummy",
    "Order": "order",
    "Null": "null",
}

"""
Main entry for the program. Handles command-line args, reads the input file, and tokenizes its contents.

Usage:
    python myrpal.py <file_path>
    python myrpal.py -ast <file_path>

Args:
    <file_path>: Path to input file.
    -ast: (Optional) Print AST.

Behavior:
    - Validates arguments.
    - Reads and prints file lines.
    - Tokenizes lines into a list.
    - Parses tokens into an abstract syntax tree (AST).
    - Standardizes the AST.
    - Generates control structures from the AST.
    - Initializes the primitive environment.
    - Creates and runs the CSE machine interpreter.
    - Handles errors gracefully.
"""

def interpret(code,sendAST=False, sendST=False):
    """
    Main function to handle command-line arguments, file reading, tokenization,
    parsing, AST standardization, control structure generation, and interpretation.
    """

    res = {"resAST": None, "resST": None, "resOut": None}
    if not code:
        raise ValueError("No code provided for interpretation.")

    
 

    # Read the input file and process its contents
    try:
        # Tokenize the input lines
        code_list = code.splitlines()
        tokens = tokenize(code_list)
        print(f"Tokens: {[str(token) for token in tokens]}")  # Debugging output
        # Parse tokens into an AST
        par = Parser(tokens)
        ast = par.E()
        if sendAST:
            res["resAST"] = copy.deepcopy(ast)

        # Optionally print the AST if requested
            #sys.exit(0) # -ast.  This switch prints the abstract syntax tree, and nothing else.
            

        # Standardize the AST for further processing
        StandardizeAST().standardize(ast)
        if sendST:
            res["resST"] = ast
        # Generate control structures from the standardized AST
        csGenerator = CSGenerator()
        controlStructures = csGenerator.generate(ast)

        # Initialize the primitive environment
        primitiveEnvironment = Environment(0, variables=PRIMITIVE_ENVIRONMENT_VARIABLES)
        # Create and run the CSE machine interpreter
        machine = CSEMachine(controlStructures, primitiveEnvironment)
        output = machine.interpret()
        res["resOut"] = output
        return res

    except Exception as e:
        raise Exception(e) from e
            