import { ClassSerializerInterceptor, Injectable, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./models /user.entity";
import { Repository } from "typeorm";
import { AuthHelper } from "./auth/auth.helper";

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  constructor(private auth: AuthHelper) {}

  async findSavedJobs(token: string) {
    const user = await this.auth.validateUser(token);
    return user.saved_jobs;
  }

  findUserById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: { saved_jobs: true, applications: true },
    });
  }

  update(user: User) {
    return this.userRepository.save(user);
  }

  async getUserByToken(token: string) {
    const user: { id: number } = await this.auth.decode(token.split(' ')[1]);
    return this.findUserById(user.id);
  }


}
