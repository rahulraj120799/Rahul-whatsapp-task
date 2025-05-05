import { get } from 'lodash';

export const roleAccess = {
  whatsAppUser: {
    onboard: {
      view: true,
    },
    whatsapp: {
      view: true,
    },
  },
};

export const getRole = (session: any) => {
  if (session?.user?.name?.role) {
    return session?.user?.name?.role;
  }
  return '';
};

export const getSessionParams = (session: any, name: string) => {
  if (session?.user?.name) {
    return get(session, `user.name.${name}`, '').toString();
  }
  return '';
};

export const roles = {
  whatsAppUser: 'whatsAppUser',
};
