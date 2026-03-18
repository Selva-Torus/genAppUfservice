export const FusionAuthTenantCreation = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  tenantId: string,
  tenantName: string,
) => {
  const tenantResponse = await fetch(
    `${fusionAuthBaseUrl}/api/tenant/${tenantId}`,
    {
      method: 'POST',
      headers: {
        Authorization: fusionAuthApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenant: {
          id: tenantId,
          name: tenantName,
        },
      }),
    },
  );

  if (!tenantResponse.ok) {
    const errorText = await tenantResponse.text();
    throw errorText;
  }
};

export const FusionAuthTenantDeletion = async (fusionAuthBaseUrl: string, fusionAuthApiKey: string, tenantId: string) => {
  await fetch(`${fusionAuthBaseUrl}/api/tenant/${tenantId}`, {
    method: 'DELETE',
    headers: {
      Authorization: fusionAuthApiKey,
    },
  });
};

export const FusionAuthApplicationCreationWithRole = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  applicationId: string,
  tenantId: string,
  roles: any[],
  applicationName: string,
) => {
  const applicationResponse = await fetch(
    `${fusionAuthBaseUrl}/api/application/${applicationId}`,
    {
      method: 'POST',
      headers: {
        Authorization: fusionAuthApiKey,
        'Content-Type': 'application/json',
        'X-FusionAuth-TenantId': tenantId,
      },
      body: JSON.stringify({
        application: {
          id: applicationId,
          name: applicationName,
          roles,
          jwtConfiguration: {
            enabled: true,
            timeToLiveInSeconds: process.env.FUSIONAUTH_ACCESSTOKEN_EXPIRY_TIME,
            refreshTokenTimeToLiveInMinutes:
              process.env.FUSIONAUTH_REFRESHTOKEN_EXPIRY_TIME,
            refreshTokenUsagePolicy: 'Reusable',
          },
          oauthConfiguration: {
            generateRefreshTokens: true,
            refreshTokenTimeToLiveInMinutes:
              process.env.FUSIONAUTH_REFRESHTOKEN_EXPIRY_TIME,
            enabledGrants: ['password', 'refresh_token'],
            clientAuthenticationPolicy: 'NotRequired',
            clientSecret: null,
          },
        },
      }),
    },
  );

  if (!applicationResponse.ok) {
    const errorText = await applicationResponse.text();
    throw errorText;
  }

  const data = await applicationResponse.json();
  return data;
};

export const FusionAuthApplicationDeletion = async (fusionAuthBaseUrl: string, fusionAuthApiKey: string, applicationId: string) => {
  await fetch(
    `${fusionAuthBaseUrl}/api/application/${applicationId}?hardDelete=true`,
    {
      method: 'DELETE',
      headers: {
        Authorization: fusionAuthApiKey,
      },
    },
  );
};

