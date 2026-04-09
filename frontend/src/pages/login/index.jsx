import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { authSchema } from "@/utils/validation/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import axios from "@/api/axios";
import { LOGIN_URL } from "@/utils/constants/urls";
import { Eye, EyeOff, Mail, Lock, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { setAccessToken, setUserData } from "./store";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  getCookieValue,
  setValueInCookie,
  handleError,
} from "../../utils/helpers";
import { getToken, messaging } from "@/utils/firebase";
import { setUserPermissions } from "../home/store";

const Login = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const defaultFormFields = {
    username: "",
    password: "",
  };

  // 1. Define your form.
  const form = useForm({
    resolver: yupResolver(authSchema),
    defaultValues: defaultFormFields,
  });

  const [username, setUsername] = useState(defaultFormFields.username);
  const [password, setPassword] = useState(defaultFormFields.password);

  const [isSubmit, setIsSubmit] = useState(false);
  const [isAction, setIsAction] = useState(false);
  const savedAccessToken = getCookieValue("accessToken");
  const usernameInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [fcmToken, setFcmToken] = useState(false);

  getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        setFcmToken(currentToken);
      } else {
        // Show permission request UI
      }
    })
    .catch((err) => {});

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // redirect accessToken to home if exsit
  useEffect(() => {
    if (savedAccessToken) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (username && password) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [username, password]);

  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values) {
    if (!values.username || !values.password) {
      toast("Please fill all the fields");
    }

    const formData = new FormData();
    formData.append("email", values.username);
    formData.append("password", values.password);
    try {
      setIsAction(true);
      const response = await axios.post(LOGIN_URL, formData);
      if (response?.status === 200 || response?.status === 201) { 
        const responseData = response.data.data;
        // set user inside context
        setUserData(responseData.user);
        // set user inside localstorge
        localStorage.setItem("user", JSON.stringify(responseData.user));
        // set accessToken inside context
        setAccessToken(responseData.token);
        // set accessToken inside localstorge
        localStorage.setItem("accessToken", responseData.token);

        setValueInCookie("accessToken", responseData.token, 7);

        localStorage.setItem(
          "userPermissions",
          JSON.stringify(responseData.user.permissions)
        );
        setUserPermissions(responseData.user?.permissions);

        // show success notification
        toast('Success: Signed in successfully');

        navigate("/");
      }
    } catch (error) {
      setIsAction(false);
      handleError(error);
    } finally {
      setIsAction(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#E3FFF2] flex items-center justify-center p-4 font-fatimah">
      <div className="flex w-full max-w-4xl min-h-[550px] shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Left Section - Gradient Background with Arabic Text */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(139.65deg, #36A59F 23.03%, #5AC796 77.1%)' }}>
          {/* Subtle pattern overlay */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-x-1/2 -translate-y-1/2 inset-0">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="flex w-full h-full">
                <img src="/zagrafa.svg" alt="zagrafa" className="w-full" /> 
                <img src="/zagrafa.svg" alt="zagrafa" className="w-full" /> 
                <img src="/zagrafa.svg" alt="zagrafa" className="w-full" /> 
                <img src="/zagrafa.svg" alt="zagrafa" className="w-full" /> 
              </div>
              <div className="flex w-full h-full">
                <img src="/zagrafa.svg" alt="zagrafa" className="w-full" /> 
                <img src="/zagrafa.svg" alt="zagrafa" className="w-full" /> 
                <img src="/zagrafa.svg" alt="zagrafa" className="w-full" /> 
                <img src="/zagrafa.svg" alt="zagrafa" className="w-full" /> 
              </div>
            </div>
          </div>

          {/* Arabic Text Content */}
          <div className="flex flex-col justify-center items-center w-full h-full text-white text-center px-8">
              <h1 className="text-xl font-medium mb-2">{t("welcome_back")}</h1>
              <h2 className="text-5xl font-semibold mb-2">
                {t("cooperation_management_system")}
              </h2>
              <h3 className="text-2xl font-medium">{t("hypermarket")}</h3>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src="/altawoon.svg" alt="logo" width={120} height={120} />
              </div>
              <p className="text-green-700 text-sm">
                {t("login_to_cooperation_system")}
              </p>
            </div>

            {/* Login Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium mb-2">
                        {t("email")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder={t("enter_your_email")}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setUsername(e.target.value);
                            }}
                            autoComplete="username"
                            className="pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg h-12 text-gray-700 placeholder-gray-400 "
                            ref={usernameInputRef}
                          />
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium mb-2">
                        {t("Password")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("enter_your_password")}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setPassword(e.target.value);
                            }}
                            autoComplete="current-password"
                            className="pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                          />
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                            onClick={handleClickShowPassword}
                          >
                            {showPassword ? (
                              <Eye size="16" aria-hidden="true" />
                            ) : (
                              <EyeOff size="16" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                              {showPassword ? t("hide_password") : t("show_password")}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Login Button */}
                <Button
                  className="w-full h-12 rounded-lg text-white font-medium text-lg"
                  style={{ background: 'linear-gradient(90.92deg, #36A59F 0.21%, #5AC796 50.1%, #2FAD4F 99.99%)' }}
                  disabled={!isSubmit || isAction}
                  type="submit"
                >
                  {isAction ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </div>
                  ) : (
                    <span>{t("Sign In")}</span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;