import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

async function seedAdditionalPosts() {
  try {
    console.log('🌱 Starting to seed additional posts...')

    const payload = await getPayloadHMR({ config: configPromise })

    // Check current posts count
    const existingPosts = await payload.find({
      collection: 'posts',
      limit: 100,
    })

    console.log(`📊 Found ${existingPosts.docs.length} existing posts`)

    // Sample posts data for VRC
    const newPosts = [
      {
        title: "Vietnam Economic Growth Outlook 2024",
        slug: "vietnam-economic-growth-outlook-2024",
        excerpt: "Comprehensive analysis of Vietnam's economic trajectory and growth projections for 2024, including key factors driving expansion.",
        meta: {
          title: "Vietnam Economic Growth Outlook 2024 | VRC Research",
          description: "Detailed economic analysis and growth projections for Vietnam in 2024. Expert insights on GDP, trade, and investment trends."
        },
        publishedAt: new Date('2024-01-15'),
        _status: 'published',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Vietnam Economic Growth Outlook 2024' }],
                tag: 'h1'
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Vietnam continues to demonstrate remarkable economic resilience, with GDP growth projected to reach 6.5-7% in 2024. This comprehensive analysis examines the key drivers of economic expansion and emerging opportunities.'
                  }
                ]
              },
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Key Growth Drivers' }],
                tag: 'h2'
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Manufacturing exports, foreign direct investment, and domestic consumption remain the primary engines of growth. The technology sector shows particularly strong momentum with significant investments in semiconductor and electronics manufacturing.'
                  }
                ]
              }
            ]
          }
        }
      },
      {
        title: "Digital Transformation in Vietnamese SMEs",
        slug: "digital-transformation-vietnamese-smes",
        excerpt: "Exploring how small and medium enterprises in Vietnam are adopting digital technologies to enhance competitiveness and operational efficiency.",
        meta: {
          title: "Digital Transformation in Vietnamese SMEs | VRC Study",
          description: "Research on digital adoption trends among Vietnamese small and medium enterprises. Technology implementation and business impact analysis."
        },
        publishedAt: new Date('2024-01-10'),
        _status: 'published',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Digital Transformation in Vietnamese SMEs' }],
                tag: 'h1'
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Small and medium enterprises (SMEs) across Vietnam are rapidly embracing digital technologies, driven by changing consumer behaviors and competitive pressures. Our latest research reveals significant trends in technology adoption and business transformation.'
                  }
                ]
              },
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Adoption Trends' }],
                tag: 'h2'
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Over 60% of surveyed SMEs have implemented some form of digital solution in the past two years, with e-commerce platforms and digital payment systems leading adoption rates. Cloud-based accounting and customer management systems are also gaining significant traction.'
                  }
                ]
              }
            ]
          }
        }
      },
      {
        title: "Vietnam-ASEAN Trade Relations: 2024 Analysis",
        slug: "vietnam-asean-trade-relations-2024",
        excerpt: "In-depth analysis of Vietnam's trade relationships within ASEAN, examining bilateral agreements, trade volumes, and emerging cooperation opportunities.",
        meta: {
          title: "Vietnam-ASEAN Trade Relations Analysis 2024 | VRC",
          description: "Comprehensive study of Vietnam's trade dynamics within ASEAN. Analysis of bilateral agreements, trade flows, and regional economic integration."
        },
        publishedAt: new Date('2024-01-08'),
        _status: 'published',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Vietnam-ASEAN Trade Relations: 2024 Analysis' }],
                tag: 'h1'
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Vietnam\'s integration within ASEAN continues to deepen, with intra-regional trade reaching new milestones. This analysis examines current trade patterns, emerging opportunities, and strategic implications for Vietnam\'s economic development.'
                  }
                ]
              },
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Trade Volume Growth' }],
                tag: 'h2'
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Bilateral trade between Vietnam and other ASEAN members increased by 12% in 2023, reaching $180 billion. Key trading partners include Thailand, Singapore, and Malaysia, with significant growth in technology and agricultural exports.'
                  }
                ]
              }
            ]
          }
        }
      },
      {
        title: "Sustainable Development Goals: Vietnam Progress Report",
        slug: "sdg-vietnam-progress-report-2024",
        excerpt: "Assessment of Vietnam's progress towards achieving the UN Sustainable Development Goals, highlighting achievements, challenges, and policy recommendations.",
        meta: {
          title: "SDG Progress Report: Vietnam 2024 | VRC Research",
          description: "Comprehensive assessment of Vietnam's advancement towards UN Sustainable Development Goals. Policy analysis and implementation recommendations."
        },
        publishedAt: new Date('2024-01-05'),
        _status: 'published',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Sustainable Development Goals: Vietnam Progress Report' }],
                tag: 'h1'
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Vietnam has made substantial progress towards achieving the UN Sustainable Development Goals, particularly in poverty reduction, education, and healthcare. This report evaluates current achievements and identifies areas requiring focused attention.'
                  }
                ]
              },
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Key Achievements' }],
                tag: 'h2'
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Vietnam has successfully reduced multidimensional poverty rates to below 3% and achieved universal primary education. Significant improvements in maternal and child health indicators demonstrate the effectiveness of targeted policy interventions.'
                  }
                ]
              }
            ]
          }
        }
      }
    ]

    // Create new posts
    let createdCount = 0
    for (const postData of newPosts) {
      try {
        // Check if post with same slug already exists
        const existing = await payload.find({
          collection: 'posts',
          where: {
            slug: {
              equals: postData.slug
            }
          },
          limit: 1
        })

        if (existing.docs.length === 0) {
          await payload.create({
            collection: 'posts',
            data: postData
          })
          createdCount++
          console.log(`✅ Created post: ${postData.title}`)
        } else {
          console.log(`⏭️  Post already exists: ${postData.title}`)
        }
      } catch (error) {
        console.error(`❌ Failed to create post "${postData.title}":`, error)
      }
    }

    // Check final count
    const finalPosts = await payload.find({
      collection: 'posts',
      limit: 100,
    })

    console.log(`🎉 Seeding completed! Created ${createdCount} new posts.`)
    console.log(`📊 Total posts now: ${finalPosts.docs.length}`)

    return {
      success: true,
      created: createdCount,
      total: finalPosts.docs.length
    }

  } catch (error) {
    console.error('❌ Error seeding posts:', error)
    throw error
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdditionalPosts()
    .then((result) => {
      console.log('✅ Posts seeding completed:', result)
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Posts seeding failed:', error)
      process.exit(1)
    })
}

export { seedAdditionalPosts }
