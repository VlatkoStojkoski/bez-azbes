import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton
} from '@clerk/nextjs';
import Link from 'next/link';

import LogoIcon from '@/components/icons/logo';
import { Button } from '@/components/ui/button';

export function Navbar() {
	return (
		<div className='fixed top-0 left-0 z-40 w-full h-navbar bg-background/90 border backdrop-blur-[4px]'>
			<div className="w-full h-full px-4 sm:px-6 py-3 container max-w-screen-lg flex items-center justify-between">
				<Link href='/'>
					<div className='flex flex-row gap-3 items-center'>
						<LogoIcon className='size-9 sm:size-11' withBackground />
						<span className='text-white text-xl sm:text-2xl font-bold'>Без Азбест</span>
					</div>
				</Link>

				<SignedOut>
					<SignInButton>
						<Button>Логирај се</Button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<UserButton appearance={{
						elements: {
							avatarBox: {
								width: '3rem',
								height: '3rem',
							}
						}
					}}>
					</UserButton>
				</SignedIn>
			</div>
		</div>
	);
}