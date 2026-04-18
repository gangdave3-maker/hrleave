//import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="welcome min-h-screen relative">
      
        <button className="btn btn-success md:btn-lg hover:bg-blue-500! font-bold! text-xl md:text-5xl! fixed bottom-1/5 right-1/5 top-auto left-auto"><Link href={'/login'} className="text-white no-underline!">Enter</Link></button>
      
    </div>
  );
}
