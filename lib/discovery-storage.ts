import {personas,questions,type Persona,type Answers} from './mythra';
export type Draft={persona:Persona|null;step:number;answers:Answers;contact:Record<string,string>;consent:boolean};
export const draftKey='mythra-discovery-v1';
export const blankDraft:Draft={persona:null,step:0,answers:{},contact:{},consent:false};
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function restoreDraft(raw:string|null):Draft{
 try{
  const v:unknown=JSON.parse(raw||'null');if(!object(v))return {...blankDraft};
  const persona=personas.some(p=>p.id===v.persona)?v.persona as Persona:null;
  const answers=object(v.answers)?Object.fromEntries(Object.entries(v.answers).filter(([,x])=>typeof x==='string'||Array.isArray(x)&&x.every(i=>typeof i==='string'))):{};
  const contact=object(v.contact)?Object.fromEntries(Object.entries(v.contact).filter(([,x])=>typeof x==='string')):{};
  return {persona,step:persona&&Number.isInteger(v.step)?Math.max(0,Math.min(v.step as number,questions[persona].length)):0,answers:answers as Answers,contact:contact as Record<string,string>,consent:v.consent===true};
 }catch{return {...blankDraft}}
}
