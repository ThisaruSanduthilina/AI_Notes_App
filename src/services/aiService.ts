import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const aiService = {
  async summarizeText(text: string): Promise<string> {
    try {
      if (text.length < 100) {
        return 'Text too short for summarization';
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise, meaningful summaries of text. Keep summaries under 150 words and focus on key points.'
          },
          {
            role: 'user',
            content: `Please summarize the following text:\n\n${text}`
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || 'Unable to generate summary';
    } catch (error) {
      console.error('Error summarizing text:', error);
      return 'Error generating summary';
    }
  },

  async generateSmartReminder(noteContent: string, noteTitle: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a smart assistant that creates helpful reminder messages based on note content. Create concise, actionable reminder text that helps the user remember the key points or actions from their note.'
          },
          {
            role: 'user',
            content: `Based on this note titled "${noteTitle}" with content: "${noteContent}", create a helpful reminder message (keep it under 100 words).`
          }
        ],
        max_tokens: 150,
        temperature: 0.5,
      });

      return response.choices[0]?.message?.content || 'Review your note: ' + noteTitle;
    } catch (error) {
      console.error('Error generating reminder:', error);
      return 'Review your note: ' + noteTitle;
    }
  },

  async enhanceText(text: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a writing assistant that improves text clarity, grammar, and structure while maintaining the original meaning and tone. Make minimal changes and preserve the author\'s voice.'
          },
          {
            role: 'user',
            content: `Please enhance this text for clarity and readability:\n\n${text}`
          }
        ],
        max_tokens: Math.min(text.length * 2, 1000),
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('Error enhancing text:', error);
      return text;
    }
  },

  async extractTags(text: string): Promise<string[]> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Extract 3-5 relevant tags from the given text. Return only the tags as a comma-separated list, no other text. Focus on key topics, themes, or categories.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 100,
        temperature: 0.2,
      });

      const tagsString = response.choices[0]?.message?.content || '';
      return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } catch (error) {
      console.error('Error extracting tags:', error);
      return [];
    }
  }
};