import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import tableDataUser from "layouts/users/data";
import tableDataEmployee from "layouts/employees/data";
import tableDataRequest from "layouts/requests/data-table";
import React, { useState, useEffect } from "react";

function Dashboard() {

  const [dataUser, setDataUser] = useState({ columns: [], rows: [], totalRecords: 0 });
  const [dataRequest, setDataRequest] = useState({ columns: [], rows: [], totalRecords: 0 });
  const [dataEmployee, setDataEmployee] = useState({ columns: [], rows: [], totalRecords: 0 });

  useEffect(() => {
    fetchDataUser();
    fetchDataRequest();
    fetchDataEmployee();
  }, []);

  async function fetchDataUser() {
    try {
      const result = await tableDataUser({search:'', page:1, limit:1, startDate:'', endDate:''});
      setDataUser(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchDataEmployee() {
    try {
      const result = await tableDataEmployee({search:'', page:1, limit:1, startDate:'', endDate:''});
      setDataEmployee(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchDataRequest() {
    try {
      const result = await tableDataRequest({search:'', page:1, limit:1, startDate:'', endDate:''});
      setDataRequest(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="checklist"
                title="Solicitudes"
                count={dataRequest.totalRecords}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="table_view"
                title="Empleados"
                count={dataEmployee.totalRecords}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="group"
                title="Usuarios"
                count={dataUser.totalRecords}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid> 
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
