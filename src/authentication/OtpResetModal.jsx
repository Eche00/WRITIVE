import React, { useState } from "react";
import { useNavigate } from "react-router";

const OtpResetModal = ({
  show,
  setShow,
  otpForm,
  setOtpForm,
  email,
  setSuccess,
}) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(
        "https://cb49a05985a8.ngrok-free.app/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            code: otpForm.code,
            new_password: otpForm.new_password,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Passwort wurde erfolgreich zurückgesetzt.");
        setTimeout(() => {
          setShow(false);
          navigate("/signin");
        }, 2000);
      } else {
        setErrorMsg(data?.error || "Fehler beim Zurücksetzen.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(" Netzwerkfehler beim Zurücksetzen.");
    }
  };

  if (!show) return null;

  return (
    <div className="w-full">
      <div className=" w-full space-y-4">
        <h2 className="text-lg font-bold text-center dark:text-white">
          Setzen Sie Ihr Passwort zurück
        </h2>

        {errorMsg && (
          <p className="text-sm text-red-500 text-center">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-sm text-green-600 text-center">{successMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="">
          <div className=" flex flex-col gap-[5px] my-5 ">
            <label className=" dark:text-gray-500 text-black">
              Bestätigungscode
            </label>
            <div className="flex items-center gap-2 bg-transparent dark:bg-black border-1 border-gray-300 dark:border-gray-700  w-full px-3 py-4 rounded-[10px]  dark:text-white  text-gray-700">
              <input
                type="text"
                className="  outline-none dark:text-white  text-black flex-1 placeholder:text-gray-500 "
                value={otpForm.code}
                onChange={(e) =>
                  setOtpForm((prev) => ({ ...prev, code: e.target.value }))
                }
              />
            </div>
          </div>

          <div className=" flex flex-col gap-[5px] my-5 ">
            <label className=" dark:text-gray-500 text-black">
              Neu Passwort
            </label>
            <div className="flex items-center gap-2 bg-transparent dark:bg-black border-1 border-gray-300 dark:border-gray-700  w-full px-3 py-4 rounded-[10px]  dark:text-white  text-gray-700">
              <input
                type="text"
                className="  outline-none dark:text-white  text-black flex-1 placeholder:text-gray-500 "
                value={otpForm.new_password}
                onChange={(e) =>
                  setOtpForm((prev) => ({
                    ...prev,
                    new_password: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#412666] text-white w-full py-[10px] text-[12px] font-bold rounded-[10px] transition cursor-pointer mb-4 ">
            Passwort zurücksetzen
          </button>

          <button
            type="button"
            onClick={() => {
              setShow(false);
              setSuccess(false);
            }}
            className="text-sm text-center border border-[#412666] text-[#412666] w-full  py-[10px] text-[12px] font-bold rounded-[10px] cursor-pointer">
            Abbrechen
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpResetModal;
