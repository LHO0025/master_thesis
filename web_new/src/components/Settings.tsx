import { useAppDispatch, useAppSelector } from "@/state/store"
import { loginUser } from "@/state/userSlice"
import { useEffect, useState } from "react"
import SettingsItem from "./SettingsItem"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const Settings = () => {
    const user = useAppSelector((state) => state.userSlice.user)
    const devices = useAppSelector((state) => state.devicesSlice.availableDevices)
    const dispatch = useAppDispatch()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        console.log(user)
    }, [user])


    function handleLogIn() {
        dispatch(loginUser({ userName: username, password: password }))
    }

    return (
        <div className="flex flex-col gap-6 justify-center w-full h-full items-center" >
            {
                user ?
                    <div className="w-full h-full flex flex-col mt-32 container ">
                        <span className="text-3xl font-semibold mb-8">Available devices</span>
                        <div className="w-full h-full mx-auto grid grid-cols-4 gap-8">
                            {/* <SettingsItem /> */}

                            {
                                devices.map(device => {
                                    return <SettingsItem device={device} />
                                })
                            }


                        </div>
                    </div>
                    :
                    <Card className="w-md">
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                In order to access settings, please enter your username and password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Username</Label>
                                    <Input
                                        type="text"
                                        required
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input id="password" type="password" required
                                        onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <Button className="w-full" onClick={handleLogIn}>
                                    Login
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
            }

        </div>
    )
}

export default Settings