export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="mx-4">
            {children}
        </div>
    );
  }