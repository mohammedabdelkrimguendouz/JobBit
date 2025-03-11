import { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";

// استيراد البيانات من API
import useWilayaData from "../staticData/data/wilayaTableData";
import useSkillData from "../staticData/data/skillsTableData";
import useSkillCategoriesData from "../staticData/data/skillCategoriesTableData";

function StaticData() {
  const [activeTab, setActiveTab] = useState("wilaya");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newData, setNewData] = useState({ id: "", name: "", iconUrl: "", categoryID: "" });

  const { data: wilayaData, setData: setWilayaData } = useWilayaData();
  const { data: skillsData, setData: setSkillsData } = useSkillData();
  const { data: skillCategoriesData } = useSkillCategoriesData();

  console.log(wilayaData);
  const data = {
    wilaya: wilayaData || [],
    skills: (skillsData || []).map((skill) => ({
      ...skill,
      categoryName:
        (skillCategoriesData || []).find((cat) => cat.id === skill.categoryID)?.name || "Unknown",
    })),
    skillCategories: skillCategoriesData || [],
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredRows = useMemo(() => {
    return data[activeTab].filter((row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeTab, data]);

  const columns = useMemo(() => {
    const baseColumns = [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
    ];

    const IconCell = ({ value }) => (value ? <img src={value} alt="icon" width={30} /> : null);
    IconCell.propTypes = { value: PropTypes.string };

    if (activeTab === "skills") {
      baseColumns.push(
        { Header: "Icon", accessor: "iconUrl", Cell: IconCell },
        { Header: "Category", accessor: "categoryName" }
      );
    }

    return [
      ...baseColumns,
      {
        Header: "Actions",
        accessor: "actions",
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => (
          <>
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                // eslint-disable-next-line react/prop-types
                handleEdit(row.original)
              }
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              color="secondary"
              // eslint-disable-next-line react/prop-types
              onClick={() => handleDelete(row.original.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        ),
      },
    ];
  }, [activeTab, data]);

  const handleEdit = (row) => {
    setEditMode(true);
    setSelectedId(row.id);
    setNewData(row);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    if (activeTab === "wilaya") setWilayaData((prev) => prev.filter((item) => item.id !== id));
    if (activeTab === "skills") setSkillsData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenModal = () => {
    setEditMode(false);
    setSelectedId(null);
    setNewData({ id: "", name: "", iconUrl: "", categoryID: "" });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleSave = () => {
    if (editMode) {
      if (activeTab === "wilaya")
        setWilayaData((prev) => prev.map((item) => (item.id === selectedId ? newData : item)));
      if (activeTab === "skills")
        setSkillsData((prev) => prev.map((item) => (item.id === selectedId ? newData : item)));
    } else {
      if (activeTab === "wilaya")
        setWilayaData((prev) => [...prev, { ...newData, id: Date.now() }]);
      if (activeTab === "skills")
        setSkillsData((prev) => [...prev, { ...newData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="🔍 Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="🌍 Wilaya" value="wilaya" />
              <Tab label="💡 Skills" value="skills" />
              <Tab label="📂 Skill Categories" value="skillCategories" />
            </Tabs>
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          ➕ Add New {activeTab}
        </Button>

        <DataTable table={{ columns, rows: filteredRows }} />

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>
            {editMode ? "Edit" : "Add New"} {activeTab}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={newData.name}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSave}>{editMode ? "Update" : "Add"}</Button>
          </DialogActions>
        </Dialog>
      </MDBox>
    </DashboardLayout>
  );
}

export default StaticData;
