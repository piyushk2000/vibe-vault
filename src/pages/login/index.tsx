import GoogleIcon from "@mui/icons-material/Google";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postDataToServer } from "../../services/postData";
import { COLORS } from "../../theme/colors";

interface LoginResponse {
  data: {
    token: string;
  };
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const respData = await postDataToServer<LoginResponse>({
      endPoint: "users/signin",
      data: {
        email,
        password,
      },
    });
    if (respData) {
      const token = respData?.data?.token;
      localStorage.setItem("token", token);
      navigate("/explore");
    } else {
      alert("Could not login");
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login logic
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.LOGIN_GRADIENT_START}, ${COLORS.LOGIN_GRADIENT_END})`,
        display: "flex",
        alignItems: "center",
        pt: -8,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: COLORS.LOGIN_CARD_BG,
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            boxShadow: `0 8px 32px ${COLORS.LOGIN_SHADOW}`,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: `0 12px 40px ${COLORS.LOGIN_HOVER_SHADOW}`,
              transform: "translateY(-2px)",
            },
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              color: COLORS.TEXT_PRIMARY,
              mb: 4,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${COLORS.LOGIN_BUTTON_GRADIENT[0]}, ${COLORS.LOGIN_BUTTON_GRADIENT[1]})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: COLORS.LOGIN_INPUT_BG,
                  "& fieldset": { borderColor: COLORS.BORDER },
                  "&:hover fieldset": { borderColor: COLORS.ACCENT },
                  "&.Mui-focused fieldset": { borderColor: COLORS.ACCENT },
                },
                "& label": {
                  color: COLORS.TEXT_SECONDARY,
                  "&.Mui-focused": { color: COLORS.ACCENT },
                },
                mb: 2,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: COLORS.LOGIN_INPUT_BG,
                  "& fieldset": { borderColor: COLORS.BORDER },
                  "&:hover fieldset": { borderColor: COLORS.ACCENT },
                  "&.Mui-focused fieldset": { borderColor: COLORS.ACCENT },
                },
                "& label": {
                  color: COLORS.TEXT_SECONDARY,
                  "&.Mui-focused": { color: COLORS.ACCENT },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                background: `linear-gradient(135deg, ${COLORS.LOGIN_BUTTON_GRADIENT[0]}, ${COLORS.LOGIN_BUTTON_GRADIENT[1]})`,
                border: "none",
                borderRadius: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 20px ${COLORS.LOGIN_SHADOW}`,
                },
              }}
            >
              Sign In
            </Button>
          </Box>

          <Divider sx={{ width: "100%", my: 3 }}>
            <Typography sx={{ color: COLORS.DIVIDER_TEXT }}>or</Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              mb: 3,
              color: COLORS.GOOGLE_BUTTON_TEXT,
              backgroundColor: COLORS.GOOGLE_BUTTON_BG,
              borderColor: COLORS.GOOGLE_BUTTON_BORDER,
              "&:hover": {
                backgroundColor: COLORS.GOOGLE_BUTTON_HOVER,
                borderColor: COLORS.GOOGLE_BUTTON_BORDER,
              },
            }}
          >
            Sign in with Google
          </Button>

          <Typography
            sx={{ mt: 2, color: COLORS.TEXT_SECONDARY, fontSize: "0.875rem" }}
          >
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: COLORS.ACCENT }}>
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
