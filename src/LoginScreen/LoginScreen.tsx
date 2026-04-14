import { useState, useEffect, useRef } from "react";
import "./LoginScreen.css";
import { PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

type Errors = {
  login?: string;
  password?: string;
};



function Login() {
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    login: '',
    password: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
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
      navigate("/main");
    }
  };

  return (
    <div className="container">
      <div className="card" ref={formRef}>
        <h1 className="title">UniFind</h1>

        <div className="field">
          <input
            name="login"
            type="text"
            placeholder="Почта/Логин"
            className={`input ${errors.login ? "input-error" : ""}`}
            value={form.login}
            onChange={handleChange}
          />


          {errors.login && (
            <div className="tooltip">{errors.login}</div>
          )}
        </div>


        <div className="field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            className={`input ${errors.password ? "input-error" : ""}`}
            value={form.password}
            onChange={handleChange}
          />

           <span
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <PiEyeFill />: <PiEyeSlashFill />}
          </span>

          {errors.password && (
            <div className="tooltip">{errors.password}</div>
          )}
        </div>


        <button className="btn primary" onClick={handleSubmit}>
          Войти
        </button>

        <button className="btn secondary" onClick={() => navigate("/register")}>
          Регистрация
        </button>
      </div>
    </div>
  );
}

export { Login };