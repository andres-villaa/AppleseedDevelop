"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Shield, Building2, User, Mail, Lock, Building } from "lucide-react"

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
import { registerOrganizacion } from "@/lib/supabase/actions"

export default function RegistroPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const password = formData.get("contrasena") as string
        const confirmPassword = formData.get("confirm_contrasena") as string

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden")
            setIsLoading(false)
            return
        }

        try {
            const result = await registerOrganizacion(formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Organización registrada exitosamente")
                router.push("/dashboard")
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado al registrar")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="mx-auto w-full max-w-lg">
                <div className="mb-8 flex flex-col items-center justify-center gap-2 text-center">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <Shield className="size-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">CumplAML</h1>
                    <p className="text-muted-foreground">Sistema de Cumplimiento ALD</p>
                </div>

                <Card className="border-border shadow-xl shadow-black/5 dark:shadow-black/20">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-bold tracking-tight">Registro de Organización</CardTitle>
                        <CardDescription>Crea una cuenta para tu OSC en la plataforma</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre de la Organización</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            id="nombre"
                                            name="nombre"
                                            placeholder="Ingresa el nombre corto o comercial"
                                            className="pl-9"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="razon_social">Razón Social</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            id="razon_social"
                                            name="razon_social"
                                            placeholder="Ingresa la razón social completa"
                                            className="pl-9"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rfc">RFC</Label>
                                        <Input
                                            id="rfc"
                                            name="rfc"
                                            placeholder="RFC de la OSC"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cluni">CLUNI</Label>
                                        <Input
                                            id="cluni"
                                            name="cluni"
                                            placeholder="Opcional"
                                        />
                                    </div>
                                </div>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contrasena">Contraseña</Label>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm_contrasena">Confirmar Contraseña</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                id="confirm_contrasena"
                                                name="confirm_contrasena"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="mt-6 w-full font-medium"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Registrando..." : "Crear cuenta"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 border-t px-6 py-4">
                        <div className="text-center text-sm text-muted-foreground">
                            ¿Ya tienes una cuenta?{" "}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Iniciar sesión
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
