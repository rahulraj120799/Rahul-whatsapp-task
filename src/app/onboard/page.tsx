import { redirect } from 'next/navigation';
import OnboardForm from '@/components/onboard';
import { getUserDetails } from '@/service/user/serverSession';
import { getSessionParams } from '@/utils/auth/roleAccess';
import { loginIsRequiredServer } from '@/utils/auth/session';

export default async function WhatsAppLoginComponent() {
  const session = await loginIsRequiredServer({
    navPath: 'onboard',
    redirectUrl: '/login',
  });
  const userDetails = await getUserDetails({
    id: getSessionParams(session, 'userId'),
  });
  const parsedUserDetails = JSON.parse(userDetails)?.data;
  if (parsedUserDetails?.isSignedIn) {
    redirect('/whatsapp');
  }
  return <OnboardForm userDetails={parsedUserDetails} />;
}
