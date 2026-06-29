"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileContent = exports.spreadData = void 0;
const mammoth_1 = __importDefault(require("mammoth"));
const spreadData = async (req, res, next) => {
    // Initialize result as an array of objects
    const result = [];
    const fullText = req.body?.content || await readFileContent(req, res);
    if (!fullText) {
        next({ status: 404, message: "File content not found." });
        return [];
    }
    // Split blocks based on a number followed by a period and a space at the start of a new line
    // The regex captures the delimiter so we can split by it, but the blocks will still need trimming.
    // We'll stick to the original split pattern for simplicity in existing logic:
    const questionBlock = fullText.split(/\n(?=\d+\.\s)/g);
    questionBlock.forEach(block => {
        const lines = block.trim().split("\n");
        if (lines.length === 0)
            return;
        // 1. Safely extract question number and text
        const firstLineMatch = lines[0]?.match(/^(\d+)\.\s+(.*)/);
        if (!firstLineMatch)
            return;
        const questionNumber = parseInt(firstLineMatch[1], 10);
        // Find the index of the first option line (e.g., A., B., etc.)
        const optionStartIndex = lines.findIndex(line => /^[A-Z]\.\s+/.test(line));
        const questionLines = lines.slice(0, optionStartIndex === -1 ? lines.length : optionStartIndex);
        // Combine the first line's text part and subsequent lines
        const questionTextLines = [firstLineMatch[2], ...questionLines.slice(1)];
        const question = questionTextLines.join(' ').trim();
        // 2. Parse options into an object map, allowing multiline text
        let optionsMap = {};
        let correctAnswer = "";
        let currentOptionKey = null;
        let currentOptionLines = [];
        if (optionStartIndex !== -1) {
            // Process lines starting from the first option
            const answerAndOptionLines = lines.slice(optionStartIndex);
            for (let i = 0; i < answerAndOptionLines.length; i++) {
                const line = answerAndOptionLines[i].trim();
                // Check if the line is a new option (e.g., A., B., C.)
                const optionStartMatch = line.match(/^([A-Z])\.\s*(.*)/);
                // Check if the line is the answer key
                const answerMatch = line.match(/^ANSWER:\s*([A-Z])/i);
                if (optionStartMatch) {
                    // Start of a NEW option
                    // 1. Finalize the PREVIOUS option (if one was being collected)
                    if (currentOptionKey && currentOptionLines.length > 0) {
                        optionsMap[currentOptionKey] = currentOptionLines.join(' ').trim();
                    }
                    // 2. Start collecting the NEW option
                    currentOptionKey = optionStartMatch[1];
                    // Initialize with the text that immediately followed the option key
                    currentOptionLines = [optionStartMatch[2].trim()];
                }
                else if (answerMatch) {
                    // Found the answer line
                    // 1. Finalize the LAST collected option
                    if (currentOptionKey && currentOptionLines.length > 0) {
                        optionsMap[currentOptionKey] = currentOptionLines.join(' ').trim();
                    }
                    // 2. Record the correct answer and stop parsing
                    correctAnswer = answerMatch[1] || "";
                    break; // Exit the loop as options and answer should be complete
                }
                else if (currentOptionKey && line) {
                    // This line does NOT start a new option, is NOT an answer, and is NOT empty.
                    // It must be a continuation of the current option text.
                    currentOptionLines.push(line);
                }
            }
            // Final check: If the loop finished without hitting an ANSWER line,
            // the very last option still needs to be saved.
            if (currentOptionKey && currentOptionLines.length > 0 && !correctAnswer) {
                optionsMap[currentOptionKey] = currentOptionLines.join(' ').trim();
            }
        }
        // Final validation and pushing to the result array
        if (question && Object.keys(optionsMap).length > 0) {
            result.push({
                questionNumber,
                question,
                options: optionsMap,
                correctAnswer,
            });
        }
    });
    return result;
};
exports.spreadData = spreadData;
const readFileContent = async (req, res) => {
    const filePath = req.file?.path;
    if (!filePath) {
        res.status(400).json({ message: "Can't find the file. Please upload the intended file." });
        return "";
    }
    try {
        const result = await mammoth_1.default.extractRawText({ path: filePath });
        return result.value;
    }
    catch (error) {
        res.status(500).json({ message: "Error reading file content." });
        return "";
    }
    return "";
};
exports.readFileContent = readFileContent;
//# sourceMappingURL=fileManager.js.map