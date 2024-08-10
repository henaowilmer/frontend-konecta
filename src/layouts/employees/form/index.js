import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import EmployeeService from "services/employee-service";
import MDSnackbar from "components/MDSnackbar";
import CircularProgress from '@mui/material/CircularProgress';

function CreateEmployeeForm({ onFinish, updateId }) {

    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(updateId || null);
    const [name, setName] = useState("");
    const [dateOfAdmission, setDateOfAdmission] = useState("");
    const [salary, setSalary] = useState("");
    const [error, setError] = useState("");
    const [errorName, setErrorName] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [errorSalary, setErrorSalary] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);

    useEffect(() => {
        setId(updateId || null);
        if (updateId) {
            loadEmployeeData();
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
            content="Éxito, Empleado guardado correctamente"
            dateTime=""
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    const loadEmployeeData = async () => {
        try {
            if (id) {
                setLoading(true);
                const response = await EmployeeService.getId(id);
                const [datePart, timePart] = response.data.date_admission.split('T');
                setName(response.data.name);
                setDateOfAdmission(datePart);
                setSalary(response.data.salary);
            } else{
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching employee data:", error);
            setError("Error al cargar los datos del empleado. Inténtelo de nuevo.");
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
            if (!dateOfAdmission) {
                setErrorDate(true);
                validation = false;
            } else setErrorDate(false);
            if (!salary) {
                setErrorSalary(true);
                validation = false;
            } else setErrorSalary(false);

            if (!validation) {
                setError("Error, por favor diligencie todos los campos");
                openErrorSB();
                return;
            }

            const newEmployee = {
                name,
                date_admission: dateOfAdmission,
                salary
            };

            if(!id){
                await EmployeeService.create(newEmployee);
            } else{
                await EmployeeService.update(newEmployee, id);
            }
            
            setError("");
            openSuccessSB();
            setTimeout(() => {
                if (onFinish) onFinish();
            }, 1000);
        } catch (error) {
            console.error(error);
            setError("Error al crear el empleado. Inténtelo de nuevo.");
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
                    Empleado
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
                    <Grid item xs={6}>
                        <TextField
                            error={errorDate}
                            helperText={errorDate ? "Por favor, seleccione una fecha válida." : "Fecha admisión"}
                            variant="outlined"
                            fullWidth
                            type="date"
                            value={dateOfAdmission}
                            onChange={(e) => {
                                setDateOfAdmission(e.target.value);
                                setErrorDate(false);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            error={errorSalary}
                            helperText={errorSalary ? "Por favor, ingrese el salario." : ""}
                            label="Salario"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={salary}
                            onChange={(e) => {
                                setSalary(e.target.value);
                                setErrorSalary(false);
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

export default CreateEmployeeForm;
