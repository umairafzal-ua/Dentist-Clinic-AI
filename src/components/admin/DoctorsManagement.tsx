import { useGetDoctors } from '@/hooks/use-doctors'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { MailIcon, PhoneIcon, PlusIcon, StethoscopeIcon,EditIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import AddDoctorDialog from './AddDoctorDialog';
import EditDoctorDialog from './EditDoctorDialog';
import { Doctor } from '@prisma/client';

function DoctorsManagement() {
    const {data:doctors=[]}=useGetDoctors();
    const [isAddDialogOpen,setIsAddDialogOpen]=useState(false);
    const [isEditDialogOpen,setIsEditDialogOpen]=useState(false);
    const [selectedDoctor,setSelectedDoctor]=useState<Doctor | null>(null);

    const handleEditDoctor=(doctor:Doctor)=>{
        setSelectedDoctor(doctor);
        setIsEditDialogOpen(true);
    }
    const handleCloseEditDialog=()=>{
        setIsEditDialogOpen(false);
        setSelectedDoctor(null);
    }


    return (
    <>
        <Card className='mb-12'>
            <CardHeader className="flex items-center justify-between">
                <div>
                <CardTitle className='flex items-center gap-2'>
                    <StethoscopeIcon className='size-5 text-primary'/>
                    Doctors Management  
                </CardTitle>
                <CardDescription>
                    Manage your doctors, add new ones, edit existing profiles, and monitor their activity status.
                </CardDescription>
                </div>
                <Button onClick={()=>setIsAddDialogOpen(true)} 
                    className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/100 '>
                    <PlusIcon className='mr-2 size-4'/>
                    Add Doctor
                </Button>
            </CardHeader>

            <CardContent>
                <div className='space-y-4'>
                    {doctors.map(doctor=>(
                        <div key={doctor.id} className='flex items-center justify-between p-4 border rounded-xl border-border/50 bg-muted/30'>
                            <div className='flex items-center gap-4'>
                                <Image className="size-12 rounded-full object-cover ring-2 ring-background " src={doctor.imageUrl} alt="doctor.name" width={48} height={48}/>

                                <div>
                                    <div className='font-semibold'>{doctor.name}</div>
                                    <div className='text-sm text-muted-foreground'>
                                        {doctor.speciality}
                                        <span className='ml-12 px-2 py-0.5 bg-muted rounded text-xs'>
                                            {doctor.gender === "MALE" ? "Male":"Female"}
                                        </span>
                                    </div>

                                    <div className='flex items-center mt-1 gap-4'>
                                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                            <MailIcon className='h-3 w-3'/>
                                            {doctor.email}
                                        </div>
                                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                            <PhoneIcon className='h-3 w-3'/>
                                            {doctor.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='flex items-center gap-3'>
                                <div className='items-center'>
                                    <div className='font-semibold text-primary'>{doctor.appointmentCount}</div>
                                    <div className='text-xs text-muted-foreground'>Appointments</div>
                                </div>

                                {doctor.isActive ? (<Badge className='bg-green-100 text-green-800 hover:bg-green-100'>Active</Badge>):(<Badge className='text-primary'>Inactive</Badge>)}

                                <Button size='sm' variant="outline" className='h-8 px-3' onClick={()=>handleEditDoctor(doctor)}><EditIcon className='size-4 mr-1'/>Edit</Button>

                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <AddDoctorDialog isOpen={isAddDialogOpen} onClose={()=> setIsAddDialogOpen(false)}/>
        {/* Edit Doctor Dialog */}
        <EditDoctorDialog isOpen={isEditDialogOpen} onClose={handleCloseEditDialog} doctor={selectedDoctor} key={selectedDoctor?.id}/>
    </>
  )
}

export default DoctorsManagement
