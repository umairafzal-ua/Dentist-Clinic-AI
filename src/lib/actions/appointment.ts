"use server"
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma"

export async function getAppointments() {
    try {
        const appointments=await prisma.appointment.findMany({
            include:{
                user:{
                    select:{
                        firstName:true,
                        lastName:true,
                        email:true,
                    }
                },
                doctor:{
                    select:{
                        name:true,
                        imageUrl:true,
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return appointments;
    } catch (error) {
        console.log("Error fetching appointments ", error)
        throw new Error("Failed to fetch Appointments ");
    }
}

export async function getUserAppointmentStats(){
    try {
        const {userId}=await auth()
        if (!userId) {
            throw new Error("You must be authenticated")
        }
        const user = await prisma.user.findUnique({where:{clerkId:userId}})
        if(!user){
            throw new Error("User not found");
        }
        const [totalCount,completedCount]=await Promise.all([
             prisma.appointment.count({
                where:{userId:user.id}
            }),
            prisma.appointment.count({
                where:{userId:user.id,status:"COMPLETED"}
            })
        ]);
        return{
            totalAppointments:totalCount,
            completedAppointments:completedCount
        }
    } catch {
        return {totalAppointments:0,completedAppointments:0}
    }
}


interface AppointmentData {
    user: { firstName: string | null; lastName: string | null; email: string };
    doctor: { name: string; imageUrl: string | null };
    date: Date;
    [key: string]: unknown;
}

function transformAppointment(appointment: AppointmentData) {
  return {
    ...appointment,
    patientName: `${appointment.user.firstName || ""} ${appointment.user.lastName || ""}`.trim(),
    patientEmail: appointment.user.email,
    doctorName: appointment.doctor.name,
    doctorImageUrl: appointment.doctor.imageUrl || "",
    date: appointment.date.toISOString().split("T")[0],
  };
}

export async function getUserAppointments(){
    try {
        const {userId}=await auth()
        if (!userId) {
            throw new Error("You must be logged in to view appointments")
        }
        const user = await prisma.user.findUnique({where:{clerkId:userId}})
        if (!user) {
            throw new Error("User Not found. Please ensure you account is properly set up.  ")
        }
        const appointments=await prisma.appointment.findMany({
            where:{userId:user.id},
            include:{
                user:{select:{firstName:true,lastName:true,email:true}},
                doctor:{select:{name:true,imageUrl:true}},
            },
            orderBy:[{date:"asc"},{time:"asc"}]
        })
        return appointments.map(transformAppointment)
    } catch (error) {
        console.log("Error fetching user Appointments ",error)
        throw new Error('Failed to fetch user appointments')
    }
}

export async function getBookedTimeSlots(doctorId:string,date:string){
    try {   
        const appointments=await prisma.appointment.findMany({
            where:{
                doctorId,
                date:new Date(date),
                status:{
                    in:["CONFIRMED","COMPLETED"], // Consider both confirmed and completed appointments as blocking
                }
            },
            select:{time:true},
        });
        return appointments.map((appointment)=>appointment.time)
    } catch (error) {
        console.log("Error fetching booked time slots:",error)
        return []; //return empty array if there is any error

    }
}
interface BookAppointmentInput{
    doctorId:string,
    date:string,
    time:string,
    reason?:string,
}

export async function bookAppointment(input:BookAppointmentInput){
    try {
        const {userId}=await auth()
        if (!userId) {
            throw new Error("You must be logged in to book an appointment")
        }
        if (!input.doctorId || !input.date || !input.time) {
            throw new Error("Doctor, date and time are required")
        }

        const user=await prisma.user.findUnique({where:{clerkId:userId}})
        if (!user) {
            throw new Error("User not found")
        }

        const appointment= await prisma.appointment.create({
            data:{
                userId:user.id,
                doctorId:input.doctorId,
                date:new Date (input.date),
                time:input.time,
                reason:input.reason || "General Consultation",
                status:"CONFIRMED",
            },
            include:{
                user:{
                    select:{
                        firstName:true,
                        lastName:true,
                        email:true,
                    },
                },
                doctor:{ select:{name:true,imageUrl:true}}
            }
        })
        return transformAppointment(appointment)
    } catch (error) {
        console.log("Error booking appointments: ",error)
        throw new Error("Failed to book appointment.please try again")
    }
}