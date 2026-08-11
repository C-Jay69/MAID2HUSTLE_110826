# MAID2HUSTLE NEWEST MAIN PROMPT

FEB 28 2026

Here's a comprehensive prompt incorporating all your requirements for the "MAID TO HUSTLE" full-stack application:

\---

**\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*MOST IMPORTANT\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\***

***I run a Youtube channel that teaches users how to build apps, platforms and businesses, bootstrapping, so i stay away from any api's like Open AI or Anthropic etc and I use open source  models instead, ie. Ollama, Mistral, Open Router, Google AI Studio etc, to be in keeping with the "Free or almost Free" model of my youtube channel, so please use only available open source or very inexpensive models, wherever possible.***

\#\#\# Full-Stack Application Prompt: "MAID TO HUSTLE"  
\*\*Tech Stack:\*\*    
\- Frontend: Next.js 14 (App Router) \+ Tailwind CSS    
\- Backend: Node.js/Express    
\- Database: PostgreSQL (Prisma ORM)    
\- Auth: NextAuth.js (OAuth providers)    
\- Payments: Stripe    
\- Calendar: FullCalendar.js    
\- AI Agent: OpenAI API    
\- Deployment: Vercel \+ Railway  

***LAYOUT & BRAND COLOR SCHEMES***

* Overall Style & Layout:  
* Framework: Next.js with Tailwind CSS  
* Layout Structure: Full-width, centered content with max-w-7xl containers  
* Background: Predominantly bg-black (black) with gradient accents  
* Typography: Large, bold headings with gradient text effects  
* Sections: Each section uses py-20 lg:py-32 for vertical spacing  
* Grid System: Uses grid lg:grid-cols-2 for two-column layouts on larger screens  
* Color Palette (Hex Values & Tailwind Classes):  
  * Backgrounds:  
* Black: \#000000 (bg-black)  
* Dark Gray: \#2a2a2a (bg-\[\#2a2a2a\])  
* Gray 900: \#111827 (bg-gray-900)  
* Gradients:  
* from-gray-900 to-black  
* from-purple-500 to-cyan-500  
  * Text Colors:  
* White: \#ffffff (text-white)  
* Gray 300: \#d1d5db (text-gray-300)  
* Gray 400: \#9ca3af (text-gray-400)  
* Gray 500: \#6b7280 (text-gray-500)  
* Gray 600: \#4b5563 (text-gray-600)  
* Transparent Gradients:  
* from-blue-400 to-cyan-400  
* from-purple-400 to-blue-400  
  * Borders:  
* Gray 800: \#1f2937 (border-gray-800)  
* White: \#ffffff (border-white)  
  * Accent & Gradient Colors:  
