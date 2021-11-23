import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { UserRole } from 'src/users/decorator/user.enum';
import { UserToClassService } from '../user-to-class.service';
import { ROLES_KEY } from './roles.decorator';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private classroomsService: ClassroomsService,
    private userToClassService: UserToClassService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const { id } = context.switchToHttp().getRequest().params;
    const userToClasses = await this.userToClassService.findAllByRoles(
      id,
      requiredRoles,
    );
    if (userToClasses)
      return userToClasses.some(
        (userToClass) =>
          userToClass.userId == user.id &&
          requiredRoles?.includes(userToClass.role),
      );
    return false;
  }
}
