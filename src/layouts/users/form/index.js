import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import UserService from "services/user-service";
import MDSnackbar from "components/MDSnackbar";
import CircularProgress from '@mui/material/CircularProgress';

function CreateUserForm({ onFinish, updateId }) {

    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(updateId || null);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [errorName, setErrorName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorRole, setErrorRole] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);

    useEffect(() => {
        setId(updateId || null);
        if (updateId) {
            loadUserData();
        }
    }, [updateId]);

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title="Error"
            content={error}
            dateTime=""
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );
    
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Éxito"
            content="Éxito, Usuario guardado correctamente"
            dateTime=""
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    const loadUserData = async () => {
        try {
            if (id) {
                setLoading(true);
                const response = await UserService.getId(id);
                setName(response.data.name);
                setEmail(response.data.email);
                setRole(response.data.role);
            } else{
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Error al cargar los datos del usuario. Inténtelo de nuevo.");
            openErrorSB();
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 600);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let validation = true;
            if (!name) {
                setErrorName(true);
                validation = false;
            } else setErrorName(false);
            if (!password) {
                setErrorPassword(true);
                validation = false;
            } else setErrorPassword(false);
            if (!email) {
                setErrorEmail(true);
                validation = false;
            } else setErrorEmail(false);
            if (!role) {
                setErrorRole(true);
                validation = false;
            } else setErrorRole(false);

            if (!validation) {
                setError("Error, por favor diligencie todos los campos");
                openErrorSB();
                return;
            }

            const newUser = {
                name,
                email,
                role,
                password
            };

            if(!id){
                await UserService.create(newUser);
            } else{
                await UserService.update(newUser, id);
            }
            
            setError("");
            openSuccessSB();
            setTimeout(() => {
                if (onFinish) onFinish();
            }, 1000);
        } catch (error) {
            console.error(error);
            setError("Error al crear el usuario. Inténtelo de nuevo.");
            openErrorSB();
            setLoading(false);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <MDBox pt={6} pb={3}>
            <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
            >
                <MDTypography variant="h6" color="white">
                    Usuario
                </MDTypography>
            </MDBox>
            <MDBox p={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            error={errorName}
                            helperText={errorName ? "Por favor, ingrese el nombre." : ""}
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrorName(false);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={errorEmail}
                            helperText={errorEmail ? "Por favor, ingrese el correo." : ""}
                            label="Correo"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrorEmail(false);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            error={errorRole}
                            helperText={errorRole ? "Por favor, seleccione el rol." : ""}
                            select
                            fullWidth
                            label="Rol"
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                setErrorRole(false);
                            }}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value={null}></option>
                            <option value={'admin'}>Admin</option>
                            <option value={'employee'}>Empleado</option>
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            error={errorPassword}
                            helperText={errorPassword ? "Por favor, ingrese la contraseña." : ""}
                            label="Contraseña"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrorPassword(false);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {loading ? (
                            <>
                            <MDBox display="flex" m={2} alignItems="center" justifyContent="center">
                                <CircularProgress color="info" />
                            </MDBox>
                            </>
                        ) : (
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                onClick={handleSubmit}
                            >
                                Guardar
                            </MDButton>
                        )}
                    </Grid>
                    
                    {renderErrorSB}
                    {renderSuccessSB}
                </Grid>
            </MDBox>
        </MDBox>
    );
}

export default CreateUserForm;
