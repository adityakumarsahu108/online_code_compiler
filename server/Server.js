const express = require("express");
const cors = require("cors");
const { compileCpp,  compileC, compileJS } = require("./CompilerFunctions"); // Import compilation functions
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

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
