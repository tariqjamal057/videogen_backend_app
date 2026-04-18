export type IAuthAccessTokenPayload = {
    iss: string;
    aud: string;
    auth_time: number;
    sub: string;
    iat: number;
    name?: string;
    email?: string;
    exp: number;
    phone_number?: string;
    picture?: string;
    firebase: {
      identities: {
        phone?: string[];
      };
      sign_in_provider: string;
    };
  };
  