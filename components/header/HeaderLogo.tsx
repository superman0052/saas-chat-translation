import LogoImage from "@logos/logo.svg";
import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/" className="overflow-hidden" prefetch={false}>
      <div className="flex items-center w-72 h-14">
        <AspectRatio
          ratio={16 / 9}
          className="flex items-center justify-center"
        >
          <Image
            priority
            className="dark:filter dark:invert"
            src={LogoImage}
            alt="Chat With Anyone"
          />
        </AspectRatio>
      </div>
    </Link>
  );
}

export default Logo;
