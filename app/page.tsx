"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/public/logo-sin-fondo.png";

type FormData = {
  iglesia: string;
  nombres: string;
  apellidos: string;  
  celular: string;
  edad: string;
  distrito: string;
};

export default function RegistroConfraternidad() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [registros, setRegistros] = useState<FormData[]>([]);
  const [versiculos, setVersiculos] = useState<string[]>([]);
  const [versiculo, setVersiculo] = useState("");

  useEffect(() => {
    fetch("/versiculos.json")
      .then((res) => res.json())
      .then((data) => {
        setVersiculos(data);
        // Seleccionar uno aleatorio al iniciar
        const random = data[Math.floor(Math.random() * data.length)];
        setVersiculo(random);
      })
      .catch((err) => console.error("Error cargando versículos:", err));
  }, []);

  const onSubmit = async (data: FormData) => {
  try {
    const response = await fetch("https://v1.nocodeapi.com/aikidoz/google_sheets/oNGBGDisljOJWUPO?spreadsheetId=17a-30hpP6gjMdilySl164YFx12BEmEHNgS23BU2kW2A&tabId=hoja1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([[data.iglesia, data.nombres, data.apellidos, data.celular, data.edad, data.distrito]]),
    });

    if (response.ok) {
      alert("✅ Registro exitoso. ¡Nos vemos en la confraternidad!");
      reset();
    } else {
      alert("❌ Error al guardar el registro. Intenta nuevamente.");
    }
  } catch (error) {
    console.error(error);
    alert("⚠️ Error de conexión. Revisa tu internet.");
  }
};

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0ea5e9 0%, #0369a1 50%, #075985 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_60%)] animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center p-4 mb-4 animate-fadeIn">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={logo}
            alt="Logo Iglesia"
            width={90}
            height={90}
            className="drop-shadow-lg"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-sky-100 tracking-wide drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]">
            CONFRATERNIDAD DE JÓVENES
          </h1>
        </div>

        <p className="italic text-lg md:text-xl text-sky-200 font-light mb-3">
          “JÓVENES LISTOS PARA LA GUERRA” <br /> 1 Juan 2:14
        </p>

        {/* Versículo visible */}
        {versiculo && (
          <div className="max-w-md bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-md border border-sky-200/30 text-sky-100 text-sm italic">
            📖 {versiculo}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-[90%] max-w-md space-y-4 border border-sky-200/30 transition hover:border-sky-100/70 hover:shadow-sky-300/20"
      >
        {["iglesia", "nombres", "apellidos", "celular", "edad", "distrito"].map(
          (campo) => (
            <input
              key={campo}
              {...register(campo as keyof FormData, {
                required: campo !== "edad" && campo !== "distrito",
              })}
              placeholder={
                campo === "iglesia"
                  ? "Nombre de la Iglesia"
                  : campo.charAt(0).toUpperCase() + campo.slice(1)
              }
              className="w-full p-3 rounded-lg bg-sky-900/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-sky-800/40 transition-all hover:bg-sky-800/50"
            />
          )
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 hover:shadow-sky-300/40 transition-all duration-200"
        >
          🙌 Registrar
        </button>
      </form>

      <footer className="relative z-10 mt-10 text-sky-100 text-sm text-center tracking-wide drop-shadow-sm">
        © 2025 Confraternidad Juvenil | DISEÑADO POR EL GRUPO DE MULTIMEDIA S.M.P
      </footer>
    </div>
  );
}
