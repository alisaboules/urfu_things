import { useState, useEffect, useRef } from 'react';
import './LoginScreen.css';
import { PiEyeFill, PiEyeSlashFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Api/Api.ts';

type Errors = {
  email?: string;
  password?: string;
};

function Login() {
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
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

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const validate = () => {
    const newErrors: Errors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Введите почту';
    } else if (form.email.length < 8) {
      newErrors.email = 'Минимум 8 символов';
    }

    if (!form.password) {
      newErrors.password = 'Введите пароль';
    } else if (form.password.length < 8) {
      newErrors.password = 'Минимум 8 символов';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const data = await loginUser(form.email, form.password);

      console.log('Токен:', data);

      // сохраняем токен
      localStorage.setItem('token', data.access);

      // переход
      navigate('/main');
    } catch (err) {
      console.error(err);
      setErrors({
        email: 'Такого пользователя не существует или неверный пароль',
      });
    }
  };

  return (
    <div className="container">
      <div className="card-menu" ref={formRef}>
        <h1 className="title">UniFind</h1>

        <div className="field">
          <input
            name="email"
            type="text"
            placeholder="Почта"
            className={`input ${errors.email ? 'input-error' : ''}`}
            value={form.email}
            onChange={handleChange}
          />

          {errors.email && <div className="tooltip">{errors.email}</div>}
        </div>

        <div className="field">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            className={`input ${errors.password ? 'input-error' : ''}`}
            value={form.password}
            onChange={handleChange}
          />

          <span className="eye" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <PiEyeFill /> : <PiEyeSlashFill />}
          </span>

          {errors.password && <div className="tooltip">{errors.password}</div>}
        </div>

        <button className="btn primary" onClick={handleSubmit}>
          Войти
        </button>

        <button className="btn secondary" onClick={() => navigate('/register')}>
          Регистрация
        </button>
      </div>
    </div>
  );
}

export { Login };
