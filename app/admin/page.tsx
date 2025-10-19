"use client";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Registro = {
    iglesia: string;
    nombres: string;
    apellidos: string;
    celular: string;
    edad: string;
    distrito: string;
    };

    export default function AdminPage() {
    const [registros, setRegistros] = useState<Registro[]>([]);

    useEffect(() => {
    fetch("https://v1.nocodeapi.com/aikidoz/google_sheets/oNGBGDisljOJWUPO?spreadsheetId=17a-30hpP6gjMdilySl164YFx12BEmEHNgS23BU2kW2A")
    .then((res) => res.json())
    .then((data) => {
        const registrosFormateados = data.data.map((r: any) => ({
        iglesia: r.iglesia || "",
        nombres: r.nombres || "",
        apellidos: r.apellidos || "",
        celular: r.celular || "",
        edad: r.edad || "",
        distrito: r.distrito || "",
        }));
        setRegistros(registrosFormateados);
    })
    .catch((err) => console.error("Error al cargar registros:", err));
}, []);

const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(registros);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registros");
        XLSX.writeFile(wb, "registros_confraternidad.xlsx");
    };

    // 🔹 Exportar a PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Registros - Confraternidad Juvenil", 14, 10);
        const tableData = registros.map((r) => [
        r.iglesia,
        `${r.nombres} ${r.apellidos}`,
        r.celular,
        r.edad,
        r.distrito,
        ]);

        autoTable(doc, {
        head: [["Iglesia", "Nombre Completo", "Celular", "Edad", "Distrito"]],
        body: tableData,
        startY: 20,
        });

        doc.save("registros_confraternidad.pdf");
    };

    // 🔹 Eliminar registro individual
    const eliminarRegistro = (index: number) => {
        if (confirm("¿Seguro que deseas eliminar este registro?")) {
        const nuevos = registros.filter((_, i) => i !== index);
        setRegistros(nuevos);
        localStorage.setItem("registrosConfraternidad", JSON.stringify(nuevos));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-900 to-blue-950 text-white p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-300 drop-shadow-md">
            📋 Panel del Administrador - Confraternidad Juvenil
        </h1>

        {/* Botones de exportación */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
            onClick={exportToExcel}
            className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
            📗 Exportar a Excel
            </button>
            <button
            onClick={exportToPDF}
            className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
            >
            📕 Exportar a PDF
            </button>
        </div>

        {/* Tabla de registros */}
        <div className="overflow-x-auto">
            <table className="w-full border border-cyan-600/30 text-sm backdrop-blur-md bg-white/5 rounded-lg">
            <thead className="bg-blue-800/70 text-cyan-100">
                <tr>
                <th className="p-2 border border-cyan-600/30">Iglesia</th>
                <th className="p-2 border border-cyan-600/30">Nombre</th>
                <th className="p-2 border border-cyan-600/30">Celular</th>
                <th className="p-2 border border-cyan-600/30">Edad</th>
                <th className="p-2 border border-cyan-600/30">Distrito</th>
                <th className="p-2 border border-cyan-600/30">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {registros.length > 0 ? (
                registros.map((r, i) => (
                    <tr
                    key={i}
                    className="text-center hover:bg-blue-800/30 transition-all"
                    >
                    <td className="border border-cyan-600/20 p-2">{r.iglesia}</td>
                    <td className="border border-cyan-600/20 p-2">
                        {r.nombres} {r.apellidos}
                    </td>
                    <td className="border border-cyan-600/20 p-2">{r.celular}</td>
                    <td className="border border-cyan-600/20 p-2">{r.edad}</td>
                    <td className="border border-cyan-600/20 p-2">{r.distrito}</td>
                    <td className="border border-cyan-600/20 p-2">
                        <button
                        onClick={() => eliminarRegistro(i)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white text-xs transition-all"
                        >
                        🗑️ Borrar
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td
                    colSpan={6}
                    className="text-center text-cyan-300 py-4 italic"
                    >
                    No hay registros guardados todavía.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
}
