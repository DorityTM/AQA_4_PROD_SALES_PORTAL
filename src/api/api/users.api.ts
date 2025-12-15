import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import { ICreateUserPayload, ICreateUserResponse } from "data/types/user.types";

export class UsersApi {
  constructor(private apiClient: IApiClient) {}

  async create(token: string, payload: ICreateUserPayload) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.users,
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    };
    return this.apiClient.send<ICreateUserResponse>(options);
  }

  async delete(token: string, _id: string) {
      const options: IRequestOptions = {
        baseURL: apiConfig.baseURL,
        url: apiConfig.endpoints.userById(_id),
        method: "delete",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      return await this.apiClient.send<ICreateUserResponse>(options);
    }
}