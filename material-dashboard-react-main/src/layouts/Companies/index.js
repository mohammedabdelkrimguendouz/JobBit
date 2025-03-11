import { useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { motion } from "framer-motion";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";

// Data
import companiesTableData from "layouts/Companies/data/companiesTableData";

function Companies() {
  const { columns, rows } = companiesTableData();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // تصفية البيانات بناءً على البحث وحالة الشركة
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesName = row.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? row.isActiveBoolean === true
          : row.isActiveBoolean === false;

      return matchesName && matchesStatus;
    });
  }, [searchTerm, statusFilter, rows]);

  // إعداد الأنيميشن الافتراضي للعناصر
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        {/* Filters Section */}
        <Grid container spacing={3} justifyContent="center">
          {/* Search Filter */}
          <Grid item xs={12} md={6}>
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <TextField
                fullWidth
                label="🔍 Search by Name"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  height: "56px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                }}
              />
            </motion.div>
          </Grid>

          {/* Status Filter using Tabs */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <Tabs
                value={statusFilter}
                onChange={(event, newValue) => setStatusFilter(newValue)}
                centered
                textColor="primary"
                indicatorColor="primary"
                sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}
              >
                <Tab label="🔄 All" value="all" />
                <Tab label="✅ Active" value="active" />
                <Tab label="🚫 Inactive" value="inactive" />
              </Tabs>
            </motion.div>
          </Grid>
        </Grid>

        {/* Table Section */}
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
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
                    Companies ({filteredRows.length})
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows: filteredRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Companies;