* Blue 400: \#60a5fa (from-blue-400)  
* Cyan 400: \#22d3ee (to-cyan-400)  
* Purple 400: \#c084fc (from-purple-400)  
* Purple 500: \#a855f7 (from-purple-500)  
* Cyan 500: \#06b6d4 (to-cyan-500)  
* Key Visual Features:  
* Gradient Text: Used in all major headings (bg-gradient-to-r with bg-clip-text text-transparent)  
* Gradient Backgrounds: Used in buttons and feature icons  
* Card Styles: Dark cards (\#2a2a2a) with rounded corners (rounded-lg)  
* Image Placeholders: Gray background (bg-gray-900) with centered placeholder text  
* Button Styles:  
* Primary: Gradient (from-purple-500 to-cyan-500) with white text  
* Secondary: White border (border-2 border-white) with hover effect to invert colors  
* Layout Summary:  
* Navigation: Fixed top bar with logo and links  
* Hero Section: Two-column layout with headline and placeholder image  
* Feature Sections: Alternating two-column layouts with text on left/right  
* Process Steps: Three-column grid for numbered steps  
* CTA Section: Centered call-to-action with gradient background  
* Footer: Simple centered text with border  
* Responsive Design:  
* Uses Tailwind's responsive prefixes (lg:, md:)  
* Stacked columns on mobile, side-by-side on desktop  
* Font sizes scale with viewport (text-5xl lg:text-7xl)

\*\*Core Features Implementation:\*\*  

1\. \*\*Authentication System\*\*    
   \- Multi-provider OAuth (Google, GitHub, Facebook)    
   \- Role-based access (Customer/Vendor/Admin)    
   \- JWT token management  

2\. \*\*Vendor Management\*\*    
   \`\`\`prisma  
   model Vendor {  
     id          Int      @id @default(autoincrement())  
     name        String  
     serviceType String   // "maid", "plumber", etc.  
     rating      Float  
     hourlyRate  Float  
     bio         String  
     photo       String?  
     availability Json  
     bookings    Booking\[\]  
   }  
   \`\`\`

3\. \*\*Booking & Calendar System\*\*    
   \- FullCalendar integration with vendor availability    
   \- Real-time conflict detection    
   \- Booking status workflow (pending → confirmed → completed)  

4\. \*\*Payment Portal\*\*    
   \- Stripe payment links for bookings    
   \- Transaction history tracking    
   \- Subscription management (premium vendor features)  

5\. \*\*Admin Dashboard\*\*    
   \- Vendor approval workflow    
   \- Booking dispute resolution    
   \- Platform analytics dashboard    
   \- Category management (services)  

6\. \*\*AI Customer Service Agent\*\*    
   \- OpenAI GPT-4 powered chatbot    
   \- Booking assistance    
   \- Vendor recommendation engine    
   \- FAQ automation  

\*\*Required Components:\*\*    
1\. \*\*User Flow\*\*    
   \- Vendor registration with service catalog    
   \- Customer search with availability filters    
   \- Real-time booking confirmation    
   \- Payment processing with Stripe webhooks  

2\. \*\*Key Pages\*\*    
   \- Home (Hero \+ Service categories)    
   \- Vendor profile with live calendar    
   \- Booking confirmation portal    
   \- Admin dashboard (vendor/booking management)    
   \- AI chat widget (floating button)  

3\. \*\*Special Features\*\*    
   \- Vendor availability heatmap    
   \- Automated booking reminders (email/SMS)    
   \- AI-powered service matching    
   \- Dynamic pricing calculator  

\*\*Style Implementation Guidelines:\*\*    
\`\`\`tsx  
// Example component using your design system  
const HeroSection \= () \=\> (  
  \<section className="py-32 bg-dark-bg text-center"\>  
    \<div className="max-w-7xl mx-auto"\>  
      \<h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent mb-6"\>  
        Find Local Heroes for Every Task  
      \</h1\>  
      \<p className="text-gray-300 text-xl mb-10"\>  
        Book trusted maids, plumbers, electricians and more in 60 seconds  
      \</p\>  
      \<button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:opacity-90 transition-opacity"\>  
        Book First Service  
      \</button\>  
    \</div\>  
  \</section\>  
)  
\`\`\`

\*\*Environment Setup:\*\*    
1\. \*\*Backend Services\*\*    
   \- PostgreSQL database with Prisma    
   \- Redis for session management    
   \- Stripe webhooks handler    
   \- OpenAI API integration  

2\. \*\*Frontend Structure\*\*    
   \`\`\`  
   /app  
     /(auth)  
       /login  
       /register  
     /vendor  
       /\[id\]  
         /calendar  
         /book  
     /admin  
       /dashboard  
       /vendors  
       /bookings  
     /api  
       /ai-chat  
       /payments  
       /calendar  
   \`\`\`

\*\*Key Integrations:\*\*    
\- \*\*Stripe:\*\* Payment Links API \+ Checkout    
\- \*\*FullCalendar:\*\* Resource synchronization    
\- \*\*OpenAI:\*\* GPT-4 Turbo with function calling    
\- \*\*OAuth:\*\* NextAuth.js provider configuration  

\*\*Deployment Requirements:\*\*    
1\. Vercel for frontend hosting    
2\. Railway for backend/postgres    
3\. Stripe/Google Cloud environment variables    
4\. Redis Cloud for session storage  

\*\*Testing Checklist:\*\*    
\- \[ \] Vendor registration flow    
\- \[ \] OAuth authentication    
\- \[ \] Calendar booking conflicts    
\- \[ \] Payment processing    
\- \[ \] AI agent booking capability    
\- \[ \] Admin moderation tools  

\---

This prompt includes all specified requirements with technical depth for implementation. The AI should generate:    
1\. Complete database schema    
2\. Auth system with OAuth    
3\. Vendor booking workflow    
4\. Admin dashboard    
5\. Payment integration    
6\. Calendar synchronization    
7\. AI chat functionality    
8\. Responsive UI matching your design system.