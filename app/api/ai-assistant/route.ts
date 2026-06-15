import { streamText, convertToModelMessages } from 'ai'
import { groq } from '@ai-sdk/groq'
import { opportunities, courses } from '@/lib/data'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, profile } = await req.json()

  const opportunitiesSummary = opportunities
    .map(
      (op) =>
        `• "${op.title}" (${op.organization}) — категория: ${op.category}, формат: ${op.format}, классы: ${op.grades.join(', ')}, теги: ${op.tags.join(', ')}, дедлайн: ${op.deadline}`
    )
    .join('\n')

  const coursesSummary = courses
    .map(
      (c) =>
        `• "${c.title}" (${c.instructor}) — категория: ${c.category}, сложность: ${c.difficulty}, классы: ${c.grades.join(', ')}, теги: ${c.tags.join(', ')}`
    )
    .join('\n')

  const systemPrompt = `Ты — Mentoria AI, умный персональный ассистент образовательной платформы Mentoria Hub для казахстанских школьников. Ты общаешься по-русски, дружелюбно и поддерживающе.

ПРОФИЛЬ УЧЕНИКА:
- Имя: ${profile?.name || 'Ученик'}
- Класс: ${profile?.grade || 'не указан'}
- Интересы: ${profile?.interests?.join(', ') || 'не указаны'}
- Цели: ${profile?.goals?.join(', ') || 'не указаны'}

ДОСТУПНЫЕ ВОЗМОЖНОСТИ НА ПЛАТФОРМЕ:
${opportunitiesSummary}

ДОСТУПНЫЕ КУРСЫ НА ПЛАТФОРМЕ:
${coursesSummary}

ТВОИ ЗАДАЧИ:
1. Рекомендуй конкретные возможности и курсы из списка выше, учитывая класс, интересы и цели ученика.
2. Объясняй, ПОЧЕМУ ты рекомендуешь именно эту возможность/курс — свяжи с интересами и целями.
3. Давай советы по подготовке и поступлению.
4. Отвечай кратко, структурированно, используй маркированные списки когда уместно.
5. Будь мотивирующим и позитивным, но реалистичным.
6. Если ученик спрашивает что-то вне образования, мягко направь разговор обратно к учёбе и возможностям.
7. Отвечай на русском языке, если ученик не пишет на казахском или английском.

Не выдумывай возможности или курсы, которых нет в списке выше. Если что-то не знаешь — скажи честно.`

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}