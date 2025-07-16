import { Delete, Edit, Email } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";

const BASE_URL = "https://65e435ef7c7e.ngrok-free.app";

const Settings = () => {
  // STATE DEFINITIONS
  // General settings fetched from API
  const [settings, setSettings] = useState([]);

  // List of roles (e.g., Admin, Manager)
  const [roles, setRoles] = useState([]);

  // List of email templates (used for automations/notifications)
  const [templates, setTemplates] = useState([]);

  // Loader to indicate fetch/create/update processes
  const [loading, setLoading] = useState(true);

  // New role form state
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: {
      can_edit_products: false,
      can_view_reports: false,
      can_manage_users: false,
    },
  });

  // New email template form state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    body: "",
    trigger_condition: "",
    language: "de",
    status: "active",
  });

  // Modal visibility toggle for editing templates
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Selected template for editing
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Updated template state (prefilled when editing)
  const [updatedTemplate, setUpdatedTemplate] = useState({
    name: "",
    subject: "",
    body: "",
    trigger_condition: "",
    language: "de",
    status: "active",
  });

  // ---------------------------
  // EFFECTS
  // ---------------------------

  // Load all settings (roles, templates, general config) on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // ---------------------------
  // API FUNCTIONS
  // ---------------------------

  /**
   * Fetch settings data from backend.
   * Includes general settings, roles, and email templates.
   */
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/settings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setSettings(data.settings || []);
      setRoles(data.roles || []);
      setTemplates(data.email_templates || []);
    } catch (err) {
      console.error("Fehler beim Abrufen der Einstellungen:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new role with a given name and permissions.
   */
  const createRole = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/settings/roles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(newRole),
      });

      const data = await res.json();

      if (res.ok) {
        setNewRole({ name: "" }); // Clear input
        fetchSettings(); // Refresh list
      } else {
        console.log(data.error || "Erstellung der Rolle fehlgeschlagen.");
      }
    } catch (err) {
      console.error("Fehler beim Erstellen der Rolle:", err);
    }
  };

  // Delete a role by ID.
  const deleteRole = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/settings/roles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (res.ok) {
        fetchSettings(); // Refresh list
      } else {
        console.error(data.error || "Löschen der Rolle fehlgeschlagen.");
      }
    } catch (err) {
      console.error("Fehler beim Löschen der Rolle:", err);
    }
  };

  // Create a new email template for automated communication.
  const createTemplate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/settings/email_templates`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(newTemplate),
      });

      const data = await res.json();

      if (res.ok) {
        setNewTemplate({
          name: "",
          subject: "",
          body: "",
          trigger_condition: "",
        }); // Clear form
        fetchSettings(); // Refresh templates
      } else {
        console.error(data.error || "Ein Fehler ist aufgetreten.");
      }
    } catch (err) {
      console.error("Fehler beim Erstellen der Vorlage:", err);
    }
  };

  //  Update an existing email template.
  //  Triggered from the edit modal.

  const updateTemplate = async (id, updated) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/settings/email_templates/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(updated),
      });

      const data = await res.json();

      if (res.ok) {
        setShowTemplateModal(false); // Close modal
        setSelectedTemplate(null); // Clear selection
        fetchSettings(); // Refresh templates
      } else {
        console.log(data.error || "Aktualisierung der Vorlage fehlgeschlagen.");
      }
    } catch (err) {
      console.error("Fehler beim Aktualisieren der Vorlage:", err);
      console.error("Serverfehler bei der Aktualisierung.");
    }
  };

  //  Delete an email template by ID.
  const deleteTemplate = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/settings/email_templates/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (res.ok) {
        fetchSettings(); // Refresh templates
      } else {
        console.log(data.error || "Löschen der Vorlage fehlgeschlagen.");
      }
    } catch (err) {
      console.error("Fehler beim Löschen der Vorlage:", err);
    }
  };

  // ---------------------------
  // HELPER FUNCTIONS
  // ---------------------------

  //  Handle edit button click: pre-fill form and open modal.
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setUpdatedTemplate({
      name: template.name || "",
      subject: template.subject || "",
      body: template.body || "",
      trigger_condition: template.trigger_condition || "",
      language: template.language || "de",
      status: template.status || "active",
    });
    setShowTemplateModal(true);
  };

  return (
    <div className="max-w-5xl sm:w-full w-[90%] mx-auto sm:p-6 text-gray-800 overflow-x-hidden">
      <h1 className="sm:text-3xl text-xl font-bold text-[#412666] mb-8">
        ⚙️ Allgemeine Einstellungen
      </h1>

      {loading ? (
        <p className="sm:text-lg text-[16px] text-gray-500">
          Lade Einstellungen...
        </p>
      ) : (
        <div className="space-y-10">
          {/* General Settings */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {settings.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition">
                  <h3 className="font-semibold text-[#412666]">{s.key}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Wert:</span> {s.value}
                  </p>
                  <p className="text-xs text-gray-500">{s.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Role Management */}

          <section>
            <h2 className="text-2xl font-semibold mb-4"> Rollenverwaltung</h2>
            <div className="space-y-3">
              {roles.map((r, i) => (
                <div
                  className="px-5 py-2 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-center hover:shadow-2xl hover:scale-[101%] transition-all duration-300 "
                  key={i}>
                  <div className=" flex items-center gap-[10px]">
                    <div className="bg-[#f5f3f7] p-2 rounded-full">
                      <span className="text-[#412666] text-xl">
                        <Avatar fontSize="small" />
                      </span>
                    </div>

                    <h3 className="sm:text-xl text-[14px] font-bold text-[#412666]">
                      {r.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteRole(r.id)}
                    className="bg-red-500 text-sm px-3 py-1 text-white rounded-[8px] cursor-pointer">
                    <Delete />
                    <span className=" sm:inline hidden">Löschen</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Neue Rolle"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
                className="flex-1 border rounded p-3 text-sm"
              />
              <button
                onClick={createRole}
                className="bg-[#412666] text-white px-5 py-2 rounded-full text-sm hover:bg-[#321d52]">
                Rolle erstellen
              </button>
            </div>
          </section>

          {/* Email Templates */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-[10px]">
              {" "}
              <span className="text-[#412666] text-xl">
                <Email fontSize="large" />
              </span>{" "}
              E-Mail-Vorlagen
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {templates.map((tpl) => (
                <div
                  className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-start hover:shadow-2xl hover:scale-[105%] transition-all duration-300 cursor-pointer"
                  key={tpl.id}>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Vorlage:</p>
                    <h3 className="text-xl font-bold text-[#412666]">
                      {tpl.name}
                    </h3>
                    <p className="text-sm  text-gray-500  font-medium mt-1">
                      {tpl.trigger_condition}
                    </p>
                    <div className="flex gap-[10px] mt-2 w-full">
                      <button
                        onClick={() => handleEditTemplate(tpl)}
                        className="bg-blue-500 text-sm px-3 py-1 text-white rounded-[8px] cursor-pointer">
                        <Edit />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => deleteTemplate(tpl.id)}
                        className="bg-red-500 text-sm px-3 py-1 text-white rounded-[8px] cursor-pointer">
                        <Delete />
                        Löschen
                      </button>
                    </div>
                  </div>
                  <div className="bg-[#f5f3f7] p-2 rounded-full">
                    <span className="text-[#412666] text-xl">
                      <Email />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 bg-white border rounded-xl p-6 shadow-sm flex flex-col w-full">
              <h3 className="text-lg font-semibold text-[#412666]">
                Neue Vorlage
              </h3>
              <input
                type="text"
                placeholder="Name"
                value={newTemplate.name}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, name: e.target.value })
                }
                className="w-full border p-3 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Betreff"
                value={newTemplate.subject}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, subject: e.target.value })
                }
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <textarea
                placeholder="Body"
                value={newTemplate.body}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, body: e.target.value })
                }
                className="w-full border p-3  rounded text-sm"
                rows={4}
              />
              <input
                type="text"
                placeholder="Bedingung"
                value={newTemplate.trigger_condition}
                onChange={(e) =>
                  setNewTemplate({
                    ...newTemplate,
                    trigger_condition: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <button
                onClick={createTemplate}
                className="bg-[#412666] text-white px-5 py-3 rounded-full text-sm hover:bg-[#321d52]">
                Vorlage erstellen
              </button>
            </div>
          </section>
        </div>
      )}
      {showTemplateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Vorlage bearbeiten
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <label className="block font-medium mb-1">Name:</label>
                <input
                  type="text"
                  value={updatedTemplate.name}
                  onChange={(e) =>
                    setUpdatedTemplate({
                      ...updatedTemplate,
                      name: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Betreff:</label>
                <input
                  type="text"
                  value={updatedTemplate.subject}
                  onChange={(e) =>
                    setUpdatedTemplate({
                      ...updatedTemplate,
                      subject: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Body:</label>
                <textarea
                  value={updatedTemplate.body}
                  onChange={(e) =>
                    setUpdatedTemplate({
                      ...updatedTemplate,
                      body: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                  rows={4}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Bedingung:</label>
                <input
                  type="text"
                  value={updatedTemplate.trigger_condition}
                  onChange={(e) =>
                    setUpdatedTemplate({
                      ...updatedTemplate,
                      trigger_condition: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="w-full sm:w-auto bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300">
                Abbrechen
              </button>

              <button
                onClick={() =>
                  updateTemplate(selectedTemplate.id, updatedTemplate)
                }
                className="w-full sm:w-auto bg-[#412666] text-white py-2 px-4 rounded hover:bg-[#341f4f]">
                Vorlage speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
