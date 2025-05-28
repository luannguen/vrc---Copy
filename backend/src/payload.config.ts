import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { EventCategories } from './collections/EventCategories'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Navigation } from './collections/Navigation'
import { ProductCategories } from './collections/ProductCategories'
import { ProjectCategories } from './collections/ProjectCategories'
import { NewsCategories } from './collections/NewsCategories'
import { ServiceCategories } from './collections/ServiceCategories'
import { Products } from './collections/Products'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Technologies } from './collections/Technologies'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { CompanyInfo } from './globals/CompanyInfo'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
      // Add only essential UI components to avoid conflicts with bulk operations
      afterNavLinks: ['@/components/AdminUI/DynamicLogout']
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    // Fix for Payload CMS hydration mismatch issue #11066
    // https://github.com/payloadcms/payload/issues/11066
    suppressHydrationWarning: true,livePreview: {
      url: ({ req }: { req: PayloadRequest }) => {
        // Dynamically determine the URL based on environment
        if (process.env.NODE_ENV === 'production') {
          return process.env.FRONTEND_URL || getServerSideURL()
        }
        
        // Development URLs
        return process.env.FRONTEND_URL || 'http://localhost:3000'
      },
      collections: ['posts', 'pages'],
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',  }),  collections: [
    Pages, 
    Posts, 
    Media, 
    Categories,    ProductCategories,
    ProjectCategories,
    NewsCategories,
    ServiceCategories,
    Users, 
    ContactSubmissions,
    Navigation,
    Products,
    Projects,
    EventCategories,
    Events,
    Services,
    Technologies  ],  cors: {
    origins: process.env.NODE_ENV === 'production'
      ? [
          getServerSideURL(),                                  // Backend URL
          process.env.FRONTEND_URL,                            // Frontend URL (production)
          // Thêm domain production khác nếu cần
        ].filter(Boolean) as string[]
      : [
          getServerSideURL(),                                  // Backend URL
          process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend Vite URL
          'http://localhost:8080', 'http://localhost:8081',    // Custom frontend ports
          '*',                                                 // Allow all origins for development
        ].filter(Boolean) as string[],
    headers: [
      'authorization', 
      'content-type', 
      'x-custom-header', 
      'cache-control', 
      'x-requested-with',
      'accept',
    ]
  },
  globals: [Header, Footer, CompanyInfo],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },  endpoints: [
    // Health check endpoint has been migrated to Next.js API Route
    // But we keep it here with a stub to avoid build errors
    // See /app/api/health/route.ts for the new implementation
    (await import('./endpoints/health')).healthEndpoint,
  ],
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
