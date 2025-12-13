import { EMAIL, MAP1, NUM, SOCIAL_LINKS } from "@/components/data/constants";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { Mail, MapIcon, Phone } from "lucide-react";
import Link from "next/link";



type SocialLink = {
  label: string;
  link: string;
};

interface MagneticSocialLinkProps {
  children: React.ReactNode;
  link: string;
}

const MagneticSocialLink: React.FC<MagneticSocialLinkProps> = ({
  children,
  link,
}) => {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex shrink-0 items-center gap-px rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
      </a>
    </Magnetic>
  );
};

const Connect: React.FC = () => {
  return (
    <section
      id="connect"
      className="grid grid-cols-1 mx-15 md:grid-cols-2 items-center gap-8"
    >
      <div>
        <h3 className="mb-5 text-lg font-medium">Connect</h3>
        <p className="mb-3 text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            <Link href={`mailto:${EMAIL}`} className="dark:text-zinc-300">
              {EMAIL}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            <Link
              href={`https://wa.me/918374200125`}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-zinc-300"
            >
              {NUM}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            <Link
              href={`https://maps.app.goo.gl/DdSNwn3oYpbFUPz56`}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-zinc-300"
            >
              {MAP1}
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap mt-5 gap-3">
          {SOCIAL_LINKS.map((link: SocialLink) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Connect;