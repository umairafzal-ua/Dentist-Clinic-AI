import { Gender } from '@prisma/client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { useCreateDoctor } from '@/hooks/use-doctors'
import { formatPhoneNumber } from '@/lib/utils'

interface AddDoctorDialogProps {
  isOpen: boolean,
  onClose: () => void
}

const AddDoctorDialog = ({ isOpen, onClose }: AddDoctorDialogProps) => {
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    speciality: "",
    gender: "Male" as Gender,
    isActive: true
  })
  const createDoctorMutation = useCreateDoctor();

  const handlePhoneChange = (value:string) => {
    const formattedPhoneNumber=formatPhoneNumber(value);
    setNewDoctor({...newDoctor,phone:formattedPhoneNumber})
   }  
  const handleSave = () => {
    createDoctorMutation.mutate({...newDoctor} ,
      {
      onSuccess:()=>{
        handleClose();
      }
      }
    )
   }
  const handleClose = () => {
    onClose();
    setNewDoctor({
      name: "",
      email: "",
      phone: "",
      speciality: "",
      gender: "Male" as Gender,
      isActive: true
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>Add a new doctor to your practice.</DialogDescription>
          </DialogHeader>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor="new-name">Name *</Label>
              <Input
                id="new-name"
                value={newDoctor.name}
                onChange={(e)=>setNewDoctor({...newDoctor,name:e.target.value})}
                placeholder='Dr. Umair'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor="new-speciality">Speciality *</Label>
              <Input
                id="new-speciality"
                value={newDoctor.speciality}
                onChange={(e)=>setNewDoctor({...newDoctor,speciality:e.target.value})}
                placeholder='General Dentist'
              />
            </div>
          </div>

          <div className='space-y-2'>
              <Label htmlFor="new-name">Email *</Label>
              <Input
                id="new-email"
                value={newDoctor.email}
                onChange={(e)=>setNewDoctor({...newDoctor,email:e.target.value})}
                placeholder='doctor@example.com'
              />
          </div>
          <div className='space-y-2'>
              <Label htmlFor="new-name">Phone</Label>
              <Input
                id="new-phone"
                value={newDoctor.phone}
                onChange={(e)=>handlePhoneChange(e.target.value)}
                placeholder='+92 300 123 4567'
              />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor="status">Gender</Label>
              <Select value={newDoctor.gender || ""} onValueChange={(value)=>{setNewDoctor({...newDoctor,gender: value as Gender})}}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value='Female'>Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor="status">Status</Label>
              <Select value={newDoctor.isActive?"active":"inactive"} onValueChange={(value)=>setNewDoctor({...newDoctor,isActive: value === "active"})}>
                <SelectTrigger>
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>

        <DialogFooter>
            <Button variant="outline"  onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className='bg-primary hover:bg-primary/90'
            disabled={!newDoctor.name || !newDoctor.email || !newDoctor.speciality || createDoctorMutation.isPending}>
              {createDoctorMutation.isPending ? "Adding...":"Add Doctor"}
            </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}

export default AddDoctorDialog
