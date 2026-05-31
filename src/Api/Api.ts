const BASE_URL = "https://urfu-things-bakend-1.onrender.com/api";
import axios from 'axios';
import type { AppealPayload } from '../Appeal/Appeal';

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

  const text = await res.text();
  console.log("LOGIN STATUS:", res.status);
  console.log("LOGIN RESPONSE:", text);
  if (!res.ok) {
    throw new Error(text);
  }
  const data = JSON.parse(text);
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  const me = await fetchMe();
  localStorage.setItem("user", JSON.stringify(me))
  return { ...data, user: me };
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


export const getMe = async (token: string) => {
  console.log('SENDING TOKEN:', token);
  const res = await fetch(`${BASE_URL}/me/`, { headers: { Authorization: `Bearer ${token}` } });
  console.log('STATUS:', res.status);
  const text = await res.text();
  console.log('RAW:', text);
  return JSON.parse(text);
};


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

export type ItemResponse = {
  id: number;
  title: string;
  description: string;
  location_ref: string;
  user: number;
  image: string;
  status: string;
};

export type ItemsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ItemResponse[];
};

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
): Promise<ItemsResponse> => {
  const url =
    type === "found"
      ? `${BASE_URL}/found/`
      : `${BASE_URL}/lost/`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Ошибка");

  return await res.json();
};

export const fetchMe = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) return null;

  const res = await fetch(`${BASE_URL}/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;

  return await res.json();
};

export async function getNearestPickupPoint(
  latitude: number,
  longitude: number,
) {
  const response = await fetch(
    `${BASE_URL}/pickup-points/nearby/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: Number(latitude),
        longitude: Number(longitude),
      }),
    },
  );

   if (!response.ok) {
    const errorText = await response.text(); 
    console.log("API ERROR STATUS:", response.status);
    console.log("API ERROR BODY:", errorText);

    throw new Error(errorText);
  }


  return response.json();
}

export const uploadAvatar = async (file: File) => {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();

  formData.append("avatar", file);

  const res = await fetch(
    `${BASE_URL}/me/avatar/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );
  const text = await res.text();

  console.log("STATUS:", res.status);
  console.log("RESPONSE:", text);

  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text); 
};

export const updateProfile = async (formData: {
  first_name?: string;
  email?: string;
  notifications_enabled?: boolean;
  fcm_token?: string;
}) => {
  const token = localStorage.getItem("access_token");

  const res = await fetch(
    `${BASE_URL}/me/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }
  );

  const text = await res.text();

  console.log("STATUS:", res.status);
  console.log("RESPONSE:", text);

  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
};


export const createAppeal = async (data: AppealPayload) => {
  const token = localStorage.getItem('access_token');
  try {
    console.log("found_item:", data.found_item);
    console.log("lost_item:", data.lost_item);
    const response = await axios.post(
      `${BASE_URL}/appeals/create/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return response.data.results;
  }
  catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.log("APPEAL ERROR:", error.response?.data);
  } else
    console.log("UNKNOWN ERROR:", error);
  throw error;
}
};

export const getAppeals = async () => {
  const token = localStorage.getItem('access_token');

  const res = await axios.get(`${BASE_URL}/appeals/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const searchItems = async (
  query: string,
  type: 'found' | 'lost'
) => {
  const endpoint =
    type === 'found'
      ? '/found/'
      : '/lost/';

  try {
    const response = await axios.get(
      `${BASE_URL}${endpoint}?search=${encodeURIComponent(query)}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('STATUS:', error.response?.status);
      console.log('DATA:', error.response?.data);
    }

    throw error;
  }
};


export const getSearchHistory = async () => {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${BASE_URL}/search/history/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Ошибка загрузки истории');
  }

  return await res.json();
};

export const getSearchSuggestions = async (query: string) => {
  const token = localStorage.getItem('access_token');

  const res = await fetch(
    `${BASE_URL}/search/suggestions/?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const text = await res.text();

  console.log('STATUS:', res.status);
  console.log('BODY:', text);

  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
};

export const saveSearchQuery = async (query: string) => {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${BASE_URL}/search/save/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
    }),
  });

  if (!res.ok) {
    throw new Error('Ошибка сохранения поиска');
  }

  return await res.json();
};