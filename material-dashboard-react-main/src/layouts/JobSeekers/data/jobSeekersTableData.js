import { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import Swal from "sweetalert2";

import {
  getAllJobSeekers,
  deleteJobSeeker,
  updateJobSeekerActivityStatus,
} from "../../../services/JobSeekerService";

export default function useJobSeekerData() {
  const [jobSeekers, setJobSeekers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState({});

  const fetchJobSeekers = async () => {
    try {
      const data = await getAllJobSeekers();
      setJobSeekers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobSeekers();
  }, [jobSeekers]);

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      await updateJobSeekerActivityStatus(id, !currentStatus);
      setLoading(true);
      await fetchJobSeekers();
    } catch (error) {}
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
        await deleteJobSeeker(id);
        setLoading(true);
        await fetchJobSeekers();

        Swal.fire({
          title: "Deleted!",
          text: "jobSeeker has been deleted.",
          icon: "success",
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the jobSeeker.",
          icon: "error",
        });
      }
    }
  };

  const handleOpen = (event, id) => setAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
  const handleClose = (id) => setAnchorEl((prev) => ({ ...prev, [id]: null }));

  if (loading) return { columns: [], rows: [], loading: true, error: null };
  if (error) return { columns: [], rows: [], loading: false, error };

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "30%", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Gender", accessor: "gender", align: "center" },
      { Header: "Active", accessor: "active", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: jobSeekers
      ? jobSeekers.map((jobSeeker) => ({
          name: jobSeeker.firstName + " " + jobSeeker.lastName,
          email: jobSeeker.email,
          gender: jobSeeker.gender == 0 ? "Male" : "Female",
          isActiveBoolean: Boolean(jobSeeker.isActive),
          active: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={jobSeeker.isActive ? "YES" : "NO"}
                color={jobSeeker.isActive ? "success" : "error"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          action: (
            <div>
              <IconButton onClick={(event) => handleOpen(event, jobSeeker.jobSeekerID)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl[jobSeeker.jobSeekerID]}
                open={Boolean(anchorEl[jobSeeker.jobSeekerID])}
                onClose={() => handleClose(jobSeeker.jobSeekerID)}
              >
                <MenuItem
                  onClick={() => {
                    toggleActiveStatus(jobSeeker.jobSeekerID, jobSeeker.isActive);
                    handleClose(jobSeeker.jobSeekerID);
                  }}
                >
                  <ListItemIcon>
                    <PowerSettingsNewIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={jobSeeker.isActive ? "Deactivate" : "Activate"} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleDelete(jobSeeker.jobSeekerID);
                    handleClose(jobSeeker.jobSeekerID);
                  }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </MenuItem>

                <MenuItem onClick={() => alert(`Details of ${jobSeeker.firstName}`)}>
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
