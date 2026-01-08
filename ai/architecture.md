# Architecture NextUp.build - MVP

## Stack technique

| Composant | Choix |
|-----------|-------|
| Framework | Next.js 16 (App Router) |
| Auth | [Better Auth](https://better-auth.com) + Google OAuth |
| Database | Supabase (PostgreSQL) + Prisma |
| Scraping | [Firecrawl](https://firecrawl.dev) |
| AI | Claude 3.5 Sonnet (Anthropic) |
| Background Jobs | [Inngest](https://inngest.com) |
| Styling | Tailwind CSS 4 + shadcn/ui |

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USERS & WORKSPACES (Multi-tenant)
// ============================================

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  avatarUrl     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  workspaceMembers  WorkspaceMember[]
  connectedAccounts ConnectedAccount[]
  feedbacks         Feedback[]
  generatedFeatures GeneratedFeature[]
  chatMessages      ChatMessage[]
}

model Workspace {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members           WorkspaceMember[]
  projects          Project[]
  feedbacks         Feedback[]
  generatedFeatures GeneratedFeature[]
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  role        WorkspaceRole @default(MEMBER)
  createdAt   DateTime      @default(now())

  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([userId, workspaceId])
}

enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
}

// ============================================
// PROJECTS & CONNECTED ACCOUNTS
// ============================================

model Project {
  id          String   @id @default(cuid())
  name        String
  domain      String   // e.g., "nextup.build"
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspaceId       String
  workspace         Workspace          @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  connectedAccounts ConnectedAccount[]
  scrapedPages      ScrapedPage[]
  searchConsoleData SearchConsoleData[]
  feedbacks         Feedback[]
  generatedFeatures GeneratedFeature[]

  @@unique([workspaceId, domain])
}

model ConnectedAccount {
  id                String          @id @default(cuid())
  provider          AccountProvider
  providerAccountId String
  accessToken       String          // Encrypted
  refreshToken      String?         // Encrypted
  expiresAt         DateTime?
  scopes            String[]
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([userId, projectId, provider])
}

enum AccountProvider {
  GOOGLE_SEARCH_CONSOLE
}

// ============================================
// DATA INGESTION
// ============================================

model ScrapedPage {
  id           String       @id @default(cuid())
  url          String
  title        String?
  content      String?      // Markdown content
  metadata     Json?
  status       ScrapeStatus @default(PENDING)
  errorMessage String?
  scrapedAt    DateTime?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, url])
}

enum ScrapeStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model SearchConsoleData {
  id          String   @id @default(cuid())
  query       String
  page        String
  clicks      Int      @default(0)
  impressions Int      @default(0)
  ctr         Float    @default(0)
  position    Float    @default(0)
  date        DateTime
  createdAt   DateTime @default(now())

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, query, page, date])
  @@index([projectId, date])
  @@index([projectId, impressions(sort: Desc)])
}

model Feedback {
  id        String             @id @default(cuid())
  source    FeedbackSource
  content   String
  sentiment FeedbackSentiment?
  category  String?
  metadata  Json?
  createdAt DateTime           @default(now())

  projectId     String
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  workspaceId   String
  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  submittedById String?
  submittedBy   User?     @relation(fields: [submittedById], references: [id])

  @@index([projectId, createdAt])
}

enum FeedbackSource {
  WIDGET
  MANUAL
  INTERCOM
  ZENDESK
}

enum FeedbackSentiment {
  POSITIVE
  NEUTRAL
  NEGATIVE
}

// ============================================
// FEATURE GENERATION ENGINE
// ============================================

model GeneratedFeature {
  id           String        @id @default(cuid())
  title        String
  description  String
  rationale    String
  priority     Int           @default(0)
  status       FeatureStatus @default(DRAFT)
  dataSnapshot Json
  cursorPrompt String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  projectId    String
  project      Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  workspaceId  String
  workspace    Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  createdById  String
  createdBy    User         @relation(fields: [createdById], references: [id])
  chatMessages ChatMessage[]

  @@index([projectId, priority(sort: Desc)])
}

enum FeatureStatus {
  DRAFT
  REFINED
  APPROVED
  ARCHIVED
}

model ChatMessage {
  id        String   @id @default(cuid())
  role      ChatRole
  content   String
  createdAt DateTime @default(now())

  featureId String
  feature   GeneratedFeature @relation(fields: [featureId], references: [id], onDelete: Cascade)
  userId    String?
  user      User?            @relation(fields: [userId], references: [id])

  @@index([featureId, createdAt])
}

