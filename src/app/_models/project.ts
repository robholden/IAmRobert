export class Project {
	constructor (
		public title: string = '',
		public slug: string = '',
		public heading: string = '',
		public sub: string = '',
		public content: string = '',
		public slides: string[] = []
	) {}
}