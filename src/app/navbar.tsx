import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton
} from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { ClipboardList, Home, LayoutDashboard, Menu, Users } from 'lucide-react';
import Link from 'next/link';

import LogoIcon from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navigationMenuItems = [
	{
		icon: Home,
		label: 'Дома',
		href: '/',
	},
	{
		icon: ClipboardList,
		label: 'Мои Пријави',
		href: '/reports',
	},
	{
		icon: Users,
		label: 'За Нас',
		href: '/about',
	},
];

const adminNavigationItems = [
	{
		icon: LayoutDashboard,
		label: 'Админ',
		href: '/dashboard',
	}
];

export async function Navbar() {
	const currUser = await currentUser();

	const isAdmin = currUser?.publicMetadata.role === 'admin';
	const navigationItems = isAdmin ? [...navigationMenuItems, ...adminNavigationItems] : navigationMenuItems;

	return (
		<div className='fixed top-0 left-0 z-40 w-full h-navbar bg-background/90 border backdrop-blur-[4px]'>
			<div className="w-full h-full px-4 sm:px-6 py-3 container max-w-screen-lg grid grid-cols-[1fr_auto_auto] lg:grid-cols-[1fr_auto_1fr] gap-3 items-center">
				<Link href='/' className='flex-1 flex flex-row gap-3 items-center'>
					<LogoIcon className='size-9 sm:size-11' withBackground />
					<span className='text-white text-xl sm:text-2xl font-bold'>Без Азбест</span>
				</Link>

				<SignedOut>
					<SignInButton>
						<Button variant='secondary' className='-col-start-1 col-span-1'>Логирај се</Button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<div className="lg:flex-1 h-full">
						<NavigationMenu className='hidden lg:flex items-center justify-center h-full'>
							<NavigationMenuList>
								{navigationItems.map((item) => (
									<NavigationMenuItem key={item.label}>
										<Link href={item.href} legacyBehavior passHref>
											<NavigationMenuLink className={navigationMenuTriggerStyle()}>
												<item.icon className='size-6 mr-2' />{item.label}
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>

						<DropdownMenu>
							<div className="lg:hidden h-full">
								<DropdownMenuTrigger asChild>
									<Button variant='outline' className='h-full aspect-square p-3'>
										<Menu className='size-full' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className='min-w-[17ch]'>
									{navigationItems.map((item) => (
										<DropdownMenuItem key={item.label} asChild>
											<Button variant='ghost' className='w-full flex items-center justify-start py-3 h-auto' asChild>
												<Link href={item.href}>
													<item.icon className='size-6 mr-2' />{item.label}
												</Link>
											</Button>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</div>
						</DropdownMenu>
					</div>

					<div className="w-full h-full flex items-center justify-end">
						<UserButton appearance={{
							elements: {
								avatarBox: {
									width: '3rem',
									height: '3rem',
								}
							}
						}}>
						</UserButton>
					</div>
				</SignedIn>
			</div>
		</div>
	);
}