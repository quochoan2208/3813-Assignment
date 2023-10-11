export class User {
   
    username:string;
    email:string;
    pwd:string;
    valid:boolean;
    avatar?:string;
    role: string;
    id: number;
    constructor(username:string='',email:string='',pwd:string='',valid=false,avatar:string="",role:string="",id:number = 0 ){
       
        this.username = username;
        this.email = email;
        this.pwd=pwd;
        this.valid = valid;
        this.avatar = avatar;
        this.role = role;
        this.id = id;
    }
}
