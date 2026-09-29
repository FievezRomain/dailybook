export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  RegisterMethod: undefined;
  RegisterIdentity: undefined;
  RegisterSecurity: undefined;
  VerifyEmail: undefined;
  ForgotPassword: { initialEmail?: string } | undefined;
};
