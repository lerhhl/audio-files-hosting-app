import { LOGIN_PATH } from "@/app/constants";
import ReactSwagger from "@/components/ReactSwagger";
import { getApiDocs } from "@/lib/swagger";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function IndexPage() {
  const currentHost = (await headers()).get("host");

  if (!currentHost?.includes("localhost")) {
    redirect(LOGIN_PATH);
  }

  const spec = await getApiDocs();

  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
