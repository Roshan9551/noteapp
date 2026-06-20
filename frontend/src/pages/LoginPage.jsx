import { Button } from '#@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#@/components/ui/card.jsx';
import { Input } from '#@/components/ui/input.jsx';
import { Label } from '#@/components/ui/label.jsx';
import axiosInstance from '#@/lib/axios.js';
import useAuthStore from '#@/store/useAuthStore.js';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            const response = await axiosInstance.post("/users/login", formData);
            login(response.data.user, response.data.token);
            navigate("/");
        }catch(err){
            setError(err.response?.data?.message || "Something went wrong");
        }finally{
            setLoading(false);
        }
    }


  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
                <CardDescription>Sign in to your Nota account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary font-medium hover:underline">
                            Signup
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    </div>
  );
};

export default LoginPage
