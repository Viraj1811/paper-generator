'use client';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  FilePlus2,
  BookCopy,
  Users,
  Settings,
  LogOut,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const iconClass = "h-5 w-5";

export function TeacherSidebarContent() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary"/>
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Shayak's Paper Generator</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/teacher/dashboard')} tooltip="Dashboard">
              <Link href="/teacher/dashboard">
                <Home className={iconClass} />
                <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/teacher/generate')} tooltip="Generate Paper">
              <Link href="/teacher/generate/express">
                <FilePlus2 className={iconClass} />
                <span className="group-data-[collapsible=icon]:hidden">Generate Paper</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Question Bank">
              <BookCopy className={iconClass} />
              <span className="group-data-[collapsible=icon]:hidden">Question Bank</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Students">
              <Users className={iconClass} />
              <span className="group-data-[collapsible=icon]:hidden">Students</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className={iconClass} />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/">
                <LogOut className={iconClass} />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
