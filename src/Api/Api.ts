const BASE_URL = "https://urfu-things-bakend-1.onrender.com/api";

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: email,
      password: password
    })
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }
  const data = await res.json();
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
};


export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: email,
      email,
      first_name: name,
      password,
      password2: confirmPassword,
    }),
  });

  const data = await res.json();
  // localStorage.setItem("user_name", data.user.first_name);
  // localStorage.setItem("user_email", data.user.email);
 
  if (!res.ok) {
    throw data; 
  }

  return data;
};

// export const getMe = async () => {
//   const res = await authFetch(`${BASE_URL}/me/`);

//   if (!res.ok) {
//     throw new Error("Unauthorized");
//   }

//   return await res.json();
// };

export const getMe = async (token: string) => {
  console.log('SENDING TOKEN:', token);
  const res = await fetch(`${BASE_URL}/me/`, { headers: { Authorization: `Bearer ${token}` } });
  console.log('STATUS:', res.status);
  const text = await res.text();
  console.log('RAW:', text);
  return JSON.parse(text);
};

// export const refreshAccessToken = async () => {
//   const refresh = localStorage.getItem("refresh");

//   if (!refresh) {
//     throw new Error("No refresh token");
//   }

//   const res = await fetch(`${BASE_URL}/token/refresh/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       refresh,
//     }),
//   });

//   if (!res.ok) {
//     // localStorage.removeItem("access");
//     // localStorage.removeItem("refresh");
//     throw new Error("Refresh failed");
//   }

//   const data = await res.json();

//   localStorage.setItem("access", data.access);

//   return data.access;
// };

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token");

  if (!refresh) {
    throw new Error("No refresh token");
  }

  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh,
    }),
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  localStorage.setItem("access_token", data.access);

  return data.access;
};


// export const authFetch = async (url: string, options: RequestInit = {}) => {
//   let access = localStorage.getItem("access");

//   let res = await fetch(url, {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${access}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (res.status === 401) {
//     access = await refreshAccessToken();

//     res = await fetch(url, {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${access}`,
//         "Content-Type": "application/json",
//       },
//     });
//   }

//   return res;
// };

export const authFetch = async (url: string, options: RequestInit = {}) => {
  let access = localStorage.getItem("access_token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
    },
  });

  if (res.status === 401) {
    access = await refreshAccessToken();

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${access}`,
      },
    });
  }

  return res;
};

// /* GET ME */
// export const getMe = async () => {
//   const res = await authFetch(`${BASE_URL}/me/`);

//   if (!res.ok) {
//     throw new Error("Unauthorized");
//   }

//   return await res.json();
// };

export type ItemResponse = {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string;
  status: string;
};


// export const createFoundItem = async (
//   formData: FormData,
//   type: string
// ): Promise<ItemResponse> => {
//   const token = localStorage.getItem("access_token");

//   const url =
//     type === "found"
//       ? `${BASE_URL}/found/`
//       : `${BASE_URL}/lost/`;

//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   });

//   if (!res.ok) {
//     const errorData = await res.json();
//   console.log("BACKEND ERROR:", errorData);
//   throw errorData;
//   }

//   return await res.json();
// };

export const createFoundItem = async (formData: FormData, type: string) => {
  const token = localStorage.getItem("access_token");

  const url =
    type === "found"
      ? `${BASE_URL}/found/`
      : `${BASE_URL}/lost/`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await res.text();

  console.log("STATUS:", res.status);
  console.log("RESPONSE TEXT:", text);

  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
};


export const getItems = async (
  type: string
): Promise<ItemResponse[]> => {
  const url =
    type === "found"
      ? `${BASE_URL}/found/`
      : `${BASE_URL}/lost/`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Ошибка");

  return await res.json();
};
