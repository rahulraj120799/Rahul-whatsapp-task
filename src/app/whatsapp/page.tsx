import HomePage from '@/components/whatsapp/main';
import { getUserDetails } from '@/service/user/serverSession';
import { getSessionParams } from '@/utils/auth/roleAccess';
import { loginIsRequiredServer } from '@/utils/auth/session';

export default async function WhatsApp() {
  const session = await loginIsRequiredServer({
    navPath: 'whatsapp',
    redirectUrl: '/login',
  });
  const userDetails = await getUserDetails({
    id: getSessionParams(session, 'userId'),
  });
  return <HomePage userDetails={JSON.parse(userDetails)?.data} />;
}
