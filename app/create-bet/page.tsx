'use client'
 
import { useFormState } from 'react-dom'
import { createBetFunction } from '@/app/actions'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"



const initialState = {
  message: false,
};

 
export default function Signup() {
  const [state, formAction] = useFormState(
    createBetFunction,
    initialState
  );
 
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Create Bet
        </h1>
      </div>
      {state.message == true ? 
      <>
        <p>Bet made</p>
        <Link href="/dashboard" rel="noreferrer" className={buttonVariants() + " w-[100px]"}>Dashboard</Link>
        </>
      :
      <div>
        <form action={formAction}>
          <p className="text-red-500">{state.message}</p>
          <Input name="acceptor" id="acceptor" placeholder="username of acceptor" className="w-[200px] mb-3"/>
          <Input name="guarantor" id="guarantor" placeholder="username of guarantor" className="w-[200px] mb-3"/>
          <Input name="amount" id="amount" placeholder="bet amount" type="number" className="w-[200px] mb-3"/>
          <Input name="title" id="title" placeholder="title of bet" className="w-[200px] mb-3"/>
          <Textarea name="desc" id="desc" placeholder="description of bet" className="mb-3"/>
          <Button type="submit">create bet</Button>
        </form>
      </div>
      }
    </section>
  )
}