enum ChatRole {
  USER
  ASSISTANT
  SYSTEM
}
```

---

## Authentication Flow (Google OAuth)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Authentication Flow                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User clicks "Connect Google Search Console"                  │
│                           │                                      │
│                           ▼                                      │
│  2. Redirect to Google OAuth with scopes:                        │
│     - openid                                                     │
│     - email                                                      │
│     - profile                                                    │
│     - https://www.googleapis.com/auth/webmasters.readonly        │
│                           │                                      │
│                           ▼                                      │
│  3. Google redirects back with authorization code                │
│                           │                                      │
│                           ▼                                      │
│  4. Exchange code for tokens (access + refresh)                  │
│                           │                                      │
│                           ▼                                      │
│  5. Store encrypted tokens in ConnectedAccount                   │
│                           │                                      │
│                           ▼                                      │
│  6. Before each API call, check token expiry                     │
│     - If expired: use refresh_token to get new access_token      │
│     - Update ConnectedAccount with new tokens                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Better Auth Configuration

```typescript
// lib/auth.ts

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/webmasters.readonly",
      ],
      accessType: "offline",
      prompt: "consent",
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
```

### Token Refresh Logic

```typescript
// lib/auth/google-oauth.ts

import { google } from "googleapis";
import { encrypt, decrypt } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
);

export async function getValidAccessToken(
  connectedAccountId: string
): Promise<string> {
  const account = await prisma.connectedAccount.findUnique({
    where: { id: connectedAccountId },
  });

  if (!account) {
    throw new Error("Connected account not found");
  }

  const accessToken = decrypt(account.accessToken);
  const refreshToken = account.refreshToken
    ? decrypt(account.refreshToken)
    : null;

  // Check if token is expired (with 5 min buffer)
  const isExpired =
    account.expiresAt &&
    account.expiresAt < new Date(Date.now() + 5 * 60 * 1000);

  if (!isExpired) {
    return accessToken;
  }

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();

  await prisma.connectedAccount.update({
    where: { id: connectedAccountId },
    data: {
      accessToken: encrypt(credentials.access_token!),
      expiresAt: credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : null,
      ...(credentials.refresh_token && {
        refreshToken: encrypt(credentials.refresh_token),
      }),
    },
  });

  return credentials.access_token!;
}
```

---

## Background Jobs (Inngest)

### Why Inngest?
- Évite les timeouts 504 sur Vercel (max 60s)
- Retries automatiques avec backoff exponentiel
- Observabilité intégrée
- Fonctionne avec serverless

### Event Types

```typescript
// lib/inngest/client.ts

import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "nextup" });

type Events = {
  "scrape/page": {
    data: { projectId: string; url: string };
  };
  "scrape/sitemap": {
    data: { projectId: string; sitemapUrl: string };
  };
  "gsc/sync": {
    data: {
      projectId: string;
      connectedAccountId: string;
      dateRange: { start: string; end: string };
    };
  };
  "feedback/analyze": {
    data: { feedbackId: string };
  };
  "feature/generate": {
    data: { projectId: string; userId: string };
  };
};
```

### Scrape Page Function

```typescript
// lib/inngest/functions/scrape-page.ts

import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!
});

export const scrapePage = inngest.createFunction(
  {
    id: "scrape-page",
    retries: 3,
    concurrency: { limit: 5 },
  },
  { event: "scrape/page" },
  async ({ event, step }) => {
    const { projectId, url } = event.data;

    await step.run("mark-processing", async () => {
      await prisma.scrapedPage.upsert({
        where: { projectId_url: { projectId, url } },
        create: { projectId, url, status: "PROCESSING" },
        update: { status: "PROCESSING" },
      });
    });

    const result = await step.run("firecrawl-scrape", async () => {
      return firecrawl.scrapeUrl(url, {
        formats: ["markdown", "html"],
        onlyMainContent: true,
      });
    });

    await step.run("save-result", async () => {
      await prisma.scrapedPage.update({
        where: { projectId_url: { projectId, url } },
        data: {
          status: "COMPLETED",
          title: result.metadata?.title,
          content: result.markdown,
          metadata: {
            description: result.metadata?.description,
            ogImage: result.metadata?.ogImage,
            links: result.links,
          },
          scrapedAt: new Date(),
        },
      });
    });

    return { success: true, url };
  }
);
```

### Feature Generation Function

```typescript
// lib/inngest/functions/generate-feature.ts

