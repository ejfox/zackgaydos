import { serverSupabaseClient } from '#supabase/server'
import { H3Event } from 'h3'
import twilio from 'twilio'
import {
  defineEventHandler,
  getHeaders,
  createError,
  readBody,
  readRawBody,
  setHeader
} from 'h3'

// Get these from your environment variables
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get the raw body and headers for validation
    const body = await readRawBody(event)
    const headers = getHeaders(event)

    // Validate the request is actually from Twilio
    const twilioSignature = headers['x-twilio-signature']
    const url = `${headers.origin}${event.path}` // Full URL of your webhook

    const validator = twilio.validateRequest(
      TWILIO_AUTH_TOKEN,
      twilioSignature,
      url,
      body
    )

    if (!validator) {
      throw createError({
        statusCode: 403,
        message: 'Invalid Twilio signature'
      })
    }

    // Parse the form data from Twilio
    const formData = await readBody(event)

    // Extract the message content from Twilio's webhook
    const { Body: messageContent, From: phoneNumber } = formData

    // Get Supabase client
    const client = await serverSupabaseClient(event)

    // Insert the new post into Supabase
    const { data, error } = await client
      .from('zackposts')
      .insert([
        {
          content: messageContent,
          phone_number: phoneNumber,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      throw error
    }

    // Return success response in TwiML format
    setHeader(event, 'Content-Type', 'text/xml')
    return `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`
  } catch (error) {
    console.error('Error processing SMS:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process SMS'
    })
  }
})
