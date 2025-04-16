import Link from "next/link";
import { Compass, Map, BookmarkIcon, UserCircle } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-6">
      <div className="max-w-xl mx-auto">
        <ul className="flex justify-between items-center">
          <li>
            <Link
              href="/"
              className="flex flex-col items-center text-gray-600 hover:text-primary"
            >
              <Compass className="w-6 h-6" />
              <span className="text-xs mt-1">Explore</span>
            </Link>
          </li>
          <li>
            <Link
              href="/places"
              className="flex flex-col items-center text-gray-600 hover:text-primary"
            >
              <Map className="w-6 h-6" />
              <span className="text-xs mt-1">Places</span>
            </Link>
          </li>
          <li>
            <Link
              href="/saved"
              className="flex flex-col items-center text-gray-600 hover:text-primary"
            >
              <BookmarkIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Saved</span>
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="flex flex-col items-center text-gray-600 hover:text-primary"
            >
              <UserCircle className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
