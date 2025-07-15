import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VerifyOtpModal from "./VerifyOtpModal";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    is_admin: false,
    secret_code: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showSecretInput, setShowSecretInput] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (token) navigate("/home");
  }, [navigate]);

  const handleChange = (e) => {
    e.preventDefault();
    setLoading(false);
    setError("");
    setEmailError(false);
    setPasswordError(false);

    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email.includes("@")) {
      setEmailError(true);
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setPasswordError(true);
      setLoading(false);
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      is_admin: formData.is_admin,
      ...(formData.is_admin ? { secret_code: formData.secret_code } : {}),
    };

    try {
      const response = await fetch(
        "https://40fe56c82e49.ngrok-free.app/auth/registrieren",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      localStorage.setItem("userEmail", formData.email);

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }
      setShowOtpModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:flex sm:items-center sm:justify-center h-[100vh] bg-[#fefbf9] dark:bg-[#1F1F1F] overflow-hidden overscroll-none">
      <main className="relative flex flex-col sm:shadow-2xl sm:rounded-2xl sm:h-fit h-screen sm:w-[700px] w-full p-[20px] dark:sm:border-2 dark:border-gray-700">
        <Link to="/" className="rounded-full p-2">
          <img
            src="/logo.webp"
            alt="logo"
            className="w-[50px] h-[50px] object-cover border-gray-300 border-2 rounded-full"
          />
        </Link>
        {showOtpModal ? (
          <VerifyOtpModal
            email={formData.email}
            show={showOtpModal}
            setShow={setShowOtpModal}
          />
        ) : (
          <div className="w-[90%] mx-auto md:w-[60%]">
            <h1 className="text-start dark:text-white text-black font-bold my-[30px] text-[20px]">
              Benutzer erstellen
            </h1>
            <form className="w-full" onSubmit={handleSubmit}>
              <p className="text-red-500 font-black">{error}</p>

              <div className="flex flex-col gap-[5px] my-5">
                <p className="dark:text-gray-500 text-black">E-Mail:</p>
                <div className="flex items-center gap-2 bg-transparent dark:bg-black border-1 border-gray-300 dark:border-gray-700 w-full px-3 py-4 rounded-[10px] dark:text-white text-gray-700">
                  <span className="dark:text-gray-500 text-black border-r border-black dark:border-gray-500 pr-2">
                    <EmailIcon fontSize="" />
                  </span>
                  <input
                    className="outline-none dark:text-white text-black flex-1 placeholder:text-gray-500"
                    type="text"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="Gib deine E-Mail-Adresse ein"
                  />
                </div>
                {emailError && <p className="text-red-500">E-Mail fehlt '@'</p>}
              </div>

              <div className="flex flex-col gap-[5px] my-5">
                <p className="dark:text-gray-500 text-black">Passwort:</p>
                <div className="flex items-center gap-2 bg-transparent dark:bg-black border-1 border-gray-300 dark:border-gray-700 w-full px-3 py-4 rounded-[10px] dark:text-white text-gray-700">
                  <span
                    className="dark:text-gray-500 text-black border-r border-black dark:border-gray-500 pr-2 cursor-pointer"
                    onClick={() => setVisible(!visible)}>
                    {visible ? (
                      <VisibilityIcon fontSize="" />
                    ) : (
                      <VisibilityOffIcon fontSize="" />
                    )}
                  </span>
                  <input
                    className="outline-none dark:text-white text-black flex-1 placeholder:text-gray-500"
                    type={visible ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="Passwort erstellen"
                  />
                </div>
                <p className={passwordError ? "text-red-500" : "text-gray-500"}>
                  Muss mindestens 8 Zeichen lang sein
                </p>
              </div>

              <div className="flex items-center gap-2 my-4">
                <input
                  className=" cursor-pointer"
                  type="checkbox"
                  id="is_admin"
                  checked={formData.is_admin}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      is_admin: e.target.checked,
                    }));
                    setShowSecretInput(e.target.checked);
                  }}
                />
                <label
                  htmlFor="is_admin"
                  className="dark:text-white text-black">
                  Als Admin registrieren
                </label>
              </div>

              {showSecretInput && (
                <div className="flex flex-col gap-[5px] my-5">
                  <p className="dark:text-gray-500 text-black">
                    Admin-Geheimcode:
                  </p>
                  <input
                    type="text"
                    name="secret_code"
                    onChange={handleChange}
                    value={formData.secret_code}
                    className="w-full px-3 py-[10px] border border-gray-200 rounded-[10px] text-black "
                    placeholder="Geheimen Admin-Code eingeben"
                  />
                </div>
              )}

              <div className="flex items-center gap-[10px]">
                <span className="flex-1 bg-gray-300 dark:bg-gray-700 h-[0.2px]" />
                <span className="text-gray-400 dark:text-gray-700">
                  <KeyboardArrowDownIcon />
                </span>
                <span className="flex-1 bg-gray-300 dark:bg-gray-700 h-[0.2px]" />
              </div>

              <div className="w-full flex items-center justify-center flex-col">
                <button
                  className="bg-[#412666] w-full py-[10px] text-[12px] font-bold text-white rounded-[10px] my-[10px] cursor-pointer"
                  type="submit">
                  {loading ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-[#1e222b]"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Lädt…</span>
                    </div>
                  ) : (
                    "Registrieren"
                  )}
                </button>
              </div>

              <p className="text-sm font-bold text-center dark:text-white text-black">
                Schon ein Konto?{" "}
                <Link to="/signin" className="underline text-blue-600">
                  Anmelden
                </Link>
              </p>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Signup;
