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
  localStorage.setItem("user_name", data.user.first_name);
  localStorage.setItem("user_email", data.user.email);
 
  if (!res.ok) {
    throw data; 
  }

  return data;
};

export const getMe = async () => {
  const res = await authFetch(`${BASE_URL}/me/`);

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return await res.json();
};



export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");

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
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  localStorage.setItem("access", data.access);

  return data.access;
};


export const authFetch = async (url: string, options: RequestInit = {}) => {
  let access = localStorage.getItem("access");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    access = await refreshAccessToken();

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
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