import { useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { motion } from "framer-motion";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";

// Data
import skillsTableData from "layouts/skills/data/skillsTableData";

function Skills() {
  const { columns, rows } = skillsTableData();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchByCategory, setSearchByCategory] = useState(false); // افتراضي البحث في الاسم فقط

  // البحث حسب وضع التبديل
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return searchByCategory
        ? row.categoryName.toLowerCase().includes(lowerSearchTerm) // البحث في الفئة فقط
        : row.name.toLowerCase().includes(lowerSearchTerm); // البحث في الاسم فقط
    });
  }, [searchTerm, searchByCategory, rows]);

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
                label={`🔍 Search by ${searchByCategory ? "Category" : "Name"}`}
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

          {/* Toggle Search Mode (Switch) */}
          <Grid item xs={12} md={6} display="flex" alignItems="center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={searchByCategory}
                    onChange={() => setSearchByCategory(!searchByCategory)}
                  />
                }
                label={searchByCategory ? "Search by Category" : "Search by Name"}
              />
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
                    Skills ({filteredRows.length})
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

export default Skills;
