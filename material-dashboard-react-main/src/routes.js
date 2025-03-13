import Dashboard from "layouts/dashboard";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import Companies from "layouts/Companies";
import JobSeekers from "layouts/JobSeekers";
import Wilayas from "layouts/Wilayas";
import SkillCategories from "layouts/skillCategories";
import Skills from "layouts/skills";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Companies",
    key: "companies",
    icon: <Icon fontSize="small">business</Icon>,
    route: "/companies",
    component: <Companies />,
  },
  {
    type: "collapse",
    name: "JobSeekers",
    key: "jobSeekers",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/jobSeekers",
    component: <JobSeekers />,
  },
  {
    type: "collapse",
    name: "Wilayas",
    key: "wilayas",
    icon: <Icon fontSize="small">map</Icon>,
    route: "/wilayas",
    component: <Wilayas />,
  },
  {
    type: "collapse",
    name: "SkillCategories",
    key: "skillCategories",
    icon: <Icon fontSize="small">category</Icon>,
    route: "/skillCategories",
    component: <SkillCategories />,
  },
  {
    type: "collapse",
    name: "Skills",
    key: "skills",
    icon: <Icon fontSize="small">code</Icon>,
    route: "/skills",
    component: <Skills />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">payments</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications_active</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">account_circle</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
