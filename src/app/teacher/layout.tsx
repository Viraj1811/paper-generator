import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { TeacherSidebarContent } from '@/components/layout/TeacherSidebar';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <Sidebar>
            <TeacherSidebarContent />
        </Sidebar>
        <SidebarInset>
            <AppHeader />
            <div className="p-4 sm:p-6">{children}</div>
        </SidebarInset>
    </SidebarProvider>
  );
}
