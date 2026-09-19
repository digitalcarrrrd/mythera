import {Result} from '@/components/mythra';
import {personas,type Persona} from '@/lib/mythra';
import {notFound} from 'next/navigation';
export default async function Page({params}:{params:Promise<{persona:string}>}){const {persona}=await params;const p=persona.toUpperCase() as Persona;if(!personas.some(x=>x.id===p))notFound();return <Result persona={p}/>}
