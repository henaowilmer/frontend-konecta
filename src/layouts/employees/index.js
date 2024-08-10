import React, { useState, useEffect, Suspense, lazy, useContext } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import EmployeeService from "services/employee-service";
import TextField from "@mui/material/TextField";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import tableData from "layouts/employees/data";
import Pagination from "@mui/material/Pagination";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from "@mui/material/Button";
import MDSnackbar from "components/MDSnackbar";
import { AuthContext } from "context";
const DataTable = lazy(() => import("examples/Tables/DataTable"));
const FormEmployee = lazy(() => import("layouts/employees/form"));
const Dialog = lazy(() => import("@mui/material/Dialog"));
const DialogActions = lazy(() => import("@mui/material/DialogActions"));
const DialogContent = lazy(() => import("@mui/material/DialogContent"));
const DialogContentText = lazy(() => import("@mui/material/DialogContentText"));
const DialogTitle = lazy(() => import("@mui/material/DialogTitle"));


function Tables() {
  const authContext = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ columns: [], rows: [], totalRecords: 0 });
  const [textFilter, setTextFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage]);

  async function fetchData() {
    setLoading(true);
    try {
      const result = await tableData({
        search: textFilter,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        page: currentPage,
        limit: rowsPerPage
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleCleanFilters = () => {
    setCurrentPage(1);
    setTextFilter("");
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleClickOpen = (index) => {
    if(authContext.isAdmin){
      setSelectedEmployeeIndex(index);
      setOpen(true);
    } else{
      openErrorSB();
    }
    
  };

  const handleClickOpenEdit = (index) => {
    if(authContext.isAdmin){
      const employeeId = data.rows[index].employeeId;
      setUpdateId(employeeId);
      setOpenCreateForm(true);
    } else{
      openErrorSB();
    }
  };
  
  const handleClose = () => {
    setOpen(false);
    setSelectedEmployeeIndex(null);
  };

  const handleDeleteEmployee = async () => {
    try {
      const employeeId = data.rows[selectedEmployeeIndex].employeeId;
      await EmployeeService.delete(employeeId);
      fetchData();
      handleClose();
      openSuccessSB();
      setTimeout(() => {
        closeSuccessSB();
      }, 1000);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleOpenCreateForm = () => {
    if(authContext.isAdmin){
      setOpenCreateForm(true);
    } else{
      openErrorSB();
    }
  };

  const handleCloseCreateForm = () => {
    setOpenCreateForm(false);
    setUpdateId(null);
  };

  const handleFormFinish = () => {
    setOpenCreateForm(false);
    fetchData();
    setUpdateId(null);
  };

  const renderSuccessSB = (
    <MDSnackbar
        color="success"
        icon="check"
        title="Éxito"
        content="Éxito, Empleado eliminado correctamente"
        dateTime=""
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
        color="error"
        icon="warning"
        title="Error"
        content="Error, No tiene permiso para ejecutar esta acción"
        dateTime=""
        open={errorSB}
        onClose={closeErrorSB}
        close={closeErrorSB}
        bgWhite
    />
);

return (
  <DashboardLayout>
    <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
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
                  Tabla de empleados
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Buscar..."
                      variant="outlined"
                      fullWidth
                      value={textFilter}
                      onChange={(e) => setTextFilter(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha de inicio"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha de fin"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={4} sm={1} md={1}>
                    <Tooltip title='Filtrar' placement="bottom">
                      <MDButton
                        variant="gradient"
                        color="info"
                        type="button"
                        onClick={handleApplyFilters}
                      >
                        <Icon>filter_alt</Icon>
                      </MDButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4} sm={1} md={1}>
                    <Tooltip title='Limpiar' placement="bottom">
                      <MDButton
                        variant="gradient"
                        color="info"
                        type="button"
                        onClick={handleCleanFilters}
                      >
                        <Icon>filter_alt_off</Icon>
                      </MDButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4} sm={1} md={1}>
                    <Tooltip title='Crear' placement="bottom">
                      <MDButton
                        variant="gradient"
                        color="info"
                        type="button"
                        onClick={handleOpenCreateForm}
                      >
                        <Icon>add</Icon>
                      </MDButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3}>
                {!loading ? (
                  <Suspense fallback={<CircularProgress color="info" />}>
                    <DataTable
                      table={{ columns: data.columns, rows: data.rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                      onRowAction={(action, row) => {
                        if (action === 'delete') {
                          handleClickOpen(row.id);
                        }
                        if (action === 'update') {
                          handleClickOpenEdit(row.id);
                        }
                      }}
                    />
                    <MDBox display="flex" m={2} alignItems="center" justifyContent="flex-end">
                      <MDBox width="6rem">
                        <TextField
                          size="small"
                          select
                          fullWidth
                          label={`${((currentPage - 1) * rowsPerPage + 1)}-${(Math.min(currentPage * rowsPerPage, data.totalRecords))} de ${data.totalRecords}`}
                          value={rowsPerPage}
                          onChange={handleRowsPerPageChange}
                          SelectProps={{
                            native: true,
                          }}
                        >
                          {[10, 25, 50].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </TextField>
                      </MDBox>
                      <Pagination
                        count={data.totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="info"
                      />
                    </MDBox>
                  </Suspense>
                ) : (
                  <Grid item >
                    <MDBox display="flex" m={2} alignItems="center" justifyContent="center">
                      <CircularProgress color="info" />
                      <MDTypography m={2} variant="h6">Cargando datos...</MDTypography>
                    </MDBox>
                  </Grid>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Suspense fallback={<CircularProgress color="info" />}>
        <Dialog
          open={open}
          onClose={handleClose}
          disableScrollLock
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro de que desea eliminar este registro?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteEmployee} color="primary">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openCreateForm}
          onClose={handleCloseCreateForm}
          disableScrollLock
        >
          <FormEmployee onFinish={handleFormFinish} updateId={updateId} />
        </Dialog>
      </Suspense>
      {renderSuccessSB}
      {renderErrorSB}
    </DashboardLayout>
  );
}

export default Tables;
