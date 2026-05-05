import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()



const app = express()

app.use(cors())
app.use(express.json())


app.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                  text: `Summarize this webpage into clear bullet points:\n\n${text}`
                }
              ]
            }
          ]
        })
      }
    )

    const data = await response.json()




    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No summary generated'

    res.json({ summary })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
})


// app.post('/summarize', async (req, res) => {
//   try {
//     const { text } = req.body

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: 'gpt-4o-mini',
//         messages: [
//           {
//             role: 'system',
//             content: 'Summarize the text into bullet points'
//           },
//           {
//             role: 'user',
//             content: text
//           }
//         ]
//       })
//     })

//     const data = await response.json()

//     const summary = data.choices?.[0]?.message?.content || 'No summary'

//     res.json({ summary })

//   } catch (error) {
//     res.status(500).json({ error: 'Something went wrong' })
//   }
// })

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})