const express = require("express");
const cors = require("cors");
const { spawnSync } = require('child_process');

const app = express();
const PORT = 10000;

app.use(cors());
app.use(express.json());

function compileCpp(code, input) {
  try {
    console.log('Compiling C++ code...');
    console.log('Code:', code);
    console.log('Input:', input);

    const compileResult = spawnSync(
      'g++',
      ['-x', 'c++', '-o', 'myprogram', '-'],
      {
        input: code,
        encoding: 'utf-8',
      }
    );

    if (compileResult.status !== 0) {
      throw new Error('Compilation error');
    }

    console.log('C++ code compiled successfully');

    const filePath = './myprogram';
    const executionResult = spawnSync(filePath, {
      input: input,
      encoding: 'utf-8',
    });

    if (executionResult.error) {
      throw new Error('Execution error');
    }

    console.log('Program executed successfully');

    return { programOutput: executionResult.stdout };
  } catch (error) {
    console.error('Error:', error);
    return { error: error.message };
  }
}

function compileJS(code, input) {
  try {
    console.log('Executing JavaScript code...');
    console.log('Code:', code);
    console.log('Input:', input);

    const jsResult = spawnSync('node', ['-e', code], {
      input: input,
      encoding: 'utf-8',
    });

    console.log('JavaScript code executed successfully');

    return { programOutput: jsResult.stdout };
  } catch (error) {
    console.error('Error:', error);
    return { error: error.message };
  }
}

function compileC(code, input) {
  try {
    console.log('Compiling C code...');
    console.log('Code:', code);
    console.log('Input:', input);

    const compileResult = spawnSync(
      'gcc',
      ['-x', 'c', '-o', 'myprogram', '-'],
      {
        input: code,
        encoding: 'utf-8',
      }
    );

    if (compileResult.status !== 0) {
      throw new Error('Compilation error');
    }

    console.log('C code compiled successfully');

    const filePath = './myprogram';
    const executionResult = spawnSync(filePath, {
      input: input,
      encoding: 'utf-8',
    });

    if (executionResult.error) {
      throw new Error('Execution error');
    }

    console.log('Program executed successfully');

    return { programOutput: executionResult.stdout };
  } catch (error) {
    console.error('Error:', error);
    return { error: error.message };
  }
}

app.post("/compile", async (req, res) => {
    try {
        // Getting the required data from the request
        let code = req.body.code;
        let language = req.body.language;
        let input = req.body.input;

        // Compile code based on the selected language
        let compileResult;
        switch (language) {
            case 'cpp':
                compileResult = compileCpp(code, input);
                break;
            
            case 'c':
                compileResult = compileC(code, input);
                break;
            case 'javascript':
                compileResult = compileJS(code, input); // Add this case for JavaScript
                break;
            default:
                compileResult = { error: 'Unsupported language' };
                break;
        }

        // Handle compilation result
        if (compileResult.error) {
            throw new Error(compileResult.error);
        } else {
            res.status(200).json(compileResult);
        }
    } catch (error) {
        // Handle error
        console.error("Error during code compilation:", error.message);
        res.status(500).json({ error: "Error during code compilation" });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
