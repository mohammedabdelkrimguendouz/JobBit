// SkillCategories.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Card,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";

import {
  getAllSkillCategories,
  deleteSkillCategory,
  addSkillCategory,
  updateSkillCategory,
} from "../../services/skillCategoryService";

function SkillCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ id: null, name: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllSkillCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSkillCategory(id);
        fetchCategories();
        Swal.fire("Deleted!", "Skill Category has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete the category", "error");
      }
    }
  };

  const handleOpen = (event, id) => setAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
  const handleClose = (id) => setAnchorEl((prev) => ({ ...prev, [id]: null }));

  const handleOpenDialog = (category = null) => {
    if (category) setForm({ id: category.skillCategoryID, name: category.name });
    else setForm({ id: null, name: "" });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (form.id) await updateSkillCategory(form.id, form.name);
      else await addSkillCategory(form.name);
      fetchCategories();
      setOpenDialog(false);
    } catch (err) {
      Swal.fire("Error", "Failed to save category", "error");
    }
  };

  const columns = [
    { Header: "ID", accessor: "id", align: "center" },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Actions", accessor: "actions", align: "center" },
  ];

  const rows = useMemo(() => {
    return categories
      .filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((category) => ({
        id: category.skillCategoryID,
        name: category.name,
        actions: (
          <div>
            <IconButton onClick={(event) => handleOpen(event, category.skillCategoryID)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl[category.skillCategoryID]}
              open={Boolean(anchorEl[category.skillCategoryID])}
              onClose={() => handleClose(category.skillCategoryID)}
            >
              <MenuItem
                onClick={() => {
                  handleDelete(category.skillCategoryID);
                  handleClose(category.skillCategoryID);
                }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleOpenDialog(category);
                  handleClose(category.skillCategoryID);
                }}
              >
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Edit" />
              </MenuItem>
            </Menu>
          </div>
        ),
      }));
  }, [categories, searchTerm, anchorEl]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} justifyContent="center">
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
          <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={() => handleOpenDialog()}>
              + Add Skill Category
            </Button>
          </Grid>
        </Grid>

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
                    Skill Categories ({rows.length})
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows }}
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

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{form.id ? "Edit Skill Category" : "Add Skill Category"}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </MDBox>
    </DashboardLayout>
  );
}

export default SkillCategories;
