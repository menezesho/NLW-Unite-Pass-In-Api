import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'

const app = fastify()

const prisma = new PrismaClient({
    log: ['query']
})

app.post('/events', async (request, response) => {
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
    })

    const data = createEventSchema.parse(request.body)

    const event = await prisma.event.create({
        data:{
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttendees,
            slug: new Date().toISOString(),
        }
    })

    return { eventId: event.id}
})

app.listen({
    port: 5500
}).then(() => {
    console.log('Server is running on port 5500')
})