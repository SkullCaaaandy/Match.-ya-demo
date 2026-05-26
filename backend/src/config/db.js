const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const URL_BASE = process.env.SUPABASE_URL;
const LLAVE_PUBLICA = process.env.SUPABASE_KEY;

class SupabaseService {
    constructor() {
        if (!URL_BASE || !LLAVE_PUBLICA) {
            throw new Error('Faltan credenciales de Supabase en el archivo .env');
        }
        
        this.clienteBd = createClient(URL_BASE, LLAVE_PUBLICA);
    }

    obtenerCliente() {
        return this.clienteBd;
    }
}

const servicioBaseDatos = new SupabaseService();
const supabase = servicioBaseDatos.obtenerCliente();

module.exports = {
    supabase
};