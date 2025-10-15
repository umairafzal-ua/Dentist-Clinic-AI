"use client"
import { syncUser } from '@/lib/actions/users'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { useEffect } from 'react'

function userSync() {
    const { isSignedIn, isLoaded } = useUser()

    useEffect(() => {
        const handleUserSync = async () => {
            if (isLoaded && isSignedIn) {
                try {
                    await syncUser();
                } catch (error) {
                    console.log(error)
                }
            }
        }
        handleUserSync()
    }, [isLoaded, isSignedIn])
    return null;

}
export default userSync
