import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models /user.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth/auth.helper';
import { Experience } from './models /experience.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @InjectRepository(Experience)
  private readonly experienceRepository: Repository<Experience>;

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

  async getAllExperience(token: string) {
    const user = await this.getUserByToken(token);
    if (!user) {
      return;
    }

    return this.experienceRepository
      .createQueryBuilder('experience')
      .where('experience.userId = :id', { id: user.id })
      .getMany();
  }

  async addExperienceList(list: Experience[], token: string) {
    const user = await this.getUserByToken(token);
    if (!Array.isArray(list)) {
      throw new Error('List must be an array of Experience objects');
    }

    list.forEach((experience) => {
      experience.user = user;
    });

    return this.experienceRepository.save(list);
  }

  async deleteExperienceById(id: number) {
    const experienceToDelete = await this.experienceRepository.findOne({
      where: { id: id },
    });

    if (experienceToDelete) {
      await this.experienceRepository.remove(experienceToDelete);
      return true; // Indicate successful deletion
    } else {
      return false; // Indicate that no experience was found with the given ID
    }
  }

  async updateUser(token: string, user: User) {
    const _user = await this.getUserByToken(token);
    if (!_user) {
      return;
    }
    this.userRepository.merge(_user, { ...user });
    return this.userRepository.save(_user);
  }
}
