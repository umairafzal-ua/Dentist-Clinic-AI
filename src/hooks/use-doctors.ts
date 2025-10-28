"use client"
import { createDoctor, getDoctors, updateDoctor } from "@/lib/actions/doctors";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export function useGetDoctors(){
    const result = useQuery({
        queryKey:["getDoctors"],
        queryFn:getDoctors
    })
    return result; 
}

export function useCreateDoctor(){
    const queryClient=useQueryClient();
    const result=useMutation({
      mutationFn:createDoctor,  
      // used to refresh the doctors list after a new doctor is created
      onSuccess:()=>{
        queryClient.invalidateQueries({queryKey: ["getDoctors"]});
      },
      onError:(error)=>{console.log("Error while creating a doctor: ",error)}
    })

    return result;
}
export function useUpdateDoctor(){
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:updateDoctor,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["getDoctors"]});
        },
        onError:(error)=>{console.log("Error while updating doctor: ",error)}
    })
}