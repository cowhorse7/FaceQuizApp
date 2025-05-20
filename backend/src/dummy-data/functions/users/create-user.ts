import { DummyFunction } from "@fhss-web-team/backend-utils/dummy";
import { DEFAULT_ROLE } from '../../../routes/api.roles.ts';
import { byuApi, keycloakApi } from '@fhss-web-team/backend-utils/apis';
import { userService } from '../../../services/user/user.ts';

export const createUser: DummyFunction<{ netId: string }> = {
  name: "Create user",
  description: "Creates a user from a netId",
  inputLabels: { netId: 'User\'s netId' },
  handler: async data => {
    if(!data.netId){
      throw new Error('netId is required')
    }
    const acct = (await byuApi.getBasicAccountsByNetId(data.netId))[0]
    if(!acct) {
      throw new Error('user not found')
    }
    const role = await keycloakApi.getAppRole(DEFAULT_ROLE);
    if(!role){
      throw new Error('role not found')
    }
    const user = await userService.createUser(acct, role)
    return user
  },
};