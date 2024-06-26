const { spawnSync } = require('child_process');
const fs = require('fs');

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

module.exports = { compileCpp,  compileC, compileJS };
