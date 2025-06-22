#!/usr/bin/env node

import fs from 'fs';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error('OPENROUTER_API_KEY environment variable is required');
  process.exit(1);
}

async function callOpenRouterAPI() {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{
        role: 'user',
        content: 'Generate a random number between 1 and 100. Only respond with the number, nothing else.'
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function main() {
  console.log('Calling OpenRouter API 100 times for random numbers...');
  
  const numbers = [];

  for (let i = 1; i <= 100; i++) {
    try {
      console.log(`Iteration ${i}/100...`);
      const randomNumber = await callOpenRouterAPI();
      numbers.push(randomNumber);
      
      console.log(`Got random number: ${randomNumber}`);
      
      // Add 2 minute delay after every 25 requests
      if (i % 25 === 0 && i < 100) {
        console.log(`Reached ${i} requests. Waiting 2 minutes to respect rate limits...`);
        await new Promise(resolve => setTimeout(resolve, 120000)); // 2 minutes
      } else {
        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error(`Error in iteration ${i}:`, error.message);
    }
  }
  
  // Save all numbers to one file, separated by commas
  const filename = 'random_numbers.txt';
  
  let content = numbers.join(',');
  
  // If file exists, append new numbers to existing content
  if (fs.existsSync(filename)) {
    const existingContent = fs.readFileSync(filename, 'utf8');
    content = existingContent + ',' + content;
  }
  
  fs.writeFileSync(filename, content);
  
  console.log(`Saved ${numbers.length} new numbers to ${filename}: ${numbers.join(',')}`);
}

main().catch(console.error);