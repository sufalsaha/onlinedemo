import { UserSession } from "./user-session";


export const adminSession = new UserSession<{
  userId: string;
  passwordUpdatedAt: string;
}>("admin");

// export const maintainerSession = new UserSession<{
//   userId: string;
//   passwordUpdatedAt: string;
// }>("maintainer");

export const userSession = new UserSession<{
  userId: string;
  passwordUpdatedAt: string;
  verified: boolean;
}>("user");
