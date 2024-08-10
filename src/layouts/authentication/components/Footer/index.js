

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// @mui material components
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";


import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";


import typography from "assets/theme/base/typography";

function Footer({ light }) {
  const { size } = typography;
  const {pathname} = useLocation()

  return (
    <MDBox position={pathname !== '/auth/login' ? 'absolute' : 'relative'} width="100%" bottom={0} py={4}>
    </MDBox>
  );
}

// Setting default props for the Footer
Footer.defaultProps = {
  light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
