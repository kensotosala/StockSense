# Autenticación JWT (backend)

La API usa OAuth2 Password Bearer: el cliente envía `username` y `password` como
formulario a `POST /api/token` y recibe un `access_token`. En las siguientes
peticiones protegidas debe enviar `Authorization: Bearer <access_token>`.

Antes de iniciar el backend, configura una clave privada de al menos 32
caracteres. En PowerShell puedes generar una para esta sesión y exportarla así:

```powershell
$env:SECRET_KEY = (python -c "import secrets; print(secrets.token_hex(32))")
Set-Location backend
uv run fastapi dev main.py
```

No guardes la clave en Git. En un entorno estable, conserva la misma clave
entre reinicios; cambiarla invalida los tokens ya emitidos. La clave que estaba
escrita en el código debe considerarse expuesta y reemplazarse. Los usuarios
nuevos se almacenan con contraseñas hasheadas; la respuesta pública nunca
incluye ese hash. Las cuentas creadas anteriormente con contraseñas en texto
plano necesitan restablecer su contraseña antes de poder iniciar sesión.