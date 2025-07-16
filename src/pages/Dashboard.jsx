import {
  BrandingWatermark,
  LightMode,
  People,
  Search,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserLoader from "../component/UserLoader";

const BASE_URL = "https://cb49a05985a8.ngrok-free.app";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  // FETCHING CURRENT USER
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedEmail = localStorage.getItem("userEmail"); // set on login/register

      if (!savedEmail) {
        console.warn("User email not found in localStorage");
        return;
      }

      const res = await fetch(`${BASE_URL}/customers/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      const matchedUser = data.customers.find(
        (user) => user.EmailAdresse === savedEmail
      );

      if (matchedUser) {
        setCurrentUser(matchedUser);
      } else {
        console.warn("Current user not found in fetched customers.");
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  // FETCHING CUSTOMERS
  const fetchCustomers = async (query = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // or however you store the token
      const res = await fetch(
        `${BASE_URL}/customers/?status=active&search=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // <-- this fixes it
          },
        }
      );
      const data = await res.json();
      setCustomers(data.customers || []);
      setFiltered(data.customers || []);
      console.log("Fetched customers:", data.customers);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };
  // FETCHING BRANDS
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/brands/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchCustomers();
    fetchBrands();
  }, []);

  // handle if there is a user logged in
  useEffect(() => {
    const token = localStorage.getItem("token"); // or sessionStorage
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  // Handling getting user by search
  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFiltered(
        customers.filter(
          (c) =>
            (c.EmailAdresse && c.EmailAdresse.toLowerCase().includes(q)) ||
            (c.KontaktName && c.KontaktName.toLowerCase().includes(q)) ||
            (c.ID && c.ID.toLowerCase().includes(q)) ||
            (c.Firma && c.Firma.toLowerCase().includes(q))
        )
      );
    } else {
      setFiltered(customers);
    }
  }, [search, customers]);

  // users/active users
  const totalUser = customers.length;
  const activeUserCount = customers.filter((c) => c.is_active).length;

  return (
    <div className="p-4 sm:w-[80%] w-full mx-auto text-black flex flex-col  overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        Administrationsübersicht
      </h1>
      <section className=" flex flex-col gap-[24px] mb-[24px]">
        <div>
          <h2 className=" text-[#412666] sm:text-[24px] text-[16px] font-[700] first-letter:uppercase flex items-center gap-[10px]">
            <Avatar fontSize="" /> {currentUser?.EmailAdresse}
          </h2>
          <p
            style={{ color: "hsl(215.4, 16.3%, 46.9%)" }}
            className="text-sm font-[700] text-wrap">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Repudiandae nihil quas delectus tenetur sunt quis velit, doloribus
            asperiores earum labore.
          </p>
        </div>
        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Customers */}

          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-start hover:shadow-2xl hover:scale-[105%] transition-all duration-300 cursor-pointer">
            <div>
              <p className="text-sm text-gray-500 mb-1">Gesamtkunden</p>
              <h3 className="text-2xl font-bold text-[#412666]">{totalUser}</h3>
              <p className="text-sm text-green-600 font-medium mt-1">
                {totalUser} Nutzer
              </p>
              <p className="text-xs text-gray-400 mt-1">Gesamte Nutzer</p>
            </div>
            <div className="bg-[#f5f3f7] p-2 rounded-full">
              <span className="text-[#412666] text-xl">
                <People />
              </span>
            </div>
          </div>

          {/* Active Customers */}
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-start hover:shadow-2xl hover:scale-[105%] transition-all duration-300 cursor-pointer">
            <div>
              <p className="text-sm text-gray-500 mb-1">Aktiv</p>
              <h3 className="text-2xl font-bold text-[#412666]">
                {activeUserCount}
              </h3>
              <p
                className={`text-sm font-medium mt-1 ${
                  activeUserCount > 0 ? "text-green-600" : "text-red-600"
                }`}>
                {activeUserCount} aktive Nutzer
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Gesamte aktive Nutzer
              </p>
            </div>
            <div className="bg-[#f5f3f7] p-2 rounded-full">
              <span className="text-[#412666] text-xl">
                <LightMode />
              </span>
            </div>
          </div>

          {/* brand  */}
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-start hover:shadow-2xl hover:scale-[105%] transition-all duration-300 cursor-pointer">
            <div>
              <p className="text-sm text-gray-500 mb-1">Marken</p>
              <h3 className="text-2xl font-bold text-[#412666]">
                {brands.length}
              </h3>
              <p className="text-sm text-green-600 font-medium mt-1">
                +{brands.length} Marken
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Gesamte aktive Marken
              </p>
            </div>
            <div className="bg-[#f5f3f7] p-2 rounded-full">
              <span className="text-[#412666] text-xl">
                <BrandingWatermark />
              </span>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <section>
          <UserLoader />
        </section>
      ) : (
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow-2xl hover:scale-[101%] transition-all duration-300 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#412666] ">Nutzer</h2>
            <div className="border border-[#412666] rounded-lg px-4  w-1/3 focus:outline-none flex items-center gap-[10px] overflow-hidden">
              <Search />
              <input
                type="text"
                placeholder="Suche nach Name, E-Mail, Firma oder ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className=" border-none focus:outline-none py-2 flex-1"
              />
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3 ">ID</th>
                <th className="py-2 px-3 xl:inline hidden">KontaktName</th>
                <th className="py-2 px-3">EmailAdresse</th>
                <th className="py-2 px-3 xl:inline hidden">Firma</th>
                <th className="py-2 px-3 ">Status</th>
                {/* xl:inline hidden */}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.ID}
                  className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="py-2 px-3">{c.ID}</td>
                  <td className="py-2 px-3 xl:inline hidden">
                    {c.KontaktName || "-"}
                  </td>
                  <td className="py-2 px-3">{c.EmailAdresse}</td>
                  <td className="py-2 px-3 xl:inline hidden">
                    {c.Firma || "-"}
                  </td>
                  <td className="py-2 px-3 ">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        c.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                      <span className="w-2 h-2 bg-current rounded-full"></span>
                      {c.is_active ? "abgeschlossen" : "inaktiv"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
