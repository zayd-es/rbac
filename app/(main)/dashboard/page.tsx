import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (user.role === "MANAGER") {
    redirect("/dashboard/manager");
  } else {
    redirect("/dashboard/user");
  }
};

export default DashboardPage;
