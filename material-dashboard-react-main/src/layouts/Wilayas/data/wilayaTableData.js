import { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import { getAllWilayas, deleteWilaya } from "../../../services/wilayaService";

export default function useWilayaData() {
  const [wilayas, setWilayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState({});

  const fetchWilayas = async () => {
    try {
      const data = await getAllWilayas();
      setWilayas(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWilayas();
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
        await deleteWilaya(id);
        setLoading(true);
        await fetchWilayas();

        Swal.fire({
          title: "Deleted!",
          text: "Wilaya has been deleted.",
          icon: "success",
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the wilaya.",
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
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: wilayas
      ? wilayas.map((wilaya) => ({
          id: wilaya.wilayaID,
          name: wilaya.name,
          action: (
            <div>
              <IconButton onClick={(event) => handleOpen(event, wilaya.wilayaID)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl[wilaya.wilayaID]}
                open={Boolean(anchorEl[wilaya.wilayaID])}
                onClose={() => handleClose(wilaya.wilayaID)}
              >
                <MenuItem
                  onClick={() => {
                    handleDelete(wilaya.wilayaID);
                    handleClose(wilaya.wilayaID);
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
