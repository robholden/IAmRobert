import { User } from './user';

export class Post {
  constructor(
    public heading: string = '',
    public blurb: string = '',
    public body: string = '',
    public slug: string = '',
    public creationDate: Date = new Date(),
    public modifiedDate: Date = new Date(),
    public user: User
  ) {}
}