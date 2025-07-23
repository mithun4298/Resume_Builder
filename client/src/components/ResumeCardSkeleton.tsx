import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ResumeCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
      </CardContent>
    </Card>
  );
}