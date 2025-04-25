/**
 * Avatar Generator Tool - Generate interviewer avatars using OpenAI DALL-E API and save to local folder
 * Usage: Set your OpenAI API key and run node generateAvatars.js
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);

// Configuration
const config = {
  // Place your OpenAI API key here or use environment variable
  apiKey: 'MY_API_KEY',
  
  // Number of avatars to generate
  numberOfAvatars: 10,
  
  // Save directory
  outputDir: path.join(__dirname, '../public/avatars'),
  
  // DALL-E prompts
  prompts: [
    "Professional portrait from waist up of a person (male, female, or non-binary), average build, in business casual attire, centered composition, camera pulled back with full head and shoulders visible, ample space above the head, neutral background, looking friendly and approachable. High quality, photorealistic."
  ]
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
  console.log(`Created output directory: ${config.outputDir}`);
}

/**
 * Generate an avatar and save it locally
 * @param {number} index - Avatar index number
 * @returns {Promise<string>} Saved file path
 */
async function generateAndSaveAvatar(index) {
  // Randomly select a prompt from the list
  const randomPrompt = config.prompts[Math.floor(Math.random() * config.prompts.length)];
  
  try {
    console.log(`Generating avatar ${index + 1}/${config.numberOfAvatars}...`);
    
    // Call DALL-E API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-2",
        prompt: randomPrompt,
        n: 1,
        size: "1024x1024"
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    // Save the image
    const filename = `avatar-${index + 1}.jpg`;
    const filePath = path.join(config.outputDir, filename);
    await streamPipeline(imageResponse.body, createWriteStream(filePath));
    
    console.log(`✅ Avatar ${index + 1} saved as ${filename}`);
    return filename;
  } catch (error) {
    console.error(`❌ Failed to generate avatar ${index + 1}:`, error.message);
    throw error;
  }
}

/**
 * Main function - Generate all avatars and update JSON file
 */
async function main() {
  console.log(`Starting generation of ${config.numberOfAvatars} avatars...`);
  console.log(`Output directory: ${config.outputDir}`);
  
  const avatarFilenames = [];
  
  // Generate all avatars
  for (let i = 0; i < config.numberOfAvatars; i++) {
    try {
      const filename = await generateAndSaveAvatar(i);
      avatarFilenames.push(filename);
    } catch (error) {
      console.error(`Skipping avatar ${i + 1} and continuing...`);
    }
  }
  
  // Update JSON file
  if (avatarFilenames.length > 0) {
    const jsonPath = path.join(config.outputDir, 'avatars.json');
    fs.writeFileSync(jsonPath, JSON.stringify({ avatars: avatarFilenames }, null, 2));
    console.log(`✅ Updated avatars.json file with ${avatarFilenames.length} avatars`);
  } else {
    console.error('❌ No avatars were successfully generated');
  }
  
  console.log('Complete!');
}

// Run the program
main().catch(error => {
  console.error('Program execution error:', error);
  process.exit(1);
});