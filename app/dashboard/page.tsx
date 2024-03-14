import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { get_user_from_email, get_acceptor_bets, get_starter_bets } from "@/lib/database";

type Bet = {
  title: String,
  desc: String,
  amount: Number,
  starter: String,
  acceptor: String,
  guarantor: String,
  status: Boolean
}

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
  const acceptorBets = await get_acceptor_bets(userDoc.username);
  const starterBets = await get_starter_bets(userDoc.username);
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
      {starterBets.map((bet: Bet) =>
        <>
          {bet.status == false ? 
          <p>You have started a bet with {bet.acceptor} for {bet.title}. You are waiting for them to accept.</p>
          :
          <p>You are doing a bet with {bet.acceptor} for {bet.title}</p>}
        </>
      )}
      {acceptorBets.map((bet: Bet) =>
        <>
          {bet.status == false ? 
          <p>{bet.starter} has requested to do a bet with you about {bet.title} for {String(bet.amount)}. Accept or deny</p>
          :
          <p>You are doing a bet with {bet.starter} for {bet.title}</p>}
        </>
      )}
    </section>
  )
}