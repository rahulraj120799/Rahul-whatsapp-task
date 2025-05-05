import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authConfig } from '@/server/libs/auth';
import { getRole, roleAccess } from './roleAccess';
import { get, isEmpty } from 'lodash';

export async function loginIsRequiredServer({
  navPath,
  isPublicRoute = false,
  redirectUrl = '',
  isAdmin = false,
}: {
  navPath?: string;
  isPublicRoute?: boolean;
  redirectUrl: string;
  isAdmin?: boolean;
}) {
  const session = await getServerSession(authConfig);
  if (isPublicRoute) return session;
  if (!session) return redirect(redirectUrl);
  if (
    (isAdmin &&
      get(session, 'user.email', '') === process.env.NEXT_ADMIN_EMAILID) ||
    ''
  ) {
    return session;
  }
  const role = getRole(session);
  if (!role || !get(roleAccess, `${role}.${navPath}.view`, false))
    return redirect(redirectUrl);
  return session;
}

export async function validateAPIRoute({
  role = [],
  isPublicRoute = false,
}: any) {
  const session = await getServerSession(authConfig);
  if (isPublicRoute) {
    return { publicRoute: true, isAuthorized: true, message: 'Public Route' };
  }
  if (!session?.user?.name) {
    return { isAuthorized: false, message: 'Session does not exists' };
  }
  const loggedUserRole = getRole(session);
  if (!isEmpty(role)) {
    return role.includes(loggedUserRole)
      ? { isAuthorized: true, session, message: 'Authenticated by role' }
      : { isAuthorized: false, message: 'Role does not match' };
  }
  return { isAuthorized: true, session, message: 'Authenticated' };
}
