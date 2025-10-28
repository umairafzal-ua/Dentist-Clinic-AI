"use client"
import React from 'react'
import Navbar from '@/components/Navbar'
import { useUser } from '@clerk/nextjs'
import { SettingsIcon } from 'lucide-react';
import { useGetDoctors } from '@/hooks/use-doctors';
import { useGetAppointments } from '@/hooks/use-appointment';
import AdminStats from '@/components/admin/AdminStats';
import DoctorsManagement from '@/components/admin/DoctorsManagement';

function AdminDashboardClient() {
  const { user } = useUser();
  const { data: doctors = [], isLoading: doctorsLoading } = useGetDoctors();
  const { data: appointments = [], isLoading: appointmentsLoading } = useGetAppointments();
  // console.log(doctors,appointments)

  //Calculating stats from real data
  const stats = {
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter((doc) => doc.isActive).length,
    totalAppointments: appointments.length,
    completedAppointemnts: appointments.filter((app) => app.status === "COMPLETED").length,
  }

  if (doctorsLoading || appointmentsLoading) {
    return <DoctorLoading/>
  }

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-6 py-8 pt-24'>
        {/* AdminWelcomeSection */}
        <div className="mb-12 flex items-center justify-between bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Admin Dashboard</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName || "Admin"}!
              </h1>
              <p className="text-muted-foreground">
                Manage doctors, oversee appointments, and monitor your dental practice performance.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        <AdminStats
          totalDoctors={stats.totalDoctors}
          activeDoctors={stats.activeDoctors}
          totalAppointments={stats.totalAppointments}
          completedAppointments={stats.completedAppointemnts}
        />

        <DoctorsManagement />
      </div>
    </div>
  )
}

export default AdminDashboardClient

function DoctorLoading() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mx-auto'></div>
        <div className='text-lg font-medium'>Loading dashboard...</div>
      </div>
    </div>
  )
}

