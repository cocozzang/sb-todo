import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/user/entity';

export const ACCESS_LEVEL_KEY = 'access_level';

/**
 * controller 내부 method나 class 자체에 사용할 수 있는 decorator
 * api의 권한제한을 걸 수 있다.
 *
 * @param {RoleEnum} role - 권한 수준이 role과 같거나 그 이상인 user만 접근가능
 *
 *
 * @example ```
 * \@AccessLevel(RoleEnum.SUB_ADMIN)
 * \@useGuard(RoleGuard) // global guard
 * \@Get('test')
 * someApi(){ ... } // 해당 api는 권한이 SUB_ADMIN이상인 유저만 접근가능하게 된다.
 * ```
 */
export const AccessLevel = (role: RoleEnum) =>
  SetMetadata(ACCESS_LEVEL_KEY, role);
