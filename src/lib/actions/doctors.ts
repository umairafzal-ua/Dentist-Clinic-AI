"use server"

import { Gender } from "@prisma/client"
import { prisma } from "../prisma"
import { generateAvatar } from "../utils"
import { revalidatePath } from "next/cache"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export async function getDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                _count: { select: { appointments: true } }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return doctors.map((doctor) => ({
            ...doctor,
            appointmentCount: doctor._count.appointments,
        }))
    } catch (error) {
        console.log("Error fetching doctors ", error)
        throw new Error("Failed to fetch Doctors ");

    }
}

interface CreateDoctorInput {
    name: string,
    email: string,
    phone: string,
    speciality: string,
    gender: Gender,
    isActive: boolean
}

export async function createDoctor(input: CreateDoctorInput) {
    try {
        if (!input.name || !input.email) {
            throw new Error("Name and Email are required");
        }

        const genderValue =
            input.gender.toUpperCase() === "MALE"
                ? Gender.MALE
                : input.gender.toUpperCase() === "FEMALE"
                    ? Gender.FEMALE
                    : undefined;

        if (!genderValue) {
            throw new Error("Invalid gender value");
        }

        const doctor = await prisma.doctor.create({
            data: {
                ...input,
                gender: genderValue,
                bio: "Not Provided yet",
                imageUrl: generateAvatar(input.name, input.gender)
            }
        })

        revalidatePath('/admin');
        return doctor;
    } catch (error: any) {
        console.log("Error creating doctor: ", error);
        if (error?.code === "P2002") {
            throw new Error("A doctor with this email already axists.");
        }
        throw new Error("Failed to create doctor.");
    }
}

interface UpdateDoctorInput extends Partial<CreateDoctorInput> {
    id: string
}
export async function updateDoctor(input: UpdateDoctorInput){
    try {
        if (!input.name || !input.email) {
            throw new Error("Name and Email are required");
        }

        const currentDoctor=await prisma.doctor.findUnique({
            where:{id:input.id},
            select:{email:true}
        })
        if (!currentDoctor) {
            throw new Error("Doctor not found");
        }

        // if email is being updated, check for uniqueness
        if (input.email !== currentDoctor.email) {
            const existingDoctor=await prisma.doctor.findUnique({
                where:{email:input.email}
            })
            if (existingDoctor) {
                throw new Error("A doctor with this email already exists.");
            }
        }

        const doctor=await prisma.doctor.update({
            where:{id:input.id},
            data:{
                name:input.name,
                email:input.email,
                phone:input.phone,
                speciality:input.speciality,
                gender:input.gender,
                isActive:input.isActive
            }
        })
        return doctor;
    } catch (error) {
        console.log("Error Updating doctor: ",error);
        throw new Error("Failed to update doctor.");
    }
}

export async function getAvailableDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { appointments: true },
          
        },
      },
      orderBy: { name: "asc" },
    });

    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.error("Error fetching available doctors:", error);
    throw new Error("Failed to fetch available doctors");
  }
}

