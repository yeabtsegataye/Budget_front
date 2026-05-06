import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
} from "../utils/validators";
import toast from "react-hot-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail } = useAuthStore();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
  });

  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleEmailLogin = async (data) => {
    setLoading(true);
    const result = await signInWithEmail(data.email, data.password);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
    }
  };
  const handleEmailSignup = async (data) => {
    setLoading(true);
    const result = await signUpWithEmail(data.email, data.password);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
    }
  };
  const handleForgotPassword = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("If the email exists, a reset link has been sent");
        setIsForgotPassword(false);
      } else {
        toast.error(result.error || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isForgotPassword
              ? "Reset Password"
              : isLogin
                ? "Sign In"
                : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isForgotPassword ? (
              <form
                onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...forgotPasswordForm.register("email")}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your email"
                  />
                  {forgotPasswordForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {forgotPasswordForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : isLogin ? (
              <form
                onSubmit={loginForm.handleSubmit(handleEmailLogin)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...loginForm.register("email")}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your email"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...loginForm.register("password")}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your password"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={signupForm.handleSubmit(handleEmailSignup)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...signupForm.register("email")}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your email"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...signupForm.register("password")}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Create a password"
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...signupForm.register("confirmPassword")}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Confirm your password"
                  />
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            )}

            <div className="text-center space-y-2">
              {isForgotPassword ? (
                <div>
                  <p className="text-sm">
                    Remember your password?{" "}
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-primary hover:underline"
                    >
                      Back to sign in
                    </button>
                  </p>
                </div>
              ) : isLogin ? (
                <div>
                  <p className="text-sm">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </p>
                  <p className="text-sm">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              ) : (
                <p className="text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