export const FusionAutRoleCRUDAlongWithApp = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  applicationId: string,
  roleId: string,
  roleName: string,
  methodName: 'POST' | 'DELETE',
) => {
  const options: RequestInit = {
    method: methodName,
    headers: {
      Authorization: fusionAuthApiKey as string,
      'Content-Type': 'application/json',
    },
  };

  if (methodName !== 'DELETE') {
    options.body = JSON.stringify({
      role: { name: roleName },
    });
  }

  // API call
  const response = await fetch(
    `${fusionAuthBaseUrl}/api/application/${applicationId}/role/${roleId}`,
    options,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FusionAuth error: ${errorText}`);
  }
};

export const FusionAuthUserCreationWithAppAndRole = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  tenantId: string,
  userId: string,
  applicationId: string,
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  password: string,
  roles?: any[],
  mobile?: string | number,
) => {
  const userResponse = await fetch(
    `${fusionAuthBaseUrl}/api/user/registration/${userId}`,
    {
      method: 'POST',
      headers: {
        Authorization: fusionAuthApiKey,
        'Content-Type': 'application/json',
        'X-FusionAuth-TenantId': tenantId,
      },
      body: JSON.stringify({
        user: {
          firstName: firstName,
          lastName: lastName,
          username: userName,
          phoneNumber: mobile,
          email: email,
          password: password,
        },
        registration: {
          applicationId: applicationId,
          roles,
        },
      }),
    },
  );

  if (!userResponse.ok) {
    const errorText = await userResponse.text();
    throw errorText;
  }
};

export const FusionAuthUserDeletion = async (fusionAuthBaseUrl: string, fusionAuthApiKey: string, userId: string) => {
  await fetch(
    `${fusionAuthBaseUrl}/api/user/${userId}?hardDelete=true`,
    {
      method: 'DELETE',
      headers: {
        Authorization: fusionAuthApiKey,
      },
    },
  );
};

export const FusionAuthUserCreation = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  tenantId: string,
  userId: string,
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  password: string,
  methjodName: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  mobile?: string | number,
) => {
  const userResponse = await fetch(
    `${fusionAuthBaseUrl}/api/user/${userId}`,
    {
      method: methjodName,
      headers: {
        Authorization: fusionAuthApiKey,
        'Content-Type': 'application/json',
        'X-FusionAuth-TenantId': tenantId,
      },
      body: JSON.stringify({
        user: {
          firstName: firstName,
          lastName: lastName,
          username: userName,
          phoneNumber: mobile,
          email: email,
          password: password,
        },
      }),
    },
  );

  if (!userResponse.ok) {
    const errorText = await userResponse.text();
    throw errorText;
  }
};

export const FusionAuthUserApplicatonGet = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  tenantId: string,
  userId: string,
  applicationId: string,
) => {
  try {
    const userResponse = await fetch(
      `${fusionAuthBaseUrl}/api/user/registration/${userId}?applicationId=${applicationId}`,
      {
        method: 'GET',
        headers: {
          Authorization: fusionAuthApiKey,
          'Content-Type': 'application/json',
          'X-FusionAuth-TenantId': tenantId,
        },
      },
    );
    if (userResponse.status !== 200) {
      return {
        isNotExist: true,
      };
    }
    return await userResponse.json();
  } catch (err) {
    throw err;
  }
};

export const FusionAuthApplicatonAssign = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  tenantId: string,
  userId: string,
  applicationId: string,
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  methodName: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  roles?: any[],
  mobile?: string | number,
) => {
  try {
    const userResponse = await fetch(
      `${fusionAuthBaseUrl}/api/user/registration/${userId}`,
      {
        method: methodName,
        headers: {
          Authorization: fusionAuthApiKey,
          'Content-Type': 'application/json',
          'X-FusionAuth-TenantId': tenantId,
        },
        body: JSON.stringify({
          registration: {
            applicationId: applicationId,
            roles: roles,
          },
        }),
      },
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      throw errorText;
    }
  } catch (err) {
    throw err;
  }
};

export const FusionAuthUserRoleCreation = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  tenantId: string,
  userId: string,
  applicationId: string,
  methodName: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  roles?: any[],
) => {
  const userResponse = await fetch(
    `${fusionAuthBaseUrl}/api/user/registration/${userId}`,
    {
      method: methodName,
      headers: {
        Authorization: fusionAuthApiKey,
        'Content-Type': 'application/json',
        'X-FusionAuth-TenantId': tenantId,
      },
      body: JSON.stringify({
        registration: {
          applicationId: applicationId,
          roles,
        },
        // registration:
        //applicationId && roles
        //? {
        //  applicationId: applicationId,
        //roles,
        //}
        //: undefined,
      }),
    },
  );

  if (!userResponse.ok) {
    const errorText = await userResponse.text();
    throw errorText;
  }
};

export const FusionAuthUserEdition = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  userId: string,
  firstName: string,
  lastName: string,
) => {
  const userResponse = await fetch(
    `${fusionAuthBaseUrl}/api/user/${userId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: fusionAuthApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          firstName: firstName,
          lastName: lastName,
        },
      }),
    },
  );

  if (!userResponse.ok) {
    const errorText = await userResponse.text();
    throw errorText;
  }
};

export const FusionAuthUserGet = async (
  fusionAuthBaseUrl: string,
  fusionAuthApiKey: string,
  userId: string,
) => {
  const userResponse = await fetch(
    `${fusionAuthBaseUrl}/api/user/${userId}`,
    {
      method: 'GET',
      headers: {
        Authorization: fusionAuthApiKey,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!userResponse.ok) {
    const errorText = await userResponse.text();
    throw errorText;
  }
  const data = await userResponse.json();
  return data;
};
