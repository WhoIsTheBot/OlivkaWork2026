"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "@/api/api";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auth0User, setAuth0User] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [publicProfile, setPublicProfile] = useState(null);
  
  // Стан для списку користувачів (адмін-панель)
  const [users, setUsers] = useState([]);

  // Input states для вакансій
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salary, setSalary] = useState(0);
  const [activeEmploymentTypes, setActiveEmploymentTypes] = useState([]);
  const [salaryType, setSalaryType] = useState("Year");
  const [negotiable, setNegotiable] = useState(false);
  const [tags, setTags] = useState([]);
  const [skills, setSkills] = useState([]);
  const [location, setLocation] = useState({
    country: "",
    city: "",
    address: "",
  });

  // Перевірка авторизації при завантаженні
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/v1/check-auth");
        setIsAuthenticated(res.data.isAuthenticated);
        setAuth0User(res.data.user);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Отримання списку всіх користувачів (для адмінки)
  const getUsers = useCallback(async (role = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/users${role ? `?role=${role}` : ""}`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error getting users:", error);
      setUsers([]); // Очищуємо список у разі помилки
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання власного профілю
  const getUserProfile = async (id) => {
    try {
      const res = await api.get(`/api/v1/users/${id}`);
      setUserProfile(res.data);
    } catch (error) {
      console.error("Error getting user profile:", error);
    }
  };

  // Отримання публічного профілю іншого користувача
  const getPublicProfile = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/users/${id}`);
      setPublicProfile(res.data);
    } catch (error) {
      console.error("Error loading public profile:", error);
    } finally {
      setLoading(false);
    }
  };


// Додайте це всередину вашого GlobalContextProvider
const changeUserRole = async (id, newRole) => {
  try {
    // Переконуємося, що axios налаштований з baseURL: http://localhost:8000
    const res = await api.patch(`/api/v1/users/${id}/role`, { role: newRole });
    
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, role: res.data.role } : user
      )
    );
  } catch (error) {
    console.error("Error changing user role:", error);
  }
};

  // Обробники інпутів
  const handleTitleChange = (e) => setJobTitle(e.target.value.trimStart());
  const handleDescriptionChange = (e) => setJobDescription(e.target.value.trimStart());
  const handleSalaryChange = (e) => setSalary(e.target.value);

  const logout = () => {
    setIsAuthenticated(false);
    setAuth0User(null);
    setUserProfile({});
    window.location.href = "http://localhost:8000/logout";
  };

  const resetJobForm = () => {
    setJobTitle("");
    setJobDescription("");
    setSalary(0);
    setActiveEmploymentTypes([]);
    setSalaryType("Year");
    setNegotiable(false);
    setTags([]);
    setSkills([]);
    setLocation({ country: "", city: "", address: "" });
  };

  // Автоматично завантажуємо профіль, якщо залогінені
  useEffect(() => {
    if (isAuthenticated && auth0User?.sub) {
      getUserProfile(auth0User.sub);
    }
  }, [isAuthenticated, auth0User]);

  return (
    <GlobalContext.Provider
      value={{
        isAuthenticated,
        auth0User,
        userProfile,
        getUserProfile,
        loading,
        users, // Тепер визначено
        getUsers, // Тепер визначено
        jobTitle,
        jobDescription,
        salary,
        activeEmploymentTypes,
        salaryType,
        negotiable,
        tags,
        skills,
        location,
        handleTitleChange,
        handleDescriptionChange,
        handleSalaryChange,
        setActiveEmploymentTypes,
        setJobDescription,
        setSalaryType,
        setNegotiable,
        setTags,
        setSkills,
        setLocation,
        resetJobForm,
        logout,
        publicProfile,
        getPublicProfile,
        changeUserRole, // Додано функцію зміни ролі
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};