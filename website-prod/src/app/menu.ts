import { NbMenuItem } from '@nebular/theme';

export const menu: NbMenuItem[] = [
	{
		title: 'Home',
		icon: 'home',
		link: '/dashboard',
	},
	{
		title: 'Pool',
		icon: 'swimming-pool',
		link: '/pool',
		pathMatch: 'prefix',
	},
	{
		title: 'Sous Vide',
		icon: 'utensils',
		link: '/sous-vide',
		pathMatch: 'prefix',
	},
	// {
	// 	title: 'Usage',
	// 	icon: 'faucet',
	// 	link: '/sprinklers',
	// 	pathMatch: 'prefix',
	// },
	{
		title: 'Zones',
		icon: 'draw-polygon',
		link: '/zones',
		pathMatch: 'prefix',
	},
	{
		title: 'Schedule',
		icon: 'calendar',
		link: '/schedule',
		pathMatch: 'prefix',
	},
	{
		title: 'Weather',
		icon: 'cloud',
		link: '/weather',
		pathMatch: 'prefix',
	},
	{
		title: 'Troubleshoot',
		icon: 'bug',
		link: '/troubleshoot',
		pathMatch: 'prefix',
	},
	{
		title: 'Test',
		icon: 'laptop-code',
		link: '/test',
		pathMatch: 'prefix',
	},
];
