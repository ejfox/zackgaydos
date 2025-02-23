import { serverSupabaseClient } from '#supabase/server'
import { H3Event } from 'h3'
import { defineEventHandler, readBody, createError } from 'h3'

// Define our database types
interface Post {
  id: string
  content: string
  phone_number: string
  created_at: string
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Parse the incoming message
    const { Body: messageContent, From: phoneNumber } = await readBody(event)

    // Get Supabase client
    const client = await serverSupabaseClient<{ zackposts: Post }>(event)

    // Insert the new post into Supabase
    const { data, error } = await client
      .from('zackposts')
      .insert({
        content: messageContent,
        phone_number: phoneNumber,
        created_at: new Date().toISOString()
      } as Partial<Post>)
      .select()

    if (error) {
      throw error
    }

    // Return simple success response
    return { success: true }
  } catch (error) {
    console.error('Error processing message:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process message'
    })
  }
})
