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
  getAllCompanies,
  deleteCompany,
  updateCompanyActivityStatus,
} from "../../../services/companyService";

export default function useCompanyData() {
  const [companies, setCompanies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState({});

  const fetchCompanies = async () => {
    try {
      const data = await getAllCompanies();
      setCompanies(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [companies]);

  if (loading) return { columns: [], rows: [], loading: true, error: null };
  if (error) return { columns: [], rows: [], loading: false, error };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      await updateCompanyActivityStatus(id, !currentStatus);
      setLoading(true);
      await fetchCompanies();
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
        await deleteCompany(id);
        setLoading(true);
        await fetchCompanies();

        Swal.fire({
          title: "Deleted!",
          text: "Company has been deleted.",
          icon: "success",
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the company.",
          icon: "error",
        });
      }
    }
  };

  const handleOpen = (event, id) => setAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
  const handleClose = (id) => setAnchorEl((prev) => ({ ...prev, [id]: null }));

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "30%", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Wilaya", accessor: "wilaya", align: "center" },
      { Header: "Active", accessor: "active", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: companies
      ? companies.map((company) => ({
          name: company.companyName,
          email: company.email,
          wilaya: company.wilayaName,
          isActiveBoolean: Boolean(company.isActive),
          active: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={company.isActive ? "YES" : "NO"}
                color={company.isActive ? "success" : "error"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          action: (
            <div>
              <IconButton onClick={(event) => handleOpen(event, company.companyID)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl[company.companyID]}
                open={Boolean(anchorEl[company.companyID])}
                onClose={() => handleClose(company.companyID)}
              >
                <MenuItem
                  onClick={() => {
                    toggleActiveStatus(company.companyID, company.isActive);
                    handleClose(company.companyID);
                  }}
                >
                  <ListItemIcon>
                    <PowerSettingsNewIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={company.isActive ? "Deactivate" : "Activate"} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleDelete(company.companyID);
                    handleClose(company.companyID);
                  }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </MenuItem>

                <MenuItem onClick={() => alert(`Details of ${company.companyName}`)}>
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
