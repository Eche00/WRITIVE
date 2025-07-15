import React, { useState } from "react";
import { Link } from "react-router";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EmailIcon from "@mui/icons-material/Email";
import OtpResetModal from "./OtpResetModal";

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [messageError, setMessageError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(true);
  const [otpForm, setOtpForm] = useState({
    code: "",
    new_password: "",
  });

  const [loading, setLoading] = useState(false);
  // error states
  const [emailError, setEmailError] = useState(false);
  // handling change function
  const handleChange = (e) => {
    e.preventDefault();
    // error reset
    setEmailError(false);

    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // handle submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Reset messages
    setEmailError(false);
    setMessageError(false);

    // Basic validation
    if (!formData.email.includes("@")) {
      setEmailError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://40fe56c82e49.ngrok-free.app/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setShowOTPModal(true);
        setMessageError(false);
      } else {
        setMessageError(data?.error || "Ein Fehler ist aufgetreten.");
      }
    } catch (error) {
      console.error("Fehler beim Zurücksetzen des Passworts:", error);
      setMessageError("Netzwerkfehler oder ungültige Antwort.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" sm:flex sm:items-center sm:justify-center h-[100vh] bg-white dark:bg-[#1F1F1F] overflow-hidden overscroll-none ">
      {/* mobile container   */}
      <main className=" relative flex flex-col  sm:shadow-2xl   sm:rounded-2xl  sm:h-fit h-screen  sm:w-[700px] w-full p-[20px] dark:sm:border-2 dark:border-gray-700">
        {/* exit page */}
        <Link to="/signin" className="rounded-full p-2 ">
          <img
            src="/logo.webp"
            alt="logo"
            className="w-[50px] h-[50px] object-cover border-gray-300 border-2 rounded-full "
          />
        </Link>

        {/* subcontainer  */}
        <div className=" w-[90%] mx-auto md:w-[60%]">
          {/* form container  */}
          {success ? (
            <OtpResetModal
              show={showOTPModal}
              setShow={setShowOTPModal}
              otpForm={otpForm}
              setOtpForm={setOtpForm}
              email={formData.email}
              setSuccess={setSuccess}
            />
          ) : (
            <form className="w-full" onSubmit={handleSubmit}>
              {messageError && <p className=" text-red-600">{messageError}</p>}
              <div className=" flex flex-col gap-[5px] my-5 ">
                <p className=" dark:text-gray-500 text-black">E-Mail:</p>
                <div className="flex items-center gap-2 bg-transparent dark:bg-black border-1 border-gray-300 dark:border-gray-700  w-full px-3 py-4 rounded-[10px]  dark:text-white  text-gray-700">
                  <span className=" dark:text-gray-500 text-black border-r border-black  dark:border-gray-500 pr-2">
                    <EmailIcon fontSize="" />
                  </span>
                  <input
                    className="  outline-none dark:text-white  text-black flex-1 placeholder:text-gray-500 "
                    type="text"
                    name="email"
                    onChange={handleChange}
                    placeholder="Gib deine E-Mail ein"
                  />
                </div>
                {emailError && (
                  <p className=" text-red-500 ">E-Mail fehlt '@'</p>
                )}
              </div>

              <div className="  flex items-center gap-[10px] ">
                <span className="flex-1 bg-gray-300 dark:bg-gray-700 h-[0.2px] "></span>
                <span className=" text-gray-400 dark:text-gray-700">
                  {" "}
                  <KeyboardArrowDownIcon />
                </span>
                <span className="flex-1 bg-gray-300 dark:bg-gray-700 h-[0.2px] "></span>
              </div>
              <div className=" w-full flex items-center justify-center flex-col">
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
                      <span className="sr-only">Sende...</span>
                    </div>
                  ) : (
                    "Zurücksetz-E-Mail senden"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
export default ForgotPassword;
