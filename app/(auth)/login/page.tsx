"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Shield, Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { signIn } from "@/lib/supabase/actions"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await signIn(formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Sesión iniciada exitosamente")
                router.push("/dashboard")
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado al iniciar sesión")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="mx-auto w-full max-w-sm">
                <div className="mb-8 flex flex-col items-center justify-center gap-2 text-center">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <Shield className="size-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Appleseed</h1>
                    <p className="text-muted-foreground">Prevención de Lavado de Dinero</p>
                </div>

                <Card className="border-border shadow-xl shadow-black/5 dark:shadow-black/20">
                    <CardHeader className="space-y-1 pb-6 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">Iniciar Sesión</CardTitle>
                        <CardDescription>Ingresa a tu cuenta de organización</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="correo@organizacion.org"
                                            className="pl-9"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="contrasena">Contraseña</Label>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            id="contrasena"
                                            name="contrasena"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-9"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="mt-6 w-full font-medium"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Iniciando..." : "Ingresar al Panel"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 border-t px-6 py-4">
                        <div className="text-center text-sm text-muted-foreground">
                            ¿Aún no tienes una cuenta?{" "}
                            <Link href="/registro" className="font-semibold text-primary hover:underline">
                                Regístrate aquí
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
