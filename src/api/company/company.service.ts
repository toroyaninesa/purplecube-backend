import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { UserService } from '../user/user.service';
import ERole from '../user/auth/role/role.enum';

@Injectable()
export class CompanyService {
  @InjectRepository(Company)
  readonly companyRepository: Repository<Company>;

  constructor(private userService: UserService) {}

  async create(createCompanyDto: CreateCompanyDto, token: string) {
    const user = await this.userService.getUserByToken(token);
    if (user.company) {
      return;
    }
    const company: Company = await this.companyRepository.save(
      createCompanyDto,
    );
    user.company = company;
    await this.userService.updateUser(token, user);
    return company;
  }

  async findAll(limit: number, skip: number) {
    const query = this.companyRepository
      .createQueryBuilder('company')
      .orderBy('company.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    const count = await query.getCount();

    return { count, jobs: await query.getMany() };
  }

  findOne(id: number) {
    return this.companyRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto, token: string) {
    const company = await this.findOne(id);
    const user = await this.userService.getUserByToken(token);
    if (!company) {
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }
    if (user.role === ERole.Company && user.company.id !== company.id) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
    this.companyRepository.merge(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.findOne(id);
    if (!company) {
      throw new NotFoundException('Not found');
    }
    return this.companyRepository.remove(company);
  }
}
