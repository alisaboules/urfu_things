import { useState, useEffect, useRef } from "react";
import "./RegistrationScreen.css";
import { PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

type Errors = {
  login?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
};



function Registration() {
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    name: '',
    login: '',
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

  if (!form.login.trim()) {
    newErrors.login = 'Введите логин или email';
  } else if (form.login.length < 3) {
    newErrors.login = 'Минимум 3 символа';
  }

  if (!form.password) {
    newErrors.password = 'Введите пароль';
  } else if (form.password.length < 6) {
    newErrors.password = 'Минимум 6 символов';
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


  const handleSubmit = () => {
    if (validate()) {
      console.log('Всё ок, отправка:', form);
      navigate(-1);
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
            name="login"
            type="text"
            placeholder="Почта/Логин"
            className={`input-registration ${errors.login ? "input-registration-error" : ""}`}
            value={form.login}
            onChange={handleChange}
          />


          {errors.login && (
            <div className="tooltip-registration">{errors.login}</div>
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