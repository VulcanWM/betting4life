'use server'

import { create_user, get_user_from_email, create_bet } from "@/lib/database"
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function createUserFunction(prevState: { message: string } | { message: boolean }, formData: FormData) {
    const username = formData.get("username") as string
    const authUser = await getServerSession(authOptions);
    const email = authUser?.user?.email || null
    if (email == null){
        return {message: "You are not logged in"}
    } else {
        const user_from_email = await get_user_from_email(email)
        if (user_from_email != false){
            return {message: true}
        }
        const func = await create_user(username, email as string)
        return {message: func}
    }
}

export async function createBetFunction(prevState: { message: string } | { message: boolean }, formData: FormData) {
    const acceptor = formData.get("acceptor") as string;
    const guarantor = formData.get("guarantor") as string;
    const amount = parseInt(formData.get("amount") as string)
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const authUser = await getServerSession(authOptions);
    const email = authUser?.user?.email || null
    if (email == null){
        return {message: "You are not logged in"}
    } else {
        const user = await get_user_from_email(email)
        if (user == false){
            return {message: "You do not have an account"}
        } else {
            const starter = user.username;
            const func = await create_bet(starter, acceptor, guarantor, amount, title, desc)
            return {message: func}
        }
    }
}