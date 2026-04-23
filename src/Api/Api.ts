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

  return res.json();
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
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("user_name", name); 
  if (!res.ok) {
    throw data; 
  }

  return data;
};
