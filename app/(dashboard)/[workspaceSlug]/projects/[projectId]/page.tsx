import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

interface Props {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { workspaceSlug, projectId } = await params;

  // Verify user has access to this workspace and project
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspace: {
        slug: workspaceSlug,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    include: {
      workspace: true,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="text-sm opacity-60 mt-1">{project.domain}</p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-lg font-medium mb-4">Project created!</h2>
        <p className="text-sm opacity-60">
          Your project has been set up. The next steps would be to connect your Google Search Console
          and start analyzing your data.
        </p>
      </div>
    </div>
  );
}
