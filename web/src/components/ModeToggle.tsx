import { Moon, Sun } from "lucide-react"
import { Switch } from "./ui/switch"
import { useTheme } from "./ui/theme-provider"

const ModeToggle = () => {
    const context = useTheme()

    return (
        <div className="gap-3 absolute right-8 top-8 items-center hidden lg:flex">
            <Switch
                className="cursor-pointer"
                onCheckedChange={() => {
                    if (context.theme === 'dark') {
                        context.setTheme('light')
                    } else {
                        context.setTheme('dark')
                    }
                }} />
            {
                context.theme === 'dark' ?
                    <Moon size={20} /> :
                    <Sun size={20} />
            }
        </div>
    )
}

export default ModeToggle