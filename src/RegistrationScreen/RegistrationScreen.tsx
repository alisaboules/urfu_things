import { useState, useEffect, useRef } from "react";
import "./RegistrationScreen.css";
import { PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Api/Api";

type Errors = {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
};

type DjangoError = {
  email?: string[];
  password?: string[];
  first_name?: string[];
  password2?: string[];
};



function Registration() {
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setErrors({});
    }
  };

  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}, []);

  


  const validate = () => {
  const newErrors: Errors = {};

  if (!form.email.trim()) {
    newErrors.email = 'Введите email';
  } else if (form.email.length < 8) {
    newErrors.email = 'Минимум 8 символов';
  }

  if (!form.password) {
    newErrors.password = 'Введите пароль';
  } else if (form.password.length < 8) {
    newErrors.password = 'Минимум 8 символов';
  }

  if (!form.name) {
    newErrors.name= 'Введите имя';
  } else if (form.name.length < 6) {
    newErrors.name = 'Минимум 6 символов';
  }

  if (!form.confirmPassword) {
    newErrors.confirmPassword = 'Введите пароль';
  } else if (form.password !== form.confirmPassword) {
  newErrors.confirmPassword = "Пароли не совпадают";
}

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setForm({
    ...form,
    [name]: value
  });

  setErrors((prev) => ({
    ...prev,
    [name]: undefined
  }));
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    const data = await registerUser(
      form.name,
      form.email,
      form.password,
      form.confirmPassword
    );

    console.log("REGISTER OK:", data);

    navigate(-1);
  } catch (err: unknown) {
    const error = err as DjangoError;

    console.error("REGISTER ERROR:", error);

    setErrors({
      email: error.email?.[0],
      password: error.password?.[0],
      name: error.first_name?.[0],
      confirmPassword: error.password2?.[0],
    });
  }
};



  return (
    <div className="container-registration">
      <div className="card-registration" ref={formRef}>
        <h1 className="title-registration">UniFind</h1>


        <div className="field-registration">
          <input
            name="name"
            type="text"
            placeholder="Имя"
            className={`input-registration ${errors.name ? "input-registration-error" : ""}`}
            value={form.name}
            onChange={handleChange}
          />


          {errors.name && (
            <div className="tooltip-registration">{errors.name}</div>
          )}
        </div>

        <div className="field-registration">
          <input
            name="email"
            type="email"
            placeholder="Почта"
            className={`input-registration ${errors.email ? "input-registration-error" : ""}`}
            value={form.email}
            onChange={handleChange}
          />


          {errors.email && (
            <div className="tooltip-registration">{errors.email}</div>
          )}
        </div>


        <div className="field-registration">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            className={`input-registration ${errors.password ? "input-registration-error" : ""}`}
            value={form.password}
            onChange={handleChange}
          />

           <span
            className="eye-registration"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <PiEyeFill />: <PiEyeSlashFill />}
          </span>

          {errors.password && (
            <div className="tooltip-registration">{errors.password}</div>
          )}
        </div>

        <div className="field-registration">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Подтверждение пароля"
            className={`input-registration ${errors.confirmPassword ? "input-registration-error" : ""}`}
            value={form.confirmPassword}
            onChange={handleChange}
          />

           <span
            className="eye-registration"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <PiEyeFill />: <PiEyeSlashFill />}
          </span>

          {errors.confirmPassword && (
            <div className="tooltip-registration">{errors.confirmPassword}</div>
          )}
        </div>

        <button className="btn-registration primary-registration" onClick={handleSubmit}>Зарегестрироваться</button>

        <button className="btn-registration secondary-registration" onClick={() => navigate(-1)}>
          Вход
        </button>
      </div>
    </div>
  );
}

export { Registration };