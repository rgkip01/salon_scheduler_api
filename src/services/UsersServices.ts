import { UsersRepository } from "../repositories/UsersRepository";
import { ICreate } from "../interfaces/UsersInterface";
import { hash } from "bcrypt";

class UsersServices {
  private usersRepository: UsersRepository

  constructor(){
    this.usersRepository = new UsersRepository;
  }
  async create({name, email, password}: ICreate){
    const findByUser = await this.usersRepository.findUserByEmail(email)
    
    if(findByUser) {
      throw new Error('user already exists')
    }
    
    const hashPassword = await hash(password, 10)

    return this.usersRepository.create({
      name, 
      email,
      password: hashPassword
    })
  }
}

export { UsersServices };