import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createDefaultWorkspace(userId: string, userName: string | null, email: string) {
  // Generate workspace name from user name or email
  const baseName = userName || email.split("@")[0];
  const workspaceName = `${baseName}'s workspace`;

  // Generate unique slug
  let slug = generateSlug(baseName);
  let suffix = 1;

  while (await prisma.workspace.findUnique({ where: { slug } })) {
    slug = `${generateSlug(baseName)}-${suffix}`;
    suffix++;
  }

  return prisma.workspace.create({
    data: {
      name: workspaceName,
      slug,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Get user's workspaces
  let workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          projects: true,
          members: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Auto-create workspace for new users
  if (workspaces.length === 0) {
    const workspace = await createDefaultWorkspace(
      session.user.id,
      session.user.name,
      session.user.email
    );
    redirect(`/${workspace.slug}/projects/new`);
  }

  // If user has exactly one workspace, redirect to it
  if (workspaces.length === 1) {
    redirect(`/${workspaces[0].slug}`);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border p-4 flex items-center justify-between">
        <Logo showDomain={false} className="text-xl sm:text-2xl" />
        <p className="text-sm opacity-60">{session.user.email}</p>
      </header>

      <main className="max-w-2xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Your workspaces</h1>
          <Button asChild variant="outline">
            <Link href="/onboarding">Create workspace</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/${workspace.slug}`}
              className="block p-4 border border-border rounded-lg hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium">{workspace.name}</h2>
                  <p className="text-sm opacity-60">
                    {workspace._count.projects} project
                    {workspace._count.projects !== 1 ? "s" : ""} •{" "}
                    {workspace._count.members} member
                    {workspace._count.members !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-sm opacity-40">/{workspace.slug}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
