import { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import { getAllSkills, deleteSkill } from "../../../services/skillService";

export default function useSkillData() {
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState({});

  const fetchSkills = async () => {
    try {
      const data = await getAllSkills();
      setSkills(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
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
        await deleteSkill(id);
        setLoading(true);
        await fetchSkills();

        Swal.fire({
          title: "Deleted!",
          text: "Skill has been deleted.",
          icon: "success",
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the skill.",
          icon: "error",
        });
      }
    }
  };

  const handleOpen = (event, id) => setAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
  const handleClose = (id) => setAnchorEl((prev) => ({ ...prev, [id]: null }));

  return {
    columns: [
      { Header: "ID", accessor: "id", align: "left" },
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Category", accessor: "categoryName", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: skills
      ? skills.map((skill) => ({
          id: skill.skillID,
          name: skill.skillName,
          categoryName: skill.categoryName,
          action: (
            <div>
              <IconButton onClick={(event) => handleOpen(event, skill.skillID)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl[skill.skillID]}
                open={Boolean(anchorEl[skill.skillID])}
                onClose={() => handleClose(skill.skillID)}
              >
                <MenuItem
                  onClick={() => {
                    handleDelete(skill.skillID);
                    handleClose(skill.skillID);
                  }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </MenuItem>

                <MenuItem onClick={() => alert(`Details of ${skill.skillName}`)}>
                  <ListItemIcon>
                    <VisibilityIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Details" />
                </MenuItem>
              </Menu>
            </div>
          ),
        }))
      : [],
  };
}
