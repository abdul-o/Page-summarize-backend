export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'No text provided' })
    }

    // ✅ Trim text (important for API stability)
    const trimmedText = text.slice(0, 3000)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Summarize this webpage into:
- Clear bullet points
- Key insights
- Short sentences

Content:
${trimmedText}
`
                }
              ]
            }
          ]
        })
      }
    )

    const data = await response.json()
    console.log("FULL GEMINI RESPONSE:", data)

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No summary generated'

    return res.status(200).json({ summary })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}