import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";
dotenv.config();

const mistral = new Mistral({
  apiKey: process.env["MISTRAL_API_KEY"] ?? "",
});


function formatRegex(regexPattern, key) {
  // Remove any leading/trailing spaces, quotes, and the word 'regex'
  regexPattern = regexPattern.trim().replace(/^["']|["']$/g, '').replace(/^regex/i, '');
  // Remove any leading ^ or trailing $
  regexPattern = regexPattern.replace(/^\^|\$$/g, '');
  // Remove word boundaries
  regexPattern = regexPattern.replace(/\\b/g, '');
  // Ensure character classes are properly formatted
  regexPattern = regexPattern.replace(/\[([^\]]+)\]/g, (match, p1) => {
    return '[' + p1.replace(/\./g, '\\.') + ']';
  });
  // Escape dots outside of character classes
  regexPattern = regexPattern.replace(/(?<!\[)\.(?![^\[]*\])/g, '\\.');
  
  // Handle specific cases
  if (key.toLowerCase() === 'ssn') {
    regexPattern = regexPattern.replace(/\\d{3}[- ]?\\d{2}[- ]?\\d{4}/, '\\d{3}-\\d{2}-\\d{4}');
  } else if (key.toLowerCase() === 'email') {
    regexPattern = '[\\w\\d\\.-]+@[\\w\\d\\.-]+';
  } else if (key.toLowerCase() === 'credit card') {
    regexPattern = '\\b(?:\\d[ -]*?){13,16}\\b';
  } else if (key.toLowerCase() === 'ip address') {
    regexPattern = '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b';
  } else if (key.toLowerCase() === 'phone') {
    regexPattern = '\\b(?:\\(?\\d{3}\\)?[-.\\s]?|\\d{3}[-.\\s]?)\\d{3}[-.\\s]?\\d{4}\\b';
  } else if (key.toLowerCase() === 'password') {
    regexPattern = '\\bpassword\\s*[:=]\\s*\\S+\\b';
  } else if (key.toLowerCase() === 'cvv') {
    regexPattern = '\\b\\d{3,4}\\b';
  } else if (key.toLowerCase() === 'address') {
    regexPattern = '\\d+\\s[A-Za-z]+\\s[A-Za-z]+';
  } else if (key.toLowerCase() === 'url') {
    regexPattern = '\\bhttps?:\\/\\/[^\\s/$.?#].[^\\s]*\\b';
  } else if (key.toLowerCase() === 'mac address') {
    regexPattern = '\\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\\b';
  }
  
  // Remove any double backslashes
  regexPattern = regexPattern.replace(/\\\\/g, '\\');
  return regexPattern;
}

async function autoPopulateS(key) {
  const message = `Generate a regex pattern for identifying ${key} in text. Provide only the regex pattern, nothing else. Use common formats and conventions for ${key}.`;
  
  try {
    // Call Mistral API
    const result = await mistral.chat.stream({
      model: "mistral-small-latest",
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
          try {
            const parsedData = JSON.parse(chunkData);
            const content = parsedData?.choices?.[0]?.delta?.content || '';
            regexPattern += content;
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }
        });
      }
    }
    
    // Ensure regexPattern is valid and cleaned
    if (!regexPattern) {
      throw new Error("Mistral API did not return a valid regex pattern");
    }
    return formatRegex(regexPattern, key);
  } catch (error) {
    console.error('Error calling Mistral API:', error);
    return null;
  }
}

export default autoPopulateS;