import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { executeCodeInSandbox } from '../utils/executeCodeInSandbox.js';

const executeCode = asyncHandler(async (req, res) => {
  const { language, code } = req.body;

  if (!code || !language) {
    throw new ApiError(400, 'Code and language are required');
  }

  try {
    const output = await executeCodeInSandbox(code, language);
    return res.status(200).json(new ApiResponse(200, { output }, 'Code executed successfully'));
  } catch (err) {
    console.error('Execution error:', err);
    return res.status(200).json(new ApiResponse(200, { output: err }, 'Code execution failed'));
  }
});

export { executeCode };
