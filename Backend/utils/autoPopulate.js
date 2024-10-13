import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";
dotenv.config();

const mistral = new Mistral({
  apiKey: process.env["MISTRAL_API_KEY"] ?? "",
});

const highPriorityPatterns = {
  emailAddress: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
  phonenumber: "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b",  
  ssn: "\\b(?!000|666|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0000)\\d{4}\\b"
};

function formatRegex(regexPattern) {
  regexPattern = regexPattern.replace(/\\b/g, '').trim();  // Remove boundaries temporarily
  regexPattern = regexPattern.replace(/\\d/g, '[0-9]');    // Replace \d with [0-9]
  regexPattern = regexPattern.replace(/^\^|\$$/g, '');     // Remove leading ^ or trailing $
  return `\\b${regexPattern}\\b`;                          // Add back word boundaries
}

// Function to clean and strip quotes from generated regex
function cleanRegexPattern(pattern) {
  return pattern.replace(/["']/g, '');  // Remove any quotes
}

// Function to validate the regex output for known patterns
function validatePattern(key, generatedPattern) {
  return highPriorityPatterns[key] === generatedPattern;
}

async function autoPopulate(key) {
  if (highPriorityPatterns[key]) {
    return highPriorityPatterns[key];
  }

  const message = `Generate a comprehensive and accurate regex pattern for identifying ${key} in text. The pattern should be as precise as possible, considering various formats and edge cases. Use [0-9] instead of \\d. Respond with only the regex pattern, nothing else.`;

  try {
    const result = await mistral.chat.stream({
      model: "mistral-small-2402",
      messages: [
        {
          content: message,
          role: "user",
        },
      ],
    });

    let regexPattern = "";
    const reader = result.stream.getReader();
    let done, value;

    while (!done) {
      const chunk = await reader.read();
      done = chunk.done;
      value = chunk.value;

      if (value) {
        const decodedChunk = new TextDecoder().decode(value);
        const parsedChunk = decodedChunk.split('data: ').filter(Boolean);

        parsedChunk.forEach(chunkData => {
          const parsedData = JSON.parse(chunkData);
          const content = parsedData?.choices?.[0]?.delta?.content || '';
          regexPattern += content;
        });
      }
    }

    if (!regexPattern) {
      throw new Error("Mistral API did not return a valid regex pattern");
    }

    const cleanedPattern = cleanRegexPattern(regexPattern);
    const formattedPattern = formatRegex(cleanedPattern);

    // If the key is high-priority, validate the generated pattern
    if (highPriorityPatterns[key] && !validatePattern(key, formattedPattern)) {
      throw new Error(`Generated pattern for ${key} did not match the high-priority pattern`);
    }

    return formattedPattern;
  } catch (error) {
    console.error('Error calling Mistral API:', error);
    return { error: 'Failed to get response from Mistral', details: error.message };
  }
}

export default autoPopulate;
