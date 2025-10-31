import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { RootState } from "../redux/store";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { role } = useSelector((state: RootState) => state.auth);
  const [status, setStatus] = useState<"checking" | "allowed" | "redirect">("checking");

  useEffect(() => {
    if (!role) {
      toast.error("You must be logged in to access this page");
      setStatus("redirect");
    } else if (allowedRoles && !allowedRoles.includes(role)) {
      toast.error("You are not authorized to view this page");
      setStatus("redirect");
    } else {
      setStatus("allowed");
    }
  }, [role, allowedRoles]);

  if (status === "checking") return null;

  if (status === "redirect") {
    return <Navigate to={'/auth'} replace />;
  }

  return <Outlet />;
}
