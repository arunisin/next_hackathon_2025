import { AuthTransition } from "./AuthTransition";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div
      className="w-full flex flex-col gap-12 items-center justify-center h-screen-minus-header"
    >
      <AuthTransition>
        {children}
      </AuthTransition>
    </div>
  );
}