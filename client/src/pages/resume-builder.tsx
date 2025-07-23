import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useLocation } from "wouter";

export default function ResumeBuilder() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Resume Builder
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Coming Soon! 🚀
          </p>
          <p className="text-slate-500 mb-8">
            We're working hard to bring you an amazing resume building experience.
          </p>
          <Button onClick={() => navigate("/")}>
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}
