import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import RequestService from "services/request-service";
import MDSnackbar from "components/MDSnackbar";
import CircularProgress from '@mui/material/CircularProgress';

function CreateRequestForm({ onFinish, updateId, employeesOptions }) {

    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(updateId || null);
    const [employees, setDataEmployees] = useState([]);
    const [code, setCode] = useState("");
    const [employee_id, setEmployeeId] = useState("");
    const [description, setDescription] = useState("");
    const [resumen, setResumen] = useState("");
    const [error, setError] = useState("");
    const [errorCode, setErrorCode] = useState(false);
    const [errorEmployeeId, setErrorEmployeeId] = useState(false);
    const [errorDescription, setErrorDescription] = useState(false);
    const [errorResumen, setErrorResumen] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);

    useEffect(() => {
        setId(updateId || null);
        setDataEmployees(employeesOptions || null);
        if (updateId) {
            loadRequestData();
        }
    }, [updateId, employeesOptions]);

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
            content="Éxito, Solicitud guardado correctamente"
            dateTime=""
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    const loadRequestData = async () => {
        try {
            if (id) {
                setLoading(true);
                const response = await RequestService.getId(id);
                setCode(response.data.code);
                setEmployeeId(response.data.employee_id);
                setDescription(response.data.description);
                setResumen(response.data.resumen);
            } else{
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching request data:", error);
            setError("Error al cargar los datos del solicitud. Inténtelo de nuevo.");
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
            if (!code) {
                setErrorCode(true);
                validation = false;
            } else setErrorCode(false);
            if (!employee_id) {
                setErrorEmployeeId(true);
                validation = false;
            } else setErrorEmployeeId(false);
            if (!description) {
                setErrorDescription(true);
                validation = false;
            } else setErrorDescription(false);
            if (!resumen) {
                setErrorResumen(true);
                validation = false;
            } else setErrorResumen(false);

            if (!validation) {
                setError("Error, por favor diligencie todos los campos");
                openErrorSB();
                return;
            }

            const newRequest = {
                code,
                employee_id,
                description,
                resumen
            };

            if(!id){
                await RequestService.create(newRequest);
            } else{
                await RequestService.update(newRequest, id);
            }
            
            setError("");
            openSuccessSB();
            setTimeout(() => {
                if (onFinish) onFinish();
            }, 1000);
        } catch (error) {
            console.error(error);
            setError("Error al crear el solicitud. Inténtelo de nuevo.");
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
                    Solicitud
                </MDTypography>
            </MDBox>
            <MDBox p={3}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <TextField
                            error={errorCode}
                            helperText={errorCode ? "Por favor, ingrese el código." : ""}
                            label="Codigo"
                            variant="outlined"
                            fullWidth
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setErrorCode(false);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            error={errorEmployeeId}
                            helperText={errorCode ? "Por favor, seleccione el empleado." : ""}
                            select
                            fullWidth
                            label="Empleado"
                            value={employee_id}
                            onChange={(e) => {
                                setEmployeeId(e.target.value);
                                setErrorEmployeeId(false);
                            }}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value={null}></option>
                            {employees.map((option) => (
                                <option key={option.id} value={option.id}>
                                {option.id}-{option.name}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={errorDescription}
                            helperText={errorDescription ? "Por favor, ingrese la descripción." : ""}
                            label="Descripción"
                            variant="outlined"
                            fullWidth
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                setErrorDescription(false);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={errorResumen}
                            helperText={errorResumen ? "Por favor, ingrese el resumen." : ""}
                            label="Resumen"
                            variant="outlined"
                            fullWidth
                            value={resumen}
                            onChange={(e) => {
                                setResumen(e.target.value);
                                setErrorResumen(false);
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

export default CreateRequestForm;
