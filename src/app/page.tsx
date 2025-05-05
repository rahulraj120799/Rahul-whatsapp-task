import { redirect } from 'next/navigation';
import { loginIsRequiredServer } from '@/utils/auth/session';

export default async function WhatsApp() {
  const session = await loginIsRequiredServer({
    navPath: 'whatsapp',
    redirectUrl: '/login',
  });
  redirect('/whatsapp');
  return <></>;
}
