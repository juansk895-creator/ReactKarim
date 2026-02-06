import { createLog } from '../models/logs.model.js';

export async function registerBitacora({
    responsable,
    objetivo,
    accion
}) {
    try {

        //const responsable_nombre = `${responsable.nombre ?? ""} ${responsable.apellido_pat ?? ""} ${responsable_mat ?? ""}`.trim();
        const responsable_nombre = [
            responsable.nombre,
            responsable.apellido_pat,
            responsable.apellido_mat,
        ].filter(Boolean).join(" ").trim() || responsable.email || "Sistema";

        const objetivo_nombre = `${objetivo.nombre ?? ""} ${objetivo.apellido_pat ?? ""} ${objetivo.apellido_mat ?? ""}`.trim();

        await createLog(
            responsable.id,
            responsable_nombre,
            objetivo.id,
            objetivo_nombre,
            accion
        );
    } catch (err) {
        console.error("Error registrando bitácora: ", err);
    }
}

