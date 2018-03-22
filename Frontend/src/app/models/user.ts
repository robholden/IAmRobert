export class User {
  constructor (
    public name: string = '',
    public email: string = '',
    public username: string = '',
    public password: string = '',
    public date: Date = new Date(),
    public lastActiveDate: Date = null,
  ) {}
}
