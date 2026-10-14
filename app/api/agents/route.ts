import {timingSafeEqual} from 'node:crypto';
import {NextResponse} from 'next/server';
import {healthCheckAgents,analyzeIncident,matchResources} from '../../../lib/agents';
import {isCoordinator,sameOrigin} from '../../../lib/session';
export const maxDuration=60;
export async function GET(){return NextResponse.json(healthCheckAgents(),{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:Request){if(!sameOrigin(req)||!await isCoordinator())return NextResponse.json({error:'Coordinator session required'},{status:403});try{const b=await req.text();if(b.length>8000)throw Error('Diagnostic input too large');const {agent,input,password}=JSON.parse(b);const expected=process.env.LIVE_DIAGNOSTICS_PASSWORD;if(!expected||typeof password!=='string'||password.length!==expected.length||!timingSafeEqual(Buffer.from(password),Buffer.from(expected)))return NextResponse.json({error:'Live diagnostics require the separate server-configured password.'},{status:403});if(!['intake','matcher'].includes(agent))throw Error('Invalid agent');return NextResponse.json(await (agent==='intake'?analyzeIncident:matchResources)(input))}catch(e){return NextResponse.json({error:e.name==='TimeoutError'?'Planner timed out after 50 seconds. Agents may be slow; simulation remains available.':e.message},{status:502})}}
