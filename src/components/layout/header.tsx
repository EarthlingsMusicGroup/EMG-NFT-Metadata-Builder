import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="border-b relative border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-6 w-6">
              <Image
                src="/logo.webp"
                alt="EMG Logo"
                fill
                className="object-contain dark:invert"
                priority
              />
            </div>
            <span className="font-mono text-lg font-bold">EMG</span>
          </Link>

          <div className="flex items-center gap-2">
            <CreateProjectDialog />
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
