import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

async function getWorkspaceWithProjects(slug: string, userId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    include: {
      members: {
        where: { userId },
        select: { role: true },
      },
      projects: {
        select: {
          id: true,
          name: true,
          domain: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!workspace || workspace.members.length === 0) {
    return null;
  }

  return {
    ...workspace,
    userRole: workspace.members[0].role,
  };
}

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const workspace = await getWorkspaceWithProjects(workspaceSlug, session.user.id);

  if (!workspace) {
    notFound();
  }

  return (
    <SidebarProvider>
      <AppSidebar
        workspaceSlug={workspaceSlug}
        workspaceName={workspace.name}
        projects={workspace.projects}
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image || null,
        }}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-6">
          <SidebarTrigger className="-ml-2" />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
