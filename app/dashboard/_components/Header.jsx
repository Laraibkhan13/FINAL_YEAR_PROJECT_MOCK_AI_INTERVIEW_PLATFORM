"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Header() {
    const { user } = useUser()

    return (
        <div className='flex p-4 items-center justify-around bg-secondary shadow-sm'>
            <Link href='/dashboard'>
                <h2 className='text-3xl font-bold text-primary flex gap-5'> <Image width={30} height={30} src={'/logo.png'} alt='logo' /> Mock AI InterView</h2>
            </Link>
            <div className='flex gap-5'>
                <h2 className='hidden md:flex text-md font-bold '>
                    {user?.primaryEmailAddress?.emailAddress}
                </h2>
                <UserButton />
            </div>
        </div>
    )
}

export default Header