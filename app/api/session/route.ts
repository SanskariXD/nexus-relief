import {NextResponse} from 'next/server';
import {isCoordinator,makeSession,sameOrigin} from '../../../lib/session';
export async function GET(){return NextResponse.json({coordinator:await isCoordinator(),scope:'Isolated browser-local simulation'},{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:Request){if(!sameOrigin(req))return NextResponse.json({error:'Origin rejected'},{status:403});try{const res=NextResponse.json({coordinator:true});res.cookies.set('nexus-demo',makeSession(),{httpOnly:true,sameSite:'strict',secure:new URL(req.url).protocol==='https:',maxAge:3600,path:'/'});return res;}catch(e){return NextResponse.json({error:e.message},{status:503})}}
export async function DELETE(req:Request){if(!sameOrigin(req))return NextResponse.json({error:'Origin rejected'},{status:403});const res=NextResponse.json({coordinator:false});res.cookies.delete('nexus-demo');return res;}
