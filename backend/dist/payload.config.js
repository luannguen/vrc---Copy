"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_mongodb_1 = require("@payloadcms/db-mongodb");
const sharp_1 = __importDefault(require("sharp")); // sharp-import
const path_1 = __importDefault(require("path"));
const payload_1 = require("payload");
const url_1 = require("url");
const Categories_1 = require("./collections/Categories");
const EventCategories_1 = require("./collections/EventCategories");
const Events_1 = require("./collections/Events");
const EventRegistrations_1 = require("./collections/EventRegistrations");
const Media_1 = require("./collections/Media");
const Pages_1 = require("./collections/Pages");
const Posts_1 = require("./collections/Posts");
const Users_1 = require("./collections/Users");
const ContactSubmissions_1 = require("./collections/ContactSubmissions");
const Navigation_1 = require("./collections/Navigation");
const ProductCategories_1 = require("./collections/ProductCategories");
const ProjectCategories_1 = require("./collections/ProjectCategories");
const NewsCategories_1 = require("./collections/NewsCategories");
const ServiceCategories_1 = require("./collections/ServiceCategories");
const Products_1 = require("./collections/Products");
const Projects_1 = require("./collections/Projects");
const Services_1 = require("./collections/Services");
const Technologies_1 = require("./collections/Technologies");
const TechnologySections_1 = require("./collections/TechnologySections");
const Tools_1 = require("./collections/Tools");
const Resources_1 = require("./collections/Resources");
const Banners_1 = require("./collections/Banners");
const config_1 = require("./Footer/config");
const config_2 = require("./Header/config");
const CompanyInfo_1 = require("./globals/CompanyInfo");
const HomepageSettings_1 = require("./globals/HomepageSettings");
const AboutPageSettings_1 = require("./globals/AboutPageSettings");
const plugins_1 = require("./plugins");
const defaultLexical_1 = require("@/fields/defaultLexical");
const getURL_1 = require("./utilities/getURL");
const filename = (0, url_1.fileURLToPath)(import.meta.url);
const dirname = path_1.default.dirname(filename);
exports.default = (0, payload_1.buildConfig)({ admin: {
        components: {
            // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
            // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
            beforeLogin: ['@/components/BeforeLogin'], // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
            // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
            beforeDashboard: ['@/components/BeforeDashboard'],
            // Add only essential UI components to avoid conflicts with bulk operations
            afterNavLinks: ['@/components/AdminUI/DynamicLogout'],
            // Add custom admin styles for better UI including react-select styling
            afterDashboard: ['@/components/AdminUI/DynamicAdminStyles']
        },
        importMap: {
            baseDir: path_1.default.resolve(dirname),
        },
        user: Users_1.Users.slug,
        // Fix for Payload CMS hydration mismatch issue #11066
        // https://github.com/payloadcms/payload/issues/11066
        suppressHydrationWarning: true, livePreview: {
            url: ({ req: _req }) => {
                // Dynamically determine the URL based on environment
                if (process.env.NODE_ENV === 'production') {
                    return process.env.FRONTEND_URL || (0, getURL_1.getServerSideURL)();
                }
                // Development URLs
                return process.env.FRONTEND_URL || 'http://localhost:3000';
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
    editor: defaultLexical_1.defaultLexical,
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.DATABASE_URI || '',
    }), collections: [
        Pages_1.Pages,
        Posts_1.Posts,
        Media_1.Media,
        Categories_1.Categories, ProductCategories_1.ProductCategories,
        ProjectCategories_1.ProjectCategories,
        NewsCategories_1.NewsCategories,
        ServiceCategories_1.ServiceCategories,
        Users_1.Users,
        ContactSubmissions_1.ContactSubmissions,
        Navigation_1.Navigation,
        Products_1.Products,
        Projects_1.Projects,
        EventCategories_1.EventCategories,
        Events_1.Events,
        EventRegistrations_1.EventRegistrations,
        Services_1.Services,
        Technologies_1.Technologies,
        TechnologySections_1.TechnologySections,
        Tools_1.Tools,
        Resources_1.Resources,
        Banners_1.Banners,
    ], cors: {
        origins: process.env.NODE_ENV === 'production'
            ? [
                (0, getURL_1.getServerSideURL)(), // Backend URL
                process.env.FRONTEND_URL, // Frontend URL (production)
                // Thêm domain production khác nếu cần
            ].filter(Boolean)
            : [
                (0, getURL_1.getServerSideURL)(), // Backend URL
                process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend Vite URL
                'http://localhost:8080', 'http://localhost:8081', // Custom frontend ports
                '*', // Allow all origins for development
            ].filter(Boolean), headers: [
            'authorization',
            'content-type',
            'x-custom-header',
            'x-api-key', // Add API key header
            'cache-control',
            'x-requested-with',
            'accept',
        ]
    },
    globals: [config_2.Header, config_1.Footer, CompanyInfo_1.CompanyInfo, HomepageSettings_1.HomepageSettings, AboutPageSettings_1.AboutPageSettings],
    plugins: [
        ...plugins_1.plugins,
        // storage-adapter-placeholder
    ],
    secret: process.env.PAYLOAD_SECRET,
    sharp: sharp_1.default, typescript: {
        outputFile: path_1.default.resolve(dirname, 'payload-types.ts'),
    }, endpoints: [
        // Health check endpoint has been migrated to Next.js API Route
        // But we keep it here with a stub to avoid build errors
        // See /app/api/health/route.ts for the new implementation
        (await Promise.resolve().then(() => __importStar(require('./endpoints/health')))).healthEndpoint,
    ],
    jobs: {
        access: {
            run: ({ req }) => {
                // Allow logged in users to execute this endpoint (default)
                if (req.user)
                    return true;
                // If there is no logged in user, then check
                // for the Vercel Cron secret to be present as an
                // Authorization header:
                const authHeader = req.headers.get('authorization');
                return authHeader === `Bearer ${process.env.CRON_SECRET}`;
            },
        },
        tasks: [],
    },
});
