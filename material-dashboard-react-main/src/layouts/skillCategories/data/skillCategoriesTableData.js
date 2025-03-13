import { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import { getAllSkillCategories, deleteSkillCategory } from "../../../services/skillCategoryService";

export default function useSkillCategoryData() {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState({});

  const fetchCategories = async () => {
    try {
      const data = await getAllSkillCategories();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return { columns: [], rows: [], loading: true, error: null };
  if (error) return { columns: [], rows: [], loading: false, error };

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
        setLoading(true);
        await fetchCategories();

        Swal.fire({
          title: "Deleted!",
          text: "Skill Category has been deleted.",
          icon: "success",
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the skill category.",
          icon: "error",
        });
      }
    }
  };

  const handleOpen = (event, id) => setAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
  const handleClose = (id) => setAnchorEl((prev) => ({ ...prev, [id]: null }));

  return {
    columns: [
      { Header: "ID", accessor: "id", align: "center" },
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],

    rows: categories
      ? categories.map((category) => ({
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

                <MenuItem onClick={() => alert(`Edit ${wilaya.name}`)}>
                  <ListItemIcon>
                    <VisibilityIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Edit" />
                </MenuItem>
              </Menu>
            </div>
          ),
        }))
      : [],
  };
}
