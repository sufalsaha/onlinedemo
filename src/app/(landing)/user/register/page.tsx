import { RegisterForm } from "@/components/user/register-from";

export default async function Page() {
  // await register();
  return (
    <div className="flex  w-full items-center justify-center p-6 md:p-15">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}