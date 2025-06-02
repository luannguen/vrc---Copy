import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { seedForms } from '../seed/forms.js'

const runFormsSeed = async () => {
  try {
    console.log('🌱 Initializing Payload for forms seeding...')

    const payload = await getPayload({
      config,
    })

    console.log('🌱 Payload initialized successfully')
    console.log('🌱 Starting forms seeding...')

    await seedForms(payload)

    console.log('🎉 Forms seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during forms seeding:', error)
    process.exit(1)
  }
}

runFormsSeed()