import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const generateFeature = inngest.createFunction(
  {
    id: "generate-feature",
    retries: 2,
  },
  { event: "feature/generate" },
  async ({ event, step }) => {
    const { projectId, userId } = event.data;

    const dataSnapshot = await step.run("gather-data", async () => {
      const [scrapedPages, gscData, feedbacks, project] = await Promise.all([
        prisma.scrapedPage.findMany({
          where: { projectId, status: "COMPLETED" },
          select: { url: true, title: true, content: true },
          take: 20,
        }),
        prisma.searchConsoleData.findMany({
          where: { projectId },
          orderBy: { impressions: "desc" },
          take: 100,
        }),
        prisma.feedback.findMany({
          where: { projectId },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.project.findUnique({ where: { id: projectId } }),
      ]);

      return { scrapedPages, gscData, feedbacks, project };
    });

    const generation = await step.run("claude-generate", async () => {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: buildFeaturePrompt(dataSnapshot),
        }],
      });

      return response.content[0].type === "text"
        ? response.content[0].text
        : "";
    });

    const feature = await step.run("save-feature", async () => {
      const parsed = parseFeatureResponse(generation);

      return prisma.generatedFeature.create({
        data: {
          projectId,
          workspaceId: dataSnapshot.project!.workspaceId,
          createdById: userId,
          title: parsed.title,
          description: parsed.description,
          rationale: parsed.rationale,
          priority: parsed.priority,
          dataSnapshot: dataSnapshot as any,
          cursorPrompt: parsed.cursorPrompt,
        },
      });
    });

    return { success: true, featureId: feature.id };
  }
);
```

---

## Folder Structure

```
nextup/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── [workspaceSlug]/
│   │   │   ├── projects/
│   │   │   │   └── [projectId]/
│   │   │   │       ├── data/page.tsx
│   │   │   │       ├── features/page.tsx
│   │   │   │       └── settings/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/[...all]/route.ts
│   │   ├── inngest/route.ts
│   │   └── ...
│   └── (marketing)/
│       └── page.tsx (landing - current)
├── components/
│   ├── ui/
│   ├── dashboard/
│   └── ...
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── prisma.ts
│   ├── crypto.ts
│   ├── inngest/
│   │   ├── client.ts
│   │   └── functions/
│   └── services/
│       ├── firecrawl.ts
│       ├── search-console.ts
│       └── anthropic.ts
└── prisma/
    └── schema.prisma
```

---

## Sprint Plan

### Sprint 1: Foundation
**Focus:** Auth + Multi-tenant

- [ ] Setup Prisma avec Supabase
- [ ] Configurer Better Auth avec Google OAuth
- [ ] Créer les modèles User, Workspace, WorkspaceMember
- [ ] UI: Pages login, signup, workspace creation
- [ ] Middleware protection des routes + context workspace

### Sprint 2: Scraping
**Focus:** Firecrawl + Inngest

- [ ] Intégrer Firecrawl API
- [ ] Setup Inngest (client + route handler)
- [ ] Créer le modèle Project + ScrapedPage
- [ ] UI: Ajouter un projet avec domain
- [ ] Job scrape/page + scrape/sitemap
- [ ] UI: Dashboard pages scrapées

### Sprint 3: GSC + Feedback
**Focus:** Data ingestion complète

- [ ] Flow OAuth GSC complet avec refresh tokens
- [ ] Job gsc/sync via Inngest
- [ ] Modèle Feedback + import manuel (CSV)
- [ ] Widget de feedback embarquable
- [ ] UI: Dashboard sources de données

### Sprint 4: Feature Engine
**Focus:** Génération AI

- [ ] Logique d'agrégation des 3 sources
- [ ] Job feature/generate avec Claude
- [ ] Modèle GeneratedFeature
- [ ] UI: Page génération + preview
- [ ] Générateur prompt Cursor/Windsurf

### Sprint 5: Refinement
**Focus:** Polish + UX

- [ ] Chat AI pour affiner les features (streaming)
- [ ] Export des prompts (copy, download)
- [ ] Historique des générations
- [ ] Onboarding flow
- [ ] Tests E2E critiques

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
BETTER_AUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Encryption
ENCRYPTION_KEY="..." # 32 bytes hex

# Services
FIRECRAWL_API_KEY="..."
ANTHROPIC_API_KEY="..."
INNGEST_SIGNING_KEY="..."
INNGEST_EVENT_KEY="..."

# App
NEXT_PUBLIC_APP_URL="https://nextup.build"
```
