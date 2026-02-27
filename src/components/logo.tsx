
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Sprout } from 'lucide-react';

const NewKrishiMitraLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" {...props}>
    <defs>
      <path id="curve-top" d="M 20,60 a 40,40 0 1,1 80,0" />
      <path id="curve-bottom" d="M 20,60 a 40,40 0 0,0 80,0" />
    </defs>
    
    {/* Outer border */}
    <circle cx="60" cy="60" r="58" fill="hsl(var(--primary))" />
    
    {/* Inner background */}
    <circle cx="60" cy="60" r="54" fill="#F0EAD6" />

    {/* Central Icon */}
    <foreignObject x="40" y="40" width="40" height="40" className="text-primary">
        <Sprout className="w-full h-full" strokeWidth={2}/>
    </foreignObject>
    
    {/* Top Text in Hindi */}
    <text style={{ fontSize: '18px', fontFamily: 'serif', fontWeight: 'bold', fill: '#5C4033', letterSpacing: '1px' }}>
      <textPath href="#curve-top" startOffset="50%" textAnchor="middle">
        कृषि मित्र
      </textPath>
    </text>

    {/* Bottom Text */}
    <text style={{ fontSize: '10px', fontFamily: 'serif', fontWeight: 'bold', fill: '#5C4033', letterSpacing: '2px'}}>
      <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">
        AGRI CONNECT
      </textPath>
    </text>

    {/* Side Flourishes */}
    <g transform="translate(32, 62) rotate(-30)" fill="#B8860B">
        <circle cx="0" cy="0" r="1.5"/>
        <circle cx="-4" cy="-4" r="1.5"/>
        <circle cx="4" cy="-4" r="1.5"/>
    </g>
    <g transform="translate(88, 62) rotate(30)" fill="#B8860B">
        <circle cx="0" cy="0" r="1.5"/>
        <circle cx="-4" cy="-4" r="1.5"/>
        <circle cx="4" cy="-4" r="1.5"/>
    </g>
  </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 transition-transform hover:scale-105 active:scale-95", className)}>
      <NewKrishiMitraLogo className="h-16 w-16" />
    </Link>
  );
}
