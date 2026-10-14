import Workspace from '../workspace';
import {notFound} from 'next/navigation';
export default async function Page({params}){const {section}=await params;if(!['incidents','report','map','volunteers','resources','missions','agents','coordinator'].includes(section))notFound();return <Workspace section={section}/>}
