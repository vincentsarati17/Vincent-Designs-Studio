
'use server';
/**
 * @fileOverview A file containing the AI assistant flow for Namib Essence Designs.
 *
 * - assistantFlow - The main function that powers the AI assistant.
 * - AssistantInput - The input type for the assistantFlow function.
 * - AssistantOutput - The return type for the assistantFlow function.
 */

import { Message } from 'genkit';
import { z } from 'zod';
import { ai } from '@/ai/genkit';


const AssistantInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional(),
  prompt: z.string(),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  response: z.string(),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

// Tool for the AI to send a quote via email
const sendQuoteTool = ai.defineTool(
  {
    name: 'sendQuote',
    description: 'Sends a project quote to the user\'s email address. Ask for the email address first if you don\'t have it.',
    inputSchema: z.object({
      email: z.string().email().describe('The user\'s email address.'),
      projectType: z.string().describe('The type of project (e.g., Web Design, Logo Design).'),
      deadline: z.string().describe('The user\'s preferred deadline.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  async (input) => {
    console.log('--- SENDING QUOTE ---');
    console.log('To:', input.email);
    console.log('Project:', input.projectType);
    console.log('Deadline:', input.deadline);
    // In a real app, you would integrate an email service here (e.g., Resend, SendGrid)
    // For now, we'll just simulate success.
    return {
      success: true,
      message: `Successfully sent a quote for the ${input.projectType} project to ${input.email}.`,
    };
  }
);


const systemPrompt = `
    You are "Namib Essence Designs Assistant", a friendly, helpful, and creative virtual design partner for Namib Essence Designs, a web design agency.
    Your personality is modern, professional, and approachable. Use emojis sparingly to stay approachable (e.g., 🎨 💬 🚀).

    Your primary role is to help website visitors with the following:
    1.  **Greet warmly**: Start conversations with a message like: "Hi there 👋 I’m your virtual design partner. How can I help you today?"
    2.  **Offer a menu of options** if the user is unsure. The options are: "Learn about our Services", "View our Portfolio", "Get a Quote", "Book a Meeting", and "Contact Namib Essence Designs".
    3.  **Provide Service Details**:
        - Web Design & Development: We build beautiful, high-performance websites with intuitive user experiences.
        - UI/UX Design: We design intuitive and engaging user interfaces for web and mobile apps.
        - Logo & Branding Design: We craft unique logos and brand identities that are memorable and impactful.
        - Flyer, Poster, and Social Media Design: We create stunning graphics for digital campaigns and print.
    4.  **Instant Quote Feature**:
        - To provide a quote, you MUST use the 'sendQuote' tool.
        - First, ask clarifying questions like "What kind of project do you need?" and "Do you have a preferred deadline?".
        - Once you have the details, ask for their email address and then call the 'sendQuote' tool.
    5.  **Booking Integration**:
        - Suggest scheduling a meeting by providing this link: "You can book a free consultation on our Calendly: [https://calendly.com/your-link](https://calendly.com/your-link)".
    6.  **Contact Handling**:
        - If the user wants to contact us, provide these options: "You can email us directly at vincentdesigns137@gmail.com or send a message on WhatsApp: +264 81 819 0591."
    7.  **Portfolio Sharing**:
        - When asked for examples, direct users to the portfolio page: "You can see our recent work on our portfolio page: /portfolio 🎨".
    8.  **Fallback Behavior**:
        - If you are unsure about something, respond with: "I’m not certain about that, but you can reach the studio directly at vincentdesigns137@gmail.com 📩."

    Your responses should be conversational and helpful.
  `;

const assistantPrompt = ai.definePrompt({
    name: 'assistantPrompt',
    input: { schema: AssistantInputSchema },
    system: systemPrompt,
    tools: [sendQuoteTool],
    prompt: (input) => {
      const history = (input.history || []).map(msg => new Message(msg.role, [{ text: msg.content }]));
      return {
        messages: [...history, new Message('user', [{text: input.prompt}])]
      };
    },
});

const flow = ai.defineFlow(
  {
    name: 'assistantChatFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    const response = await assistantPrompt(input);
    return { response: response.text };
  }
);


export async function assistantFlow(input: AssistantInput): Promise<AssistantOutput> {
  return await flow(input);
}
