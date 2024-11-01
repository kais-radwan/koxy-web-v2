import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginButtons from "@/components/login-buttons";
import LoginSide from "@/components/login-side";
import { Title } from "@tailus-ui/typography";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) return redirect("/app");

  return (
    <div className="w-full h-screen flex fixed top-0 left-0">
      <LoginSide />
      <div className="min-w-[50%] max-w-[50%] h-full p-6 flex flex-col items-center justify-center gap-3 text-center border-1 border-r-0 relative before:absolute before:inset-0 before:-z-40 before:[background-image:url('/grainy-bg.svg')] before:opacity-[0.020]">
        <Title>Welcome to Koxy AI</Title>
        <p className="text-sm opacity-70 mb-12">
          The future of Serverless AI-powered development
        </p>
        <LoginButtons />
        <div className="text-xs opacity-70 mt-2">
          By continue you agree to our{" "}
          <span className="text-primary underline">Terms of Service</span> and{" "}
          <span className="text-primary underline">Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}
