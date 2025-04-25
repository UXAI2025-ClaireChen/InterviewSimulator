/**
 * Base configuration for OpenAI API
 */
const API_BASE_URL = 'https://api.openai.com/v1';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

/**
 * Create headers with API key
 * @returns {Object} Headers for OpenAI API
 */
const createHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`
});

/**
 * Transcribe audio using Whisper API
 * @param {Blob} audioBlob - Audio recording blob
 * @returns {Promise<string>} Transcribed text
 */
export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    formData.append('model', 'whisper-1');
    
    const response = await fetch(`${API_BASE_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

/**
 * Analyze interview response using GPT
 * @param {string} question - Interview question
 * @param {string} answer - Candidate's answer
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeResponse = async (question, answer) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: `You are an expert interviewer and coach. Analyze the following interview response using the STAR method.
            Your analysis should include:
            1. Overall score (out of 100)
            2. Score and feedback for each component (each out of 100): Situation, Task, Action, Result
            3. Additional metrics (each out of 100): Relevance, Clarity, Structure
            4. General feedback and improvement suggestions.
            Return your analysis in JSON format with the structure:
            {
              "overallScore": number,
              "categories": {
                "situation": { "score": number, "feedback": string },
                "task": { "score": number, "feedback": string },
                "action": { "score": number, "feedback": string },
                "result": { "score": number, "feedback": string }
              },
              "additionalMetrics": {
                "relevance": { "score": number, "feedback": string },
                "clarity": { "score": number, "feedback": string },
                "structure": { "score": number, "feedback": string }
              },
              "generalFeedback": string,
              "improvementSuggestions": [string, string, string]
            }`
          },
          {
            role: "user", 
            content: `Interview Question: ${question}\n\nCandidate's Response: ${answer}`
          }
        ],
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing response:', error);
    throw error;
  }
};

/**
 * Fetch interview questions for a specific topic
 * @param {string} topic - Topic for questions
 * @returns {Promise<string[]>} Array of questions
 */
export const fetchQuestions = async (topic) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert interviewer. Generate behavioral interview questions for the STAR method (Situation, Task, Action, Result) related to the topic: ${topic}.`
          },
          {
            role: "user", 
            content: `Generate 5 behavioral interview questions for the topic "${topic}" that are ideal for the STAR method. \
                      Each question should be a single concise sentence, without additional sub-questions or guidance. \
                      Return only the questions as a simple JSON array of strings.`
          }
        ],
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    // Parse the JSON content from the API response
    return parseQuestionsResponse(data.choices[0].message.content);
  } catch (error) {
    console.error(`Error fetching questions for ${topic}:`, error);
    throw error;
  }
};

/**
 * Generate avatar image using DALL-E
 * @returns {Promise<string>} Image URL
 */
export const generatePersonImage = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({
        model: "dall-e-2",
        prompt: "Professional headshot portrait of a person in business casual attire with neutral background, looking friendly and approachable. Diverse appearance, high quality, photorealistic.",
        n: 1,
        size: "512x512"
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Error generating person image:', error);
    throw error;
  }
};

/**
 * Helper to parse questions from API response
 * @param {string} content - API response content
 * @returns {string[]} Parsed questions array
 */
function parseQuestionsResponse(content) {
  try {
    // Try to parse as JSON
    const jsonContent = JSON.parse(content);
    
    // Check for different response formats
    if (Array.isArray(jsonContent)) {
      return jsonContent;
    } else if (jsonContent.questions && Array.isArray(jsonContent.questions)) {
      return jsonContent.questions;
    } else {
      // Try to extract any array property
      const arrayProps = Object.keys(jsonContent).filter(key => 
        Array.isArray(jsonContent[key]) && jsonContent[key].length > 0);
      
      if (arrayProps.length > 0) {
        return jsonContent[arrayProps[0]];
      } else {
        // Look for string properties
        const stringProps = Object.keys(jsonContent).filter(key => 
          typeof jsonContent[key] === 'string' && jsonContent[key].trim().length > 10);
        
        if (stringProps.length > 0) {
          return stringProps.map(key => jsonContent[key]);
        }
      }
    }
    
    // If we get here, try to parse the content directly
    if (content && typeof content === 'string' && content.length > 10) {
      if (content.includes('\n') || (content.split('.').length > 3)) {
        return content
          .split(/\n+|(?<=\.)(?=\s*[A-Z])/)
          .filter(q => q.trim().length > 15)
          .slice(0, 5);
      } else {
        return [content];
      }
    }
    
    throw new Error('Could not extract valid questions');
  } catch (error) {
    console.error('Error parsing questions:', error);
    throw error;
  }
}