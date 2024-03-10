import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { get_user_from_email } from "@/lib/database";

export default async function Home() {
  const authUser = await getServerSession(authOptions);
  const email = authUser?.user?.email || null
  if (email == null){
    redirect("/api/auth/signin")
  }
  const userDoc = await get_user_from_email(email)
  if (userDoc == false){
    redirect("/create-account")
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Dashboard
        </h1>
      </div>
      <div className="text-white dark:text-black w-[300px] h-[150px] font-mono uppercase bg-slate-500 dark:bg-slate-400 rounded-xl">
        <p>{userDoc.username}</p>
        <p>{userDoc.wins} wins</p>
        <p>{userDoc.losses} losses</p>
        <p>{userDoc.draws} draws</p>
        <p>{userDoc.currency} currency</p>
      </div>
    </section>
  )
}