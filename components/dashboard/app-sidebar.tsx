"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder02Icon, Settings02Icon, Logout03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Logo } from "@/components/logo";
import { signOut } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

interface Project {
  id: string;
  name: string;
  domain: string;
}

interface AppSidebarProps {
  workspaceSlug: string;
  workspaceName: string;
  projects: Project[];
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

export function AppSidebar({
  workspaceSlug,
  workspaceName,
  projects,
  user,
}: AppSidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ fetchOptions: { onSuccess: () => window.location.href = "/login" } });
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href={`/${workspaceSlug}`}>
          <Logo showDomain={false} className="text-xl" />
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/${workspaceSlug}` || pathname === `/${workspaceSlug}/projects`}
                >
                  <Link href={`/${workspaceSlug}`}>
                    <HugeiconsIcon icon={Folder02Icon} size={16} />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/${workspaceSlug}/settings`}
                >
                  <Link href={`/${workspaceSlug}/settings`}>
                    <HugeiconsIcon icon={Settings02Icon} size={16} />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(`/${workspaceSlug}/projects/${project.id}`)}
                  >
                    <Link href={`/${workspaceSlug}/projects/${project.id}`}>
                      <span className="truncate">{project.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${workspaceSlug}/projects/new`} className="opacity-60">
                    <HugeiconsIcon icon={PlusSignIcon} size={16} />
                    <span>New project</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="size-6 rounded-full"
                />
              ) : (
                <div className="size-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
              )}
              <span className="truncate text-sm">{user.name || user.email}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <HugeiconsIcon icon={Logout03Icon} size={16} />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
