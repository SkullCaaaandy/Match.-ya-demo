const { supabase } = require('../config/db');

const ERROR_FALTAN_DATOS = 'El correo electrónico y la contraseña son obligatorios.';
const ERROR_SERVIDOR = 'Ocurrió un error interno en el servidor.';
const CODIGO_EXITO = 200;
const CODIGO_CREADO = 201;
const CODIGO_ERROR_CLIENTE = 400;
const CODIGO_ERROR_SERVIDOR = 500;

class AuthController {

    async registrarUsuario(peticionCliente, respuestaServidor) {
        try {
            const { correoElectronico, contrasena, rolUsuario, nombreCompleto } = peticionCliente.body;

            // Validación de campos obligatorios
            if (!correoElectronico || !contrasena) {
                return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                    mensaje: ERROR_FALTAN_DATOS
                });
            }

            if (!nombreCompleto || nombreCompleto.trim() === '') {
                return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                    mensaje: 'El nombre completo es obligatorio.'
                });
            }

            const rolFinal = rolUsuario || 'candidato';

            if (!['candidato', 'reclutador'].includes(rolFinal)) {
                return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                    mensaje: 'El rol seleccionado no es válido.'
                });
            }

            // Crear usuario en auth.users
            const { data: datosNuevos, error: errorSupabase } = await supabase.auth.signUp({
                email: correoElectronico,
                password: contrasena,
                options: {
                    data: {
                        rol: rolFinal,
                        nombre: nombreCompleto.trim()
                    }
                }
            });

            if (errorSupabase) {
                return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                    mensaje: errorSupabase.message
                });
            }

            const idUsuario = datosNuevos.user.id;

            // Insertar en la tabla correspondiente según el rol
            if (rolFinal === 'candidato') {

                const { error: errorCandidato } = await supabase
                    .from('candidatos')
                    .insert([{
                        id: idUsuario,
                        nombre_completo: nombreCompleto.trim(),
                        busqueda_activa: true
                    }]);

                if (errorCandidato) {
                    console.error('[auth] Error al insertar candidato:', errorCandidato.message);

                    return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
                        mensaje: 'Usuario creado pero no se pudo guardar el perfil del candidato.'
                    });
                }

            } else if (rolFinal === 'reclutador') {

                const { error: errorReclutador } = await supabase
                    .from('reclutadores')
                    .insert([{
                        id: idUsuario,
                        nombre_empresa: nombreCompleto.trim()
                    }]);

                if (errorReclutador) {
                    console.error('[auth] Error al insertar reclutador:', errorReclutador.message);

                    return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
                        mensaje: 'Usuario creado pero no se pudo guardar el perfil del reclutador.'
                    });
                }
            }

            return respuestaServidor.status(CODIGO_CREADO).json({
                mensaje: 'Usuario registrado exitosamente',
                usuario: datosNuevos.user
            });

        } catch (excepcionSistema) {
            console.error(ERROR_SERVIDOR, excepcionSistema);

            return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
                mensaje: ERROR_SERVIDOR
            });
        }
    }

    async iniciarSesion(peticionCliente, respuestaServidor) {
        try {
            const { correoElectronico, contrasena, rolUsuario } = peticionCliente.body;

            // Validación de campos obligatorios
            if (!correoElectronico || !contrasena || !rolUsuario) {
                return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                    mensaje: 'Faltan datos obligatorios.'
                });
            }

            const { data: datosAuth, error: errorAuth } = await supabase.auth.signInWithPassword({
                email: correoElectronico,
                password: contrasena
            });

            // Mensaje genérico para fallo de credenciales
            if (errorAuth) {
                return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                    mensaje: 'Credenciales inválidas. Verifica tu correo, contraseña y rol seleccionado.'
                });
            }

            // Validación de seguridad del rol
            const rolReal = datosAuth.user.user_metadata.rol;

            if (rolReal !== rolUsuario) {
                return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                    mensaje: 'Credenciales inválidas. Verifica tu correo, contraseña y rol seleccionado.'
                });
            }

            return respuestaServidor.status(CODIGO_EXITO).json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: datosAuth.user
            });

        } catch (excepcionSistema) {
            console.error('Error en el servidor:', excepcionSistema);

            return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
                mensaje: ERROR_SERVIDOR
            });
        }
    }
}

module.exports = new AuthController();