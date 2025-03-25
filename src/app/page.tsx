// import AppLogo from '@/components/shared/app-logo'
import LoginForm from "@/components/shared/login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Dashboard from "./(dashboard)/page";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[url(/bgImg.jpg)] bg-cover bg-center bg-no-repeat">
      <main className="w-full max-w-md mx-auto">
        <Card className="mt-5">
          {/* <CardHeader className="space-y-4 flex justify-center items-center">
            <AppLogo />
          </CardHeader> */}
          {/* <CardContent className="space-y-4"> */}
          {/* <LoginForm /> */}
          <Dashboard />
          {/* </CardContent> */}
        </Card>
      </main>
    </div>
  );
}
