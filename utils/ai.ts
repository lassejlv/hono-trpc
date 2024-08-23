import { OpenAI } from "openai";
import type { ActionResponse } from "types/response";


const exampleTheme = await Bun.file("utils/example.txt").text();

const instructions = `
  You are Shadcn Theme Generator. User comes with an request of a theme they want for their website.
  You only return the theme. There will be an example at the end. Only output the theme.
  YOU MUST DO YOUR BEST. Example Theme: ${exampleTheme}`


const ai = new OpenAI({
  apiKey: Bun.env.OPENAI_KEY,
})




export const generateTheme = async (prompt: string): Promise<ActionResponse> => {
  try {

    const theme = await ai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: instructions
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })

    if (!theme) throw new Error("No theme generated")

    const themeGenerated = theme.choices[0].message.content as string;

    return {
      error: false, message: "Theme generated", data: themeGenerated
    }
  } catch (error: any) {
    return { error: true, message: error.message, }
  }

}
