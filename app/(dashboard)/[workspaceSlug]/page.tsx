import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              scrapedPages: true,
              generatedFeatures: true,
            },
          },
        },
      },
      members: {
        where: { userId: session.user.id },
      },
    },
  });

  if (!workspace || workspace.members.length === 0) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">{workspace.name}</h1>
          <p className="text-sm opacity-60">
            {workspace.projects.length} project
            {workspace.projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href={`/${workspaceSlug}/projects/new`}>New project</Link>
        </Button>
      </div>

      {workspace.projects.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <h2 className="text-lg font-medium mb-2">No projects yet</h2>
          <p className="text-sm opacity-60 mb-6">
            Create your first project to start analyzing your product
          </p>
          <Button asChild>
            <Link href={`/${workspaceSlug}/projects/new`}>
              Create your first project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {workspace.projects.map((project) => (
            <Link
              key={project.id}
              href={`/${workspaceSlug}/projects/${project.id}`}
              className="block p-6 border border-border rounded-lg hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-medium text-lg">{project.name}</h2>
                  <p className="text-sm opacity-60">{project.domain}</p>
                  {project.description && (
                    <p className="text-sm opacity-80 mt-2">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="text-right text-sm opacity-60">
                  <p>{project._count.scrapedPages} pages</p>
                  <p>{project._count.generatedFeatures} features</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
