import {
  adminSession,
  userSession,
} from "./app-user-session";
import { prisma } from "../prisma";


export async function getCurrentAdmin() {
  const sessionUser = await adminSession.getUser();
  if (!sessionUser) return null;

  const user = await prisma.admin.findUnique({
    where: { id: sessionUser.userId },
    select: { id: true, email: true, firstName: true, lastName: true, passwordUpdatedAt: true },
  });

  if (sessionUser.passwordUpdatedAt === user?.passwordUpdatedAt.toISOString()) {
    return user;
  } else {
    return null;
  }
}



export async function getCurrentUser() {
  const sessionUser = await userSession.getUser();
  if (!sessionUser) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.userId,
    },
    // Deliberately excludes password and both OTP fields — this object gets
    // passed down to components, and live codes must not travel with it.
    select: {
      id: true,
      email: true,
      fullName: true,
      image: true,
      passwordUpdatedAt: true,
      verified: true,
    },
  });

  if (
    user &&
    sessionUser.passwordUpdatedAt === user.passwordUpdatedAt.toISOString()
  ) {
    return user;
  }

  return null;
}



// export async function getCurrentMaintainer() {
//   const sessionUser = await maintainerSession.getUser();
//   if (!sessionUser) return null;
//   const user = await prisma.maintainer.findUnique({
//     where: { id: sessionUser.userId },
//     select: { id: true, email: true, fullName: true, passwordUpdatedAt: true },
//   });

//   if (sessionUser.passwordUpdatedAt === user?.passwordUpdatedAt.toISOString()) {
//     return user;
//   } else {
//     return null;
//   }
// }

// export async function getCurrentUser() {
//   const sessionUser = await userSession.getUser();
//   if (!sessionUser) return null;
//   await connectMongoDB();

//   const user = await User.findById(sessionUser.userId).select([
//     "email",
//     "firstName",
//     "lastName",
//     "passwordUpdatedAt",
//     "credit",
//     "verified",
//     "verificationOtpSendAt",
//     "subscriptionPlan",
//   ]);

//   if (sessionUser.passwordUpdatedAt === user?.passwordUpdatedAt.toISOString()) {
//     return user;
//   } else {
//     return null;
//   }
// }
