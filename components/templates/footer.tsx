import { TextLoop } from "@/components/motion-primitives/text-loop";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
         <TextLoop className='font-mono text-md'>
          © {new Date().getFullYear()} Rohithreacts.Dev All rights reserved.
        </TextLoop>

       
      </div>
    </footer>
  );
}