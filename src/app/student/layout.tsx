import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { StudentSidebarContent } from '@/components/layout/StudentSidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <Sidebar>
            <StudentSidebarContent />
        </Sidebar>
        <SidebarInset>
            <AppHeader />
            <div className="p-4 sm:px-6">{children}</div>
        </SidebarInset>
    </SidebarProvider>
  );
}